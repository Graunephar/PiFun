#!/bin/bash

#Barebone startup script for node

killall node #Kill every old instance of node

#Goto working dir
cd "$(dirname "$0")"


auto-install && npm install & #install dependencies

#Start node js 
node readtemp.js