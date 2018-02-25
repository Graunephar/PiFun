#!/bin/bash

#Naive and barebone startup script for node

echo "Push recieved running script" #Print something so we know we have acess

killall node #Kill every old instance of node

#Goto working dir
cd "$(dirname "$0")"


npm install #install dependencies from package.json (pro-tip use auto-install to keep this in sync)

#Start node js
npm start
