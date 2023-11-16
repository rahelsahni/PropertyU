from distutils.util import execute
import json
from os import popen
import sqlite3
import base64

from flask import jsonify
import email_helper
import encryption_helper
import datetime
import hashlib

KEY = "D*FaJaNdRgUkXp2s"

#
# Helper functions to handle database queries and data insertion/callback for each respective API call 
# POST, GET
#

## Sign Up Helper
def get_all_users():

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    users = cursor.execute("SELECT id, email, password, first, last FROM users").fetchall()

    connection.close()
    return users

## Property List Helper
def get_all_properties():

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    properties = cursor.execute("SELECT * FROM properties").fetchall()

    connection.close()
    return properties

## Sign Up Helpers
def check_user(email, password):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    user = cursor.execute("SELECT id, password FROM users WHERE email=?", (email,)).fetchone()
    password = hashlib.sha256(password.encode())
    password = password.hexdigest()

    if user is None:
        user = "NUSER"

    elif password != user[1]:
        user = "NPASS"
    else:
        user = encryption_helper.encrypt(str(user[0]))

    connection.close()
    return user

def add_user(email, password, fname, lname):

    user = check_user(email, password)
    hashed = hashlib.sha256(password.encode())

    if user == "NUSER":
        connection = sqlite3.connect("users.db")
        cursor = connection.cursor()

        cursor.execute("INSERT INTO users (email, password, first, last) VALUES (?,?,?,?)", (email, hashed.hexdigest(), fname, lname))
        connection.commit()

        connection.close()
        return "TUSER"
    
    else:
        return "FUSER"

