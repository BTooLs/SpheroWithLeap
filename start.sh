#!/bin/bash

service bluetooth start
sdptool browse #this fixes a bug in ubuntu/bluetooth/blueman locked port

#TODO get address from hcitool scan | 
#rfcomm release 0 68:86:E7:03:C2:8A
rfcomm release 1 68:86:E7:03:C2:8A

echo "Mounting sphere"
rfcomm bind 1 68:86:E7:03:C2:8A
rfcomm connect 1 68:86:E7:03:C2:8A 1
rfcomm -a
sleep 1
echo "Starting app"
node --debug app.js
sleep 1
echo "Unmount sphere"
rfcomm release 1 68:86:E7:03:C2:8A
rfcomm -a
