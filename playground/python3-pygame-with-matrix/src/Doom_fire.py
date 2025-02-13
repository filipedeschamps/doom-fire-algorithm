import pygame
import random

fire_pixels_list = [] # Matriz
fireWidth = 100 # Altura do fogo
fireHeight = 100 # Largura do fogo
paleta_de_cores = [(7, 7, 7), (31, 7, 7), (47, 15, 7), (71, 15, 7), (87, 23, 7), (103, 31, 7), (119, 31, 7), (143, 39, 7), (159, 47, 7), (175, 63, 7), (191, 71, 7), (199, 71, 7), (223, 79, 7), (223, 87, 7), (223, 87, 7), (215, 95, 7), (215, 95, 7), (215, 103, 15), (207, 111, 15), (207, 119, 15), (207, 127, 15), (207, 135, 23), (207, 135, 23), (199, 143, 23), (199, 151, 31), (191, 159, 31), (191, 159, 31), (191, 167, 39), (191, 167, 39), (191, 175, 47), (183, 175, 47), (183, 183, 47), (183, 183, 51), (207, 207, 111), (223, 223, 159), (239, 239, 199), (255, 255, 255)]
n = 3 #Quantidade de vezes que o display eh maior que a estrutura de dados

Width = n*fireWidth
Height = n*fireHeight

dif = n*10

pygame.init()
fundo = pygame.display.set_mode((Width, Height))
pygame.display.set_caption('Doom Fire')
clock = pygame.time.Clock()
FPS = 120

def start():
    sair = True

    create_fire_data_structure()
    create_fire_source()

    while sair:
        clock.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sair = False

        calculate_fire_propagation()



def create_fire_data_structure():
    for i in range(fireWidth):
        fire_pixels_list.append([])
        for j in range(fireHeight):
            fire_pixels_list[i].append(0)

def calculate_fire_propagation(): # ela tem q percorrer a matriz de forma vertical
    for i in range(fireWidth):
        for j in range(fireHeight):
            update_fire_intensity_per_pixel(i, j)
    render_fire()

def update_fire_intensity_per_pixel(i, j):
    if i +1 >= fireWidth:
        return

    desconto = random.randrange(1, 4)
    intensidade_pixel_debaixo = fire_pixels_list[i + 1][j]
    nova_intensidade = intensidade_pixel_debaixo - desconto

    if nova_intensidade <= 0:
        fire_pixels_list[i][j] = 0
        return

    fire_pixels_list[i][j-desconto] = nova_intensidade


def render_fire():
    for i in range(fireWidth - 1, 0, -1):
        for j in range(fireHeight - 1, 0, -1):
            posicao = fire_pixels_list[i][j]
            if posicao <= 36:
                cor = paleta_de_cores[posicao]
                pygame.draw.rect(fundo, cor, [(n*j - dif), (n*i - dif), dif, dif])
    pygame.display.update()


def create_fire_source():
    i = fireWidth -1 # Como a fonte de fogo eh sempre a ultima linha, achamos ela e colocamos 36 em todos os seus elementos

    for j in range(fireHeight):
        fire_pixels_list[i][j] = 36


def print_matriz(matriz):
    for i in matriz:
        print(i)


start()