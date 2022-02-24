import curses
import time
import random

fire_pixels_array = []
fire_height = 60
fire_width = 60

gradient_map = {
    0: ' ',
    1: 'B',
    2: '8',
    3: 'W',
    4: '#',
    5: 'o',
    6: 'h',
    7: 'b',
    8: 'p',
    9: 'w',
    10: 'Z',
    11: '0',
    12: 'L',
    13: 'J',
    14: 'Y',
    15: 'z',
    16: 'v',
    17: 'n',
    18: 'r',
    19: 'f',
    20: '/',
    21: '|',
    22: ')',
    23: '{',
    24: '[',
    25: '?',
    26: '_',
    27: '~',
    28: '>',
    29: '!',
    30: 'I',
    31: ':',
    32: '"',
    33: '`',
    34: '"',
    35: '^',
    36: ' '
}


def create_data_sctructure():
    num_pixels = fire_width * fire_height
    for i in range(num_pixels):
        fire_pixels_array.append(0)


def calculate_fire_propagation():
    for column in range(fire_width):
        for row in range(fire_height):
            pixel_index = column + (fire_height * row)
            update_fire_intensity(pixel_index)


def update_fire_intensity(current_pixel_index):
    below_pixel_index = current_pixel_index + fire_width

    if below_pixel_index >= fire_width * fire_height:
        return

    decay = random.randint(0, 2)

    below_pixel_fire_intensity = fire_pixels_array[below_pixel_index]
    if (below_pixel_fire_intensity - decay >= 0):
        new_fire_intensity = below_pixel_fire_intensity - decay
    else:
        new_fire_intensity = 0

    fire_pixels_array[current_pixel_index - decay] = new_fire_intensity


def create_fire_source():
    for column in range(fire_width):
        overflow_pixel_index = fire_width * fire_height
        pixel_index = (overflow_pixel_index - fire_width) + column

        fire_pixels_array[pixel_index] = 36


def render_fire(stdscr):
    create_data_sctructure()
    create_fire_source()
    curses.curs_set(0)

    while True:
        calculate_fire_propagation()

        for row in range(fire_height):
            for column in range(fire_width):
                pixel_index = column + (fire_width * row)
                # fire_intensity = fire_pixels_array[pixel_index]
                fire_intensity_ascii = gradient_map[fire_pixels_array[pixel_index]]
                # stdscr.addstr(row, column, str(fire_intensity))
                stdscr.addstr(row, column, str(fire_intensity_ascii))
                stdscr.refresh()

        time.sleep(.05)


curses.wrapper(render_fire)
