#!/bin/bash

service bluetooth start
#sdptool browse

CHANNEL=1 
SPHERO=`hcitool scan | grep Sphero | head -1`
MAC=`echo "$SPHERO" | awk '{print $1}'`
NAME=`echo "$SPHERO" | awk '{print $2}'`
DEV="/dev/rfcomm$CHANNEL"
if [[ -z $SPHERO ]]; then
	echo "No sphero found"
	exit	
fi

echo "Found sphero $NAME with $MAC "

#rfcomm release 0 68:86:E7:03:C2:8A
rfcomm release $CHANNEL $MAC

echo "Mounting sphere"
rfcomm bind $CHANNEL $MAC
rfcomm connect $CHANNEL $MAC
rfcomm -a
sleep 1
echo "Starting app"
node --debug app.js $DEV
#sleep 1
#echo "Unmount sphere"
#rfcomm release $CHANNEL $MAC
#rfcomm -a
