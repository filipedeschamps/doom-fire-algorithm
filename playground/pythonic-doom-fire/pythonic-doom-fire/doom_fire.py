from abc import ABC, abstractmethod
from color_palette import ColorPalette
from functools import reduce
from random import randint

class DoomFire(ABC):
    def __init__(self, width, height, pixel_size = 4, decay_rate = 2, \
            windforce = 1, fire_source_inc = (4, 6), \
            fire_source_enabled = True, color_palette = ColorPalette()):
        self.width = width
        self.height = height
        self.pixel_size = pixel_size
        self.decay_rate = decay_rate
        self.windforce = windforce
        self.fire_source_inc = fire_source_inc
        self.color_palette = color_palette
        self.max_intensity = len(self.color_palette.get_colors()) - 1
        self.pixels_array = [0] * self.width * self.height
        self.fire_source_enabled = fire_source_enabled
        if self.fire_source_enabled:
            self.create_fire_source()

    def create_fire_source(self):
        self.pixels_array[-self.width:] = [self.max_intensity] * self.width
        self.fire_source_enabled = True

    def destroy_fire_source(self):
        self.pixels_array[-self.width:] = [0] * self.width
        self.fire_source_enabled = False

    def has_fire_source(self):
        return self.fire_source_enabled

    def increase_fire_source(self):
        fire_source_row = self.pixels_array[-self.width:]
        for i, f in enumerate(fire_source_row):
            if f == self.max_intensity:
                continue
            inc = randint(self.fire_source_inc[0], self.fire_source_inc[1])
            fire_source_row[i] += inc if f + inc <= self.max_intensity else \
                self.max_intensity - f
        self.pixels_array[-self.width:] = fire_source_row
        fire_source_row_sum = reduce(lambda x, y: x + y, fire_source_row)
        if fire_source_row_sum > 0 and not self.fire_source_enabled:
            self.fire_source_enabled = True

    def decrease_fire_source(self):
        fire_source_row = self.pixels_array[-self.width:]
        for i, f in enumerate(fire_source_row):
            if f == 0:
                continue
            updated = True
            dec = randint(self.fire_source_inc[0], self.fire_source_inc[1])
            fire_source_row[i] -= dec if f - dec >= 0 else f
        self.pixels_array[-self.width:] = fire_source_row
        fire_source_row_sum = reduce(lambda x, y: x + y, fire_source_row)
        if fire_source_row_sum == 0 and self.fire_source_enabled:
            self.fire_source_enabled = False

    def update(self):
        for j in range(self.width):
            for i in range(self.height - 1):
                current_pixel_index = i * self.width + j
                below_pixel_index = current_pixel_index + self.width
                below_pixel_intensity = self.pixels_array[below_pixel_index]
                decay = randint(0, self.decay_rate)
                new_pixel_intensity = 0
                if below_pixel_intensity - decay > 0:
                    new_pixel_intensity = below_pixel_intensity - decay
                wind_direction = randint(-self.windforce, self.windforce)
                # Checking if the wind direction exceeds the boundaries of
                # pixels array and if it does, reverse it
                if current_pixel_index + wind_direction >= \
                    len(self.pixels_array) or current_pixel_index + \
                    wind_direction < 0:
                        wind_direction = -wind_direction
                pixel_neighbor_index = current_pixel_index + wind_direction
                self.pixels_array[pixel_neighbor_index] = new_pixel_intensity

    @abstractmethod
    def render(self):
        pass
