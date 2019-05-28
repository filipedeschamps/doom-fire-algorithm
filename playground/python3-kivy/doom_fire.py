'''
=================
DOOM FIRE Python
=================

This code is based on the article from:
https://github.com/fabiensanglard/DoomFirePSX/blob/master/flames.html

It uses Kivy framework:
https://kivy.org/

The example displays a fire animation effect by manipulating pixel colors
Sandro. https://github.com/sfadiga
MIT license
'''

from kivy.clock import Clock
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.uix.boxlayout import BoxLayout
from kivy.graphics import Color, Rectangle
from kivy.graphics.texture import Texture
from kivy.core.window import Window
from kivy.properties import ListProperty
from kivy.properties import ObjectProperty
import random as rnd

# an array of Red Green Blue values , from black -> white, passing throug red yellow organge, mimics the
# heat being produced (fire source as white) to the complete cooldown (black)
RGB_HEIGHT_MAP = [0x07, 0x07, 0x07,
                  0x1F, 0x07, 0x07,
                  0x2F, 0x0F, 0x07,
                  0x47, 0x0F, 0x07,
                  0x57, 0x17, 0x07,
                  0x67, 0x1F, 0x07,
                  0x77, 0x1F, 0x07,
                  0x8F, 0x27, 0x07,
                  0x9F, 0x2F, 0x07,
                  0xAF, 0x3F, 0x07,
                  0xBF, 0x47, 0x07,
                  0xC7, 0x47, 0x07,
                  0xDF, 0x4F, 0x07,
                  0xDF, 0x57, 0x07,
                  0xDF, 0x57, 0x07,
                  0xD7, 0x5F, 0x07,
                  0xD7, 0x5F, 0x07,
                  0xD7, 0x67, 0x0F,
                  0xCF, 0x6F, 0x0F,
                  0xCF, 0x77, 0x0F,
                  0xCF, 0x7F, 0x0F,
                  0xCF, 0x87, 0x17,
                  0xC7, 0x87, 0x17,
                  0xC7, 0x8F, 0x17,
                  0xC7, 0x97, 0x1F,
                  0xBF, 0x9F, 0x1F,
                  0xBF, 0x9F, 0x1F,
                  0xBF, 0xA7, 0x27,
                  0xBF, 0xA7, 0x27,
                  0xBF, 0xAF, 0x2F,
                  0xB7, 0xAF, 0x2F,
                  0xB7, 0xB7, 0x2F,
                  0xB7, 0xB7, 0x37,
                  0xCF, 0xCF, 0x6F,
                  0xDF, 0xDF, 0x9F,
                  0xEF, 0xEF, 0xC7,
                  0xFF, 0xFF, 0xFF]

# the size of the animation, if use values like 256 or greater the animation runs very slow (a performance impact)
FIRE_WIDTH = 128
FIRE_HEIGHT = 128


class DoomFireApp(App):
    '''
    A standard Kivy App, implements the build method were all the startup logic happens
    '''
    _fire_pixels = ListProperty([])
    _wid = ObjectProperty()
    _texture = ObjectProperty()

    def build(self):
        '''
        perform the startup of the application, this app will simple draw a widget with a canvas and a rectangle
        this rectangle will receive a texture that will be updated later
        :return:
        '''
        self._texture = Texture.create(size=(FIRE_WIDTH, FIRE_HEIGHT))

        self._wid = Widget(size=(FIRE_WIDTH, FIRE_HEIGHT))
        root = BoxLayout(orientation='vertical')
        root.add_widget(self._wid)

        # paint with black all the pixel table
        self._fire_pixels = [0 for a in range(FIRE_WIDTH * FIRE_HEIGHT)]

        # update the lower line of the screen with bright pixels
        for i in range(FIRE_WIDTH):
            self._fire_pixels[(FIRE_HEIGHT - 1) * FIRE_WIDTH + i] = 36

        with self._wid.canvas:
            Rectangle(texture=self._texture, pos=self._wid.pos, size=(FIRE_WIDTH, FIRE_HEIGHT))

        Clock.schedule_interval(self.update_buffer, 0.016)  # aprox. 60 fps, 16 ms

        return root

    def spread_fire(self, src):
        '''
        this method takes a index of the pixel table and bubbles it up on the color table, using random values to create
        the ilusion of a fire spreading
        :param src:
        :return:
        '''
        pixel = self._fire_pixels[src]
        if pixel == 0:
            self._fire_pixels[src - FIRE_WIDTH] = 0
        else:
            rnd_index = rnd.randrange(4)
            dst = src - rnd_index + 1
            self._fire_pixels[dst - FIRE_WIDTH] = pixel - (rnd_index & 1)

    def do_fire(self):
        '''
        propagates the fire up by calling spread fire upon each pixel of the image
        :return:
        '''
        for x in range(FIRE_WIDTH):
            for y in range(1, FIRE_HEIGHT):
                self.spread_fire(y * FIRE_WIDTH + x)

    def update_buffer(self, *largs):
        '''
        the method is called on the loop to update the buffer with the current pixel table
        :param largs:
        :return:
        '''
        self.do_fire()
        color_data = []
        # had to reverse the order of the iterators since the image was flipped on the vertical axis, maybe the append
        # of data or the bytearray was reversing the data passed to the texture
        for h in reversed(range(FIRE_HEIGHT)):
            for w in reversed(range(FIRE_WIDTH)):
                i = self._fire_pixels[h * FIRE_WIDTH + w]
                # the RGB array contains 'triples' of colors in form r,g,b,r,g,b... thus the i*3
                color_data.append(RGB_HEIGHT_MAP[i * 3])      # r
                color_data.append(RGB_HEIGHT_MAP[i * 3 + 1])  # g
                color_data.append(RGB_HEIGHT_MAP[i * 3 + 2])  # b

        # apply texture data to a rectangle tha will be rendered on the canvas
        buffer = bytearray(color_data)
        self._texture.blit_buffer(buffer, colorfmt='rgb', bufferfmt='ubyte')
        # forces an update on the scene
        self._wid.canvas.flag_update()


if __name__ == '__main__':
    Window.size = (FIRE_WIDTH, FIRE_HEIGHT)
    DoomFireApp().run()
