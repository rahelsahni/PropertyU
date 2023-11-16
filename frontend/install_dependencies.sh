#!/bin/bash

apt update
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
apt install python3-pip -y
pip install Flask
pip install -U flask-cors
pip install pynacl
npm install
npm install cookies-next
npm install react-icons
npm install tweetnacl
npm install tweetnacl-util
npm install crypto-js
npm install react-google-autocomplete
npm install @react-google-maps/api
npm install react-beautiful-dnd
npm install sweetalert2
npm install @fullcalendar/common
npm install @fullcalendar/interaction
npm install @fullcalendar/react
npm install @fullcalendar/timegrid
npm install @fullcalendar/daygrid
npm install next-transpile-modules @babel/preset-react
