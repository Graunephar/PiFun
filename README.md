# The demo

This repository describes a demo done in the course ITWoT 2018

## Pre demo setup

1. Get the image from the course site and burn it to a new SD card using Etcher as described [here](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)  

2. Without powering the Pi, connect a screen, keyboard and mouse, and insert the SD card. 

3. Plug the power cable in and wait for the Pi to boot up for the first time. This might take some time. If it does not work troubleshoot by following [this guide](https://www.raspberrypi.org/learning/troubleshooting-guide/)

3. Connect the Pi to your own hotspot (created from a phone or alike) by clicking the wifi icon in the top right corner of the screen.

3. Click in the termninal logo in the top bar of the screen, this will open a new terminal.

3. From this terminal type in `passwd` this will start up a guide that helps you change the password on the Pi, you can read more about how that works [here](https://www.raspberrypi.org/documentation/configuration/security.md). Rememeber that the standard password is "raspberry" and the user name is pi

3. From the same terminal run `ifconfig` to get you current IP adress. The output from ifconfig will look something like this:


```bash
wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.43.137  netmask 255.255.255.0  broadcast 192.168.43.255
        inet6 fe80::a784:3112:b706:205e  prefixlen 64  scopeid 0x20<link>
        ether b8:27:eb:c0:51:e9  txqueuelen 1000  (Ethernet)
        RX packets 345  bytes 34128 (33.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 298  bytes 37791 (36.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
Look for the ip adress just after inet. In this case the current Ip adress is 192.168.43.137

## The demo

### SSH connection to the Pi

1. From your own terminal run `ssh <USERNAME>@<IP ADRESS>`. In this example that means the correct command is `ssh pi@192.168.43.137`. This will establish a remote connection to the Pi. The Pi will ask for the password you have set in the beginning of this guide. After entering you password you will be connected to the Pi which means that whatever you type will run on the Pi, and the output you get is the output from the pi. This is indicated by the `pi@raspberrypi:~ $` prefix you see in your terminal

### SSH access without password.

In the following section we will use[this guide](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md). Below is an adapted description of the commands.

1. From a terminal with SSH access (as established earlier). Run the two following command

```bash
ssh-keygen -t rsa -C pi@pi #generate a new key
#Follow the guide (by pressing enter three times
exit #this closes the ssh session

```


2. You have now aborted the connection to the Pi and are in you own terminal. Verify that this is correct by observing that the prefix mentioned before is not there.

3. Run the following code from your own terminal: `cat ~/.ssh/id_rsa.pub | ssh pi@<YOUR IP> 'cat >> .ssh/authorized_keys'` In our example with he IP from before the commands looks like this.


```bash
cat ~/.ssh/id_rsa.pub | ssh pi@192.168.43.137 'cat >> .ssh/authorized_keys'
```

4. Enter your password set in the beginning of this guide. 


5. We have not successfully copied our own ssh key onto the Pi. Verify this by starting a new SSH connection with the command `ssh <USERNAME>@<IP ADRESS>`. If we have been successfull the Pi will not ask for a password like it have done earlier. 

We can now establish ssh connections without a password and can concentrate on pushing code to the Pi.


### Setting up the Pi as a git remote.
 

We will now follow [this guide](https://github.com/Graunephar/Unstructured-TA-Pi-Demo-postdescription-itwot18) below is an adaptation of the commands:


1. Establish an ssh connection to the Pi with the command `ssh <USERNAME>@<IP ADRESS>`

2. From the terminal conmnected to the Pi via SSH, create a new folder for containing the code we will push later. For now we want it to be placed in the home folder and be called deploy. This is achieved by running this command 'mkdir ~/deploy` the `~` character refers to the path to the home folder.

3. Create a new empty git repository for recieving our code later. This is done using this command `git init --bare ~/project.git`

4. A git project has socalled hooks which is scripts thar are automatically run when something changed. We want a new script that will run after new code has been pushed. Create a new hook in the git repo by using the text editor Nano nano is a basic editor that works from a terminal. This is done by running the following command. 

```bash
nano ~/project.git/hooks/post-receive
```

#This creates a file called post-recieve in the path /home/pi/project.git/hooks/ and opens the file in the Nano editor
'''

5. You will now find yourself in a very strange enviroment. Do not worry, it is just an editor. Although it is running through a terminal. Copy the script from below and paste it into nano using Ctrl+V. Save the file by pressing Ctrl + O and thereafter enter. Exit nano by pressing Ctrl + X.

```bash
#!/bin/bash
while read oldrev newrev ref
do
    # This if statements checks what have been pushed. And runs the commands inside if it is pushed from the master branch.
    if [[ $ref =~ .*/master$ ]];
    then
        echo "Master ref received.  Deploying master branch to production..." #This writes ouyt a nice little message
        git --work-tree=/home/pi/deploy/ --git-dir=/home/pi/project.git/ checkout -f #Then we copy the files from git into the folder we created in the first steps
	bash /home/pi/deploy/run.sh #this runs a file from the reposotory called run.sh, this does not exist yet, but we will add it to our repo later. 

    else
        echo "Ref $ref successfully received.  Doing nothing: only the master branch may be deployed on this server."
    fi
done
```

The script to paste into the post-receive file. The script is just a series of terminal commands and a simple if statement.


 
6. Before the script can execute we need to mark it as executable. You do this by running the following command: `chmod +x ~/project.git/hooks/post-receive`

7. When you are finished exit the ssh session by running the command `exit`

### Setting up git to push to the Pi

The following steps should be executed on your own computer without an ssh connection

1. Make a new git repositoty like you have done before and cd into the directory. You can set it up using the guide from gitlab as you have done earlier in the course. 

2. We shall now add the Pi as a remote so we can push code directly onto it from git. This is done with the following command `git remote add pi pi@<IP ADDRESS>:project.git`

In the example with the IP from before the commands will be `git remote add pi pi@192.168.43.137:project.git`

This will add a new remote to git, just like gitlab is a remote. The name of the remote will be pi.

3. Put the code into your new git repository. Above this guide you will find the js files from the lecture and an example of a run.sh script. Add this files to git and commit the result. Just like you have done before. THe run.sh script is also shown below. This is the file that the post recieve hook that we have just setup is running.

```bash
#!/bin/bash

#Naive and barebone startup script for node

echo "Push recieved running script"

killall node #Kill every old instance of node


#Goto working dir
cd "$(dirname "$0")"


npm install #install dependencies from package.json (pro-tip use auto-install to keep this in sync)

#Start node js
node blink.js #rename this if you want to run something else
```

4. You can now push to the Pi bu running the command `git push pi master` from your repository. This will push your code onto the Pi just like `git push` pushes the code to gitlab.

After the push has succeded the terminal will show the output from the Pi running the run.sh script.


### A note on ther script

** Auto installation **

As you can see the script will try to run `npm install` to install any npm packages that are missing. This only works if you have an updated package.json file. You can see an example of this in the files above. The one in this repo will have onoff and node-dht-sensor as dependencies which means that they will auto install when npm install getx executed from the same firectory as the file. 

** Removing output ** 

If you do not want to see the output from node you can make the a command run from a detached terminal by poistfixing it with &. If you change the last line of run.sh to `node blink.js &` you won't see any output from node.