## Add Property Helper
def add_property(manager, add1, lat, lng, place_id, frequency, tenName, tenNum, tenEmail, pref, ownName, ownNum, ownEmail):
    
    connection = sqlite3.connect("users.db")

    cursor = connection.cursor()
    
    cursor.execute("INSERT INTO properties (manager, to_be_inspected, next_inspection, address1, latitude, longitude, place_id, frequency, tenName, tenNum, tenEmail, preferences, ownName, ownNum, ownEmail) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                   (manager, "Due", int(datetime.datetime.now().timestamp()), add1, lat, lng, place_id, frequency, tenName, tenNum, tenEmail, pref, ownName, ownNum, ownEmail))
        
    property_id = cursor.execute('SELECT id FROM properties WHERE manager=' + str(manager)).fetchall()[-1][0]

    message = str(property_id)

    url_message = encryption_helper.encrypt(message)

    req_link = "http://127.0.0.1:3000/request?id=" + url_message

    email_helper.property_email(tenEmail, tenName, add1, req_link)
    
    connection.commit()

    connection.close()
    
    return str(property_id)
        
## Profile Page Helpers
def edit_user(token, email, fname, lname):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    user = cursor.execute("SELECT id, password FROM users WHERE email=?", (email,)).fetchone()

    if (user is None) or (str(user[0]) == str(token)):
        cursor.execute("UPDATE users SET first=? WHERE id=?", (fname, token))
        cursor.execute("UPDATE users SET last=? WHERE id=?", (lname, token))
        cursor.execute("UPDATE users SET email=? WHERE id=?", (email, token))
    else:
        return "FUSER"

    connection.commit()

    connection.close()
    return "TUSER"


def get_user(token):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    user = cursor.execute("SELECT first, last, email FROM users WHERE id=?", (token,)).fetchone()

    data = {
        "fname": user[0],
        "lname": user[1],
        "email": user[2]
    }

    return json.dumps(data)

## Forgot Password Helper
def forgot(email):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    user = cursor.execute("SELECT email FROM users WHERE email=?", (email,)).fetchone()

    if user is None:
        return "NUSER"
    
    email = user[0]
    message = email
    message = message.encode('ascii')
    base64_bytes = base64.b64encode(message)
    base64_message = base64_bytes.decode('ascii')

    reset_link = "http://127.0.0.1:3000/reset?code=" + base64_message

    email_helper.send_mail(reset_link, email)

    return "TFORGOT"

## Property List / Edit Property Helpers
def get_properties(manager):
    
    update_statuses()
    
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    
    properties = cursor.execute("SELECT * FROM properties WHERE manager = " + str(manager)).fetchall()

    res = []
    
    for x in properties:
        y = {
            "id": x[0],
            "manager": x[1],
            "to_be_inspected": x[2],
            "next_inspection": x[3],
            "address1": x[4],
            "frequency": x[8],
            "tenName": x[9],
            "tenNum": x[10],
            "tenEmail": x[11],
            "preferences": x[12],
            "ownName": x[13],
            "ownNum": x[14],
            "ownEmail": x[15]
        }
        res.append(y)
    
    connection.commit()

    connection.close()
    
    return json.dumps(res)

def request_edit(token, id_):
    
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    
    y = cursor.execute("SELECT * FROM properties WHERE id = " + str(id_)).fetchall()
    x = y[0]
    res = {
            "id": x[0],
            "manager": x[1],
            "to_be_inspected": x[2],
            "next_inspection": x[3],
            "address1": x[4],
            "frequency": x[8],
            "tenName": x[9],
            "tenNum": x[10],
            "tenEmail": x[11],
            "preferences": x[12],
            "ownName": x[13],
            "ownNum": x[14],
            "ownEmail": x[15]
        }
    
    return res
    

def edit_property(id_, manager, add1, frequency, tenName, tenNum, tenEmail, preferences, ownName, ownNum, ownEmail):
    
    connection = sqlite3.connect("users.db")

    cursor = connection.cursor()
    
    if preferences == "0000000":
        preferences = cursor.execute("SELECT preferences FROM properties WHERE id=" + str(id_)).fetchall()[0][0]
    
    cursor.execute("UPDATE properties SET address1=?, frequency=?, tenName=?, tenNum=?, tenEmail=?, preferences=?, ownName=?, ownNum=?, ownEmail=? WHERE id=?", 
                   (add1, frequency, tenName, tenNum, tenEmail, preferences, ownName, ownNum, ownEmail, id_))
    
    connection.commit()

    connection.close()
    
    return "SUCCESS"

def get_property(property_id):
    
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    
    properties = cursor.execute("SELECT address1, tenEmail FROM properties WHERE id=?", (property_id,)).fetchone()

    data = {
        "addr1": properties[0],
        "email": properties[1]
    }
    
    connection.commit()

    connection.close()
    
    return json.dumps(data)


def get_property_status(property_id):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    properties = cursor.execute(
        "SELECT address1, to_be_inspected FROM properties WHERE id=?", (property_id,)).fetchone()

    data = {
        "addr1": properties[0],
        "status": properties[1]
    }

    connection.commit()

    connection.close()

    return json.dumps(data)

## Schedule/Itineray Helper
def get_coordinates(token):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    coordinates = cursor.execute("SELECT address1, latitude, longitude, place_id, id, to_be_inspected, preferences FROM properties WHERE manager = " + str(token)).fetchall()

    res = []
    index = 0
    for x in coordinates:
        res.append({'id':index, 'address': x[0], 'position':{ 'lat': x[1], 'lng': x[2]}, 'place_id':x[3], 'property_id':x[4], 'status':x[5], 'preferences':x[6], 'index':0, 'duration': 0})
        index += 1

    return json.dumps(res)

## Reset password Helper
def reset(email, password):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    password = hashlib.sha256(password.encode())
    password = password.hexdigest()
    cursor.execute("UPDATE users SET password=? WHERE email=?", (password, email))
    connection.commit()
    connection.close()

    return "TRESET"

def i_request(prop_id):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    
    cursor.execute("UPDATE properties SET to_be_inspected='Urgent' WHERE id=?", (prop_id,))
    
    connection.commit()
    connection.close()

    return "TREQ"


def update_statuses():
    
    currentTime = int(datetime.datetime.now().timestamp())
    adjustedTime = int((datetime.datetime.now() + datetime.timedelta(days=-90)).timestamp())
    
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    
    cursor.execute("UPDATE properties SET to_be_inspected='Due' WHERE ?>=next_inspection AND to_be_inspected!='Urgent' AND to_be_inspected!='Scheduled'", (str(currentTime),))
    
    cursor.execute("UPDATE properties SET to_be_inspected='Urgent' WHERE ?>=next_inspection AND to_be_inspected!='Urgent' AND to_be_inspected!='Scheduled'", (str(adjustedTime),))
    
    locations = cursor.execute("SELECT location FROM itineraries").fetchall()
    for x in locations:
        loc = x[0]
        date = cursor.execute("SELECT date FROM itineraries WHERE location=?", (loc,)).fetchone()[0].replace('-', '')
        
        obj = datetime.datetime.strptime(date, '%Y%m%d').date()
        comp = datetime.datetime.now().date()
        
        if (comp > obj):
            cursor.execute("UPDATE properties SET to_be_inspected='Not Due' WHERE id=?", (loc,))
            frequency = cursor.execute("SELECT frequency FROM properties WHERE id=?", (loc,)).fetchone()[0]
            newInspection = int((datetime.datetime.now() + datetime.timedelta(days=(frequency*30))).timestamp())
            cursor.execute("UPDATE properties SET next_inspection=? WHERE id=?", (newInspection, loc))
        
    
    
    
    connection.commit()
    connection.close()

## Calendar Helpers

def add_itinerary_stop(manager, location, date, start_time):

    connection = sqlite3.connect("users.db")

    cursor = connection.cursor()

    cursor.execute("INSERT INTO itineraries (manager, location, date, start_time) VALUES (?,?,?,?)",
                   (manager, location, date, start_time,))

    address = cursor.execute("SELECT address1, tenEmail, tenName FROM properties WHERE id=?", (location,)).fetchone()

    cursor.execute("UPDATE properties SET to_be_inspected='Scheduled' WHERE id=?", (location,))

    email_helper.add_stop_email(address, start_time, date)

    connection.commit()

    connection.close()

    return "ADDIT"


def get_events(manager):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    events = cursor.execute(
        "SELECT * FROM itineraries WHERE manager = " + manager).fetchall()

    res = []

    currentDate = datetime.datetime.now()
    allDate = []
    allColor = []

    for x in events:
        expectedDate = datetime.datetime.strptime(
            str(x[2])+" "+str(x[3]), "%Y-%m-%d %H:%M")
        property_info = json.loads(get_property_status(x[1]))
        colour = ""

        # inspection has occured-> grey colour
        if currentDate > expectedDate:
            colour = "#A9A9A9"
        elif property_info['status'] == "Urgent":
            # inspection is urgent -> red colour
            colour = "#D22B2B"
        else:
            # regular inspection -> blue colour
            colour = "#7393B3"

        # All day inspection toggle thing
        # Colour should be grey, red or default blue
        if (str(x[2])) not in allDate:
            allDate.append(str(x[2]))
            allColor.append(colour)
        else:
            if (allColor[allDate.index(str(x[2]))] == "#7393B3"):
                if colour == "#D22B2B":
                    allColor[allDate.index(str(x[2]))] = "#D22B2B"
                elif colour == "#A9A9A9":
                    allColor[allDate.index(str(x[2]))] = "#A9A9A9"

        y = {
            "id": x[1],
            "title": property_info['addr1'],
            "start": str(x[2])+"T"+str(x[3]),
            "color": colour
        }
        res.append(y)

    if (allDate != []):
        for i in range(0, len(allDate)):
            y = {
                "title": "Inspection Itinerary",
                "date": allDate[i],
                "allDay": "true",
                "color": allColor[i]
            }
            res.append(y)

    connection.commit()

    connection.close()

    return json.dumps(res)

def cancel_inspection(date, manager):

    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    dat = date.split('T', 1)[0]
    dat = str(dat[1:])

    time_date = cursor.execute("SELECT start_time, date, location FROM itineraries WHERE date=? AND manager=?", (dat, manager)).fetchall()
    for x in time_date:
        address = cursor.execute("SELECT address1, tenEmail, tenName FROM properties WHERE id=?", (x[2],)).fetchone()
        cursor.execute("UPDATE properties SET to_be_inspected='Urgent' WHERE id=?", (x[2],))
        email_helper.cancel_email(x, address)

    cursor.execute("DELETE FROM itineraries WHERE date=? AND manager=?", (dat, manager))

    connection.commit()
    connection.close()

    return "CANCELLED"

def add_to_inspection_pool(prop_id):
    
    
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    time = int(datetime.datetime.now().timestamp())
    
    cursor.execute("UPDATE properties SET to_be_inspected='Due' WHERE id=?", (prop_id,))
    cursor.execute("UPDATE properties SET next_inspection=? WHERE id=?", (time, prop_id))
    cursor.execute("DELETE FROM itineraries WHERE location=?", (prop_id,))
    
    connection.commit()
    connection.close()
    
    return "Success"
