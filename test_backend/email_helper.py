import smtplib
import ssl

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

#
# Helper functions to handle sending emails to tenants/property managers for each respective situation
#
def send_mail(link, receiver):
    # Define the transport variables
    ctx = ssl.create_default_context()
    password = "wlurzuukfieldgeb"    # Your app password goes here
    sender = "propertyu.devteam@gmail.com"    # Your e-mail address
    #receiver = receiver[0] # Recipient's address
    print(receiver)

    # Create the message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your password reset link"
    message["From"] = sender
    message["To"] = receiver

    # Plain text alternative version
    plain = """\
    Here is your password reset link: 
    """
    plain = plain + link

    message.attach(MIMEText(plain, "plain"))
    #message.attach(MIMEText(html, "html"))

    # Connect with server and send the message
    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.sendmail(sender, receiver, message.as_string())

def property_email(tenant_email, tenant_fname, address, link):

    ctx = ssl.create_default_context()
    password = "wlurzuukfieldgeb"    # Your app password goes here
    sender = "propertyu.devteam@gmail.com"    # Your e-mail address
    #receiver = receiver[0] # Recipient's address
    #print(receiver)

    # Create the message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your house has been added to our service"
    message["From"] = sender
    message["To"] = tenant_email

    # Plain text alternative version
    plain = "Hi " + tenant_fname + ","
    plain = plain + '\n\n'
    plain = plain + "Your home at " + address + " has been added to our property management service by your property manager. "
    plain = plain + "As part of our service, you may request an inspection of your home using this personalised link: "
    plain = plain + '\n\n'
    plain = plain + link + '\n\n'
    plain = plain + "Please direct any further questions you may have towards your property manager."
    plain = plain + '\n\n'
    plain = plain + "From,\nThe PropertyU Team."

    message.attach(MIMEText(plain, "plain"))
    #message.attach(MIMEText(html, "html"))

    # Connect with server and send the message
    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.sendmail(sender, tenant_email, message.as_string())

def cancel_email(time_date, address):

    ctx = ssl.create_default_context()
    password = "wlurzuukfieldgeb"    # Your app password goes here
    sender = "propertyu.devteam@gmail.com"    # Your e-mail address
    #receiver = receiver[0] # Recipient's address
    #print(receiver)

    # Create the message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your inspection has been cancelled"
    message["From"] = sender
    message["To"] = address[1]

    # Plain text alternative version
    plain = "Hi " + address[2] + ","
    plain = plain + '\n\n'
    plain = plain + "The inspection scheduled at " + time_date[0] + " " + time_date[1] + " for " + address[0] + " has been cancelled."
    plain = plain + '\n\n'
    plain = plain + "Please direct any further questions you may have towards your property manager."
    plain = plain + '\n\n'
    plain = plain + "From,\nThe PropertyU Team."

    message.attach(MIMEText(plain, "plain"))
    #message.attach(MIMEText(html, "html"))

    # Connect with server and send the message
    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.sendmail(sender, address[1], message.as_string())

def add_stop_email(address, start_time, date):

    ctx = ssl.create_default_context()
    password = "wlurzuukfieldgeb"    # Your app password goes here
    sender = "propertyu.devteam@gmail.com"    # Your e-mail address
    #receiver = receiver[0] # Recipient's address
    #print(receiver)

    # Create the message
    message = MIMEMultipart("alternative")
    message["Subject"] = "An inspection has been scheduled"
    message["From"] = sender
    message["To"] = address[1]

    # Plain text alternative version
    plain = "Hi " + address[2] + ","
    plain = plain + '\n\n'
    plain = plain + "An inspection for " + address[0] + " has been scheduled at " + start_time + " " + date + "."
    plain = plain + '\n\n'
    plain = plain + "Please direct any further questions you may have towards your property manager."
    plain = plain + '\n\n'
    plain = plain + "From,\nThe PropertyU Team."

    message.attach(MIMEText(plain, "plain"))
    #message.attach(MIMEText(html, "html"))

    # Connect with server and send the message
    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.sendmail(sender, address[1], message.as_string())