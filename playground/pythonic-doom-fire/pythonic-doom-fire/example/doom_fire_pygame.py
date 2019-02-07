from os.path import dirname, abspath, join
import pygame
import sys
doom_fire_pygame_dir = dirname(abspath(__file__))
sys.path.append(join(doom_fire_pygame_dir, '..'))
from doom_fire import DoomFire

class DoomFirePygame(DoomFire):
    def render(self, ctx):
        ps = self.pixel_size
        for i in range(self.height):
            for j in range(self.width):
                pixel_index = i * self.width + j
                color_intensity = self.pixels_array[pixel_index]
                color = self.color_palette.get_color(color_intensity)
                pixel_rect = (j * ps, i * ps, ps, ps)
                pygame.draw.rect(ctx, color, pixel_rect, 0)
