# Pythonic Doom Fire
This is a flexible Python implementation of doom-fire-algorithm that allows
using diferent rendering libraries.

This implementation is using pygame but it is up to you to chose another Python
rendering library. For doing this you have to create a child class of `DoomFire`
abstract base class and reimplement the `render` method.

<p align="center">
    <img src="https://github.com/filipealvesdef/doom-fire-algorithm/blob/filipealves-pythonic-doom-fire-fix/playground/pythonic-doom-fire/pythonic-doom-fire.gif?raw=true">
    <img src="https://github.com/filipealvesdef/doom-fire-algorithm/blob/filipealves-pythonic-doom-fire-fix/playground/pythonic-doom-fire/pythonic-doom-fire-blue.gif?raw=true">
</p>

## Requirements

- Python
- pip
- venv

## Installation
Using a virtual environment is not required but it is recommended. If you want
to install all dependencies of this project globally on your operating system,
you may need permissions. In other words, when you execute `python setup.py
install` step, you may need to run `sudo python setup.py install`

```sh
    git clone git@github.com:alvesfilipe/doom-fire-algorithm.git
    cd doom-fire-algorithm/pythonic-doom-fire
    python -m venv venv
    source venv/bin/activate
    python setup.py install
```

## Execution
Once you have all dependencies installed, run the following commands:

```sh
    cd pythonic-pythonic-doom-fire/example
    python app.py
```

## Instructions
For interacting with the fire you basically have the mouse buttons:

- Left button decreses fire stregth
- Right button increses fire strength
- Middle button toggle max and min fire source
- Ecape key closes the application

You can play around with the parameters passed for `DoomFire`, in order to
control the `windforce`, `pixel_size` and so forth.
