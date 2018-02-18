#!/bin/bash

#Barebone startup script for node

killall node #Kill every old instance of node

auto-install && npm install #install dependencies

#Goto working dir
cd "$(dirname "$0")"

#Start node js 
node EasyBlink.js