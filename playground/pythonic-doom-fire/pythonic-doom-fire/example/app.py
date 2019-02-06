from os.path import dirname, abspath, join
import pygame
import sys
app_dir = dirname(abspath(__file__))
sys.path.append(join(app_dir, '..'))
from doom_fire_pygame import DoomFirePygame

if __name__ == '__main__':
    # DoomFire setup
    fire_width = 100
    fire_height = 100
    fire_pixel_size = 4
    fire_decay_rate = 2
    fire_windforce = 1
    fire_source_inc = (4, 6)
    doom_fire = DoomFirePygame(fire_width, fire_height, fire_pixel_size, \
        fire_decay_rate, fire_windforce, fire_source_inc)

    # Pygame setup
    pygame.init()
    size = width, height = fire_width * fire_pixel_size, \
        fire_height * fire_pixel_size
    frame_rate = 24
    screen = pygame.display.set_mode(size)
    clock = pygame.time.Clock()
    running = True

    # Game loop
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN \
                and event.key == pygame.K_ESCAPE):
                running = False
                exit()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                btn1, btn2, btn3 = pygame.mouse.get_pressed()
                if btn2 and doom_fire.has_fire_source():
                    doom_fire.destroy_fire_source()
                elif btn2:
                    doom_fire.create_fire_source()
                elif btn3:
                    doom_fire.increase_fire_source()
                elif btn1:
                    doom_fire.decrease_fire_source()
        doom_fire.update()
        doom_fire.render(screen)
        pygame.display.flip()
        clock.tick(frame_rate)
