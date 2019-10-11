# DoomFirePy
PSX Doom Fire effect implemented on Python using Kivy

This code displays a fire animation effect by manipulating pixel colors, based on original PSX Doom implementation.

Screenshot:

![2019-03-08 13_09_18-doomfire](https://user-images.githubusercontent.com/2021800/54040157-7c284780-41a3-11e9-85f5-d63cbeb726b9.png)


After implementing the same algorithm on Qt I've came across the Kivy framework and give it a try. The Doom Fire effect seemed to be the perfect fit for this initial test.

This code is based on the article from:
https://github.com/fabiensanglard/DoomFirePSX/blob/master/flames.html

It uses Kivy framework:
https://kivy.org/

kivy also needs some dependencies installed, follow instruction on kivy site to setup the environment.

(i'm doing this on Windows, but Linux users should know better ;)
Step by step environment config, assuming you have python already installed and the according C build environment related to the python version, see:

https://wiki.python.org/moin/WindowsCompilers

* Open a  command line of the at the project folder.
* Run python (i'm calling the complete path of the python.exe, but if you have it on path, just call python) with the following command to create a virtual env.:

`C:\DoomFirePy\>c:\Python34\python.exe -m venv .\venv`

* Next step is to activate this venv

`C:\DoomFirePy\>.\venv\Scripts\activate.bat`

* The prompt should change to something like this:

`(venv) C:\DoomFirePy\>`

* Now from this environment call pip installer to use the requirements.txt and install the dependencies.:

`(venv) C:\DoomFirePy>pip install -r requirements.txt`

* At last execute the project from using the venv:

`(venv) C:\DoomFirePy>python doom_fire.py`

* ...and you should see this window:

![fire](https://user-images.githubusercontent.com/2021800/58626911-49768280-82ac-11e9-84d0-7c9cac54511e.gif)

MIT license
