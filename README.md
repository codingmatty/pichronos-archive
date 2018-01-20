# PiChronos

An Open Source Raspberry Pi Advanced Alarm Clock

---

## Summary

This is a pet project to build a better alarm clock that has all the features that I want without having to depend on some company to do it for me. (I don't mention cost, because this project isn't exactly cheaper than the alternative).

The basic architecture is a Raspberry Pi running a Node Server serving a React App presented through a Chromium instance set up in kiosk mode.

The Node server handles configuration, and hardware control, as well as scheduling and emitting events for the alarms. The nifty thing about using a Node server is that along side the clock display, it can serve a web interface for configuring the alarm.

Anyone familiar with frontend web development can easily set this project up using the steps below and create their own interface.

## Features

### Current

* Display Time

### Roadmap

* Configure multiple alarms.
  * Should have plenty of configuration (i.e. what days should the alarm fire)
* Configure alarms via mobile device.
* Ability to control screen brightness
* Screen bright auto-controlled
  * Via time, or ambient lighting, maybe motion?
* Weather Display
* Customize alarm sounds
* Customize background
* External LED strip to simulate sunrise
* Music via 3rd Party services (i.e. iHeartRadio, Spotify, Pandora)
* IFTTT Integration (buttons to turn off lights via Wink)
* News, Quote of the day, etc..

## Setup

Download Raspbian Desktop and install to a microSD:

* [Download](https://www.raspberrypi.org/downloads/raspbian/)
* [Install to microSD](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
  * [via CLI for MacOS](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)
* [Setup SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/)

_The rest can be done using SSH (ssh pi@raspberrypi.local)_

Initial setup of Raspberry Pi and dependencies

```
$ sudo apt-get update && sudo apt-get upgrade -y
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs chromium-browser x11-xserver-utils unclutter
```

Clone this repository and install dependencies:

_Note: I will find a better way to deploy_

```
$ git clone https://github.com/codingmatty/pichronos.git
$ cd pichronos.git
$ npm install
$ npm build
```

Setup system to automatically start the server by copying the daemon service file to the system and enable it at startup:

_Note: Make sure to update the service file if the `<PiChronos_Directoy>` is not `/home/pi/`_

```
$ cp bin/pichronos.service /etc/systemd/system
$ systemctl enable myapp
```

Update autostart file to open Chromium in kiosk mode on bootup:

```
$ sudo nano ~/.config/lxsession/LXDE-pi/autostart
```

Copy the following into `~/.config/lxsession/LXDE-pi/autostart`:

```
lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium-browser/Default/Preferences
@chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:4001 --incognito
```

Edit permissions for LCD Backlight (permissions will update on startup):

```
$ sudo echo SUBSYSTEM=="backlight",RUN+="/bin/chmod 666 /sys/class/backlight/%k/brightness /sys/class/backlight/%k/bl_power" >  /etc/udev/rules.d/backlight-permissions.rules
```

Reboot device:

```
$ sudo reboot
```

### Update

```
$ cd <PiChronos_Directoy>
$ git pull
$ npm build
$ sudo reboot
```

_Note: Once I find a better way to deploy, this will change to not have to build every time_

_Note: There is probably a better way than having to reboot the system..._

### Resources

* [Raspberry Pi Kiosk Screen Tutorial](https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/)
* [How to deploy Node App on Linux (2016)](https://certsimple.com/blog/deploy-node-on-linux)

## Hardware

* [Raspberry Pi 3 (Model B)](https://www.sparkfun.com/products/13825)
* [Raspberry Pi LCD - 7" Touchscreen](https://www.sparkfun.com/products/13733)
* TBD
