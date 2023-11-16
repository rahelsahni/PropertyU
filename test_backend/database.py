import sqlite3
from sre_constants import SUCCESS
from flask import Flask, json, request
from flask_cors import CORS
import helpers
import os

api = Flask(__name__)
CORS(api)

#
# API routes for communication between frontend and backend using Flask
#

## Sign Up API
@api.route('/all_users', methods=['GET'])
def get_users():
    return helpers.get_all_users()

## Property List API
@api.route('/all_properties', methods=['GET'])
def all_properties():
    return helpers.get_all_properties()

## Sign Up API's
@api.route('/check_user', methods=['POST'])
def check_user():

    email = request.json.get('email')
    password = request.json.get('password')
    user = helpers.check_user(email, password)

    return user

@api.route('/add_user', methods=['POST'])
def add_user():

    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    password = request.json.get('password')
    message = helpers.add_user(email, password, fname, lname)

    return message

## Add Property API
@api.route('/add_property', methods=['POST'])
def add_property():
    
    manager = request.json.get('manager')
    add1 = request.json.get('add1')
    lat = request.json.get('lat')
    lng = request.json.get('lng')
    place_id = request.json.get('place_id')
    frequency = request.json.get('frequency')
    tenName = request.json.get('tenName')
    tenNum = request.json.get('tenNumber')
    tenEmail = request.json.get('tenEmail')
    pref = request.json.get('pref')
    ownName = request.json.get('ownName')
    ownNum = request.json.get('ownNum')
    ownEmail = request.json.get('ownEmail')
    
    message = helpers.add_property(manager, add1, lat, lng, place_id, frequency, tenName, tenNum, tenEmail, pref, ownName, ownNum, ownEmail)
    
    return message
    
## Image upload API
@api.route('/upload_image', methods=['POST'])
def upload_image():
        
    image = request.files['image']
    image.save(os.path.join(os.path.abspath('..') + "/frontend/public/pictures", image.filename))
    
    return "True"

## Profile Page API's
@api.route('/edit_user', methods=['POST'])
def edit_user():

    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    token = request.values.get('token')

    message = helpers.edit_user(token, email, fname, lname)

    return message

@api.route('/get_user', methods=['GET'])
def get_user():

    token = request.values.get('token')
    data = helpers.get_user(token)
    return data

## Forgot password API
@api.route('/forgot', methods=['GET'])
def forgot():

    email = request.values.get('email')
    response = helpers.forgot(email)

    return response

## Property list API's
@api.route('/get_properties', methods=['GET'])
def get_properties():
    
    token = request.values.get('token')
    data = helpers.get_properties(token)
    
    return data 

@api.route('/get_property', methods=['GET'])
def get_property():
    
    property_id = request.values.get('id')
    data = helpers.get_property(property_id)
    
    return data

## Schedule/Itinerary API
@api.route('/get_coordinates', methods=['GET'])
def get_coordinates():
    
    token = request.values.get('token')
    data = helpers.get_coordinates(token)
    
    return data 

## Reset password API
@api.route('/reset', methods=['POST'])
def reset():

    email = request.json.get('email')
    password = request.json.get('password')

    response = helpers.reset(email, password)

    return response

## Edit Property APIs
@api.route('/request_edit', methods=['GET'])
def request_edit():
    
    token = request.values.get('token')
    id_ = request.values.get('id')
    data = helpers.request_edit(token, id_)
    
    return data

@api.route('/edit_property', methods=['POST'])
def edit_property():
    
    id_ = request.json.get('id')
    manager = request.json.get('manager')
    add1 = request.json.get('add1')
    frequency = request.json.get('frequency')
    tenName = request.json.get('tenName')
    tenNum = request.json.get('tenNum')
    tenEmail = request.json.get('tenEmail')
    preferences = request.json.get('pref')
    ownName = request.json.get('ownName')
    ownNum = request.json.get('ownNum')
    ownEmail = request.json.get('ownEmail')
    
    message = helpers.edit_property(id_, manager, add1, frequency, tenName, tenNum, tenEmail, preferences, ownName, ownNum, ownEmail)

    return message

@api.route('/i_request', methods=['POST'])
def i_request():

    prop_id = request.json.get('prop_id')

    response = helpers.i_request(prop_id)

    return response

## Calendar/Event/Itinerary APIs
@api.route('/get_events', methods=['GET'])
def get_events():
    
    token = request.values.get('token')
    data = helpers.get_events(token)
    
    return data

@api.route('/cancel_inspection', methods=['DELETE'])
def cancel_inspection():

    date = request.values.get('date')
    manager = request.values.get('manager')

    response = helpers.cancel_inspection(date, manager)

    return response

@api.route('/add_itinerary_stop', methods=['POST'])
def add_itinerary_stop():

    manager = request.json.get('manager')
    location = request.json.get('location')
    date = request.json.get("date")
    start_time = request.json.get("start_time")

    message = helpers.add_itinerary_stop(manager, location, date, start_time)

    return message
    
@api.route('/add_to_inspection_pool', methods=['POST'])
def add_to_inspection_pool():

    prop_id = request.json.get('id')
    response = helpers.add_to_inspection_pool(prop_id)
    
    return response

if __name__ == '__main__':
    api.run() 