"""
CS3216 Final Assignment Group 3
-> fab deploy
"""

import requests
import time

from fabric.api import *
from fabric.colors import *

PROJECT_PATH = '/home/ubuntu/2013-final-project-3/src/nuttyninjas'
AWS_IP = '54.251.188.20'
SERVER = [AWS_IP]
env.user = 'ubuntu'
env.key_filename = '~/.ssh/gsync.pem'
port = '3216' 


def sanity_check():
    time.sleep(2)
    print(yellow('Sanity check...\nPinging the following urls:\n'))
    host = 'http://'+ AWS_IP + ':' + port
    urls = ('/')
    for url in urls:
        time.sleep(1)
        status = requests.get(host+url).status_code
        if status == 200:
            print(white(host+url+'....')+green('OK'))
        else:
            print(white(host+url+'....')+red('ERROR'))
            return 1
            break


@hosts(SERVER)
def deploy():
    print(cyan('->  Connected to server'))
    with cd('%s' % PROJECT_PATH):
        print(yellow('Check out latest code ...'))
        run("git remote update && git reset --hard origin/master")
        print(yellow('Install dependencies ...'))
        run("npm install");
        print(yellow('Restart Server ...'))
        time.sleep(1)
        with settings(warn_only=True):
            run("forever stop app.js")
        run("forever start app.js")
        sanity_check_status = sanity_check()
        if sanity_check_status == 1:
            print(red('\n-> Deployment error.'))
        else:
            print(green('\n-> Deployment succesful! :)'))
