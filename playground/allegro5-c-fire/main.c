/*
 * Implementado por Lucas Eduardo Wendt <lucas59356@gmail.com>
*/

#include <stdlib.h>
#include <stdio.h>
#include <signal.h>
#include <allegro5/allegro.h>
#include <allegro5/allegro_primitives.h>
#include <unistd.h>
#include <limits.h>
#include "main.h"

// Intervalo entre geração de frames. 1s/FPS
#define FPS 5

const int canvas_width = 60; // Largura do canvas
const int canvas_height = 30; // Altura do canvas
const int canvas_length = canvas_width*canvas_height; // Tamanho do canvas
const int color_step = INT_MAX / 36; // Eu não quis usar float, acho mais eficiente usar INT, cada step desse é uma cor, a paleta é hardcodada
const int decay = color_step * 6; // Quanto maior mais baixo o fogo
const int wind_offset = 3; // Quantidade de vento
const int render_ratio = 19; // Cada ponto do canvas gerará um quadrado, Qual o tamanho dele (X por X)?

const int display_width = canvas_width*render_ratio; // Largura da janela
const int display_height = canvas_height*render_ratio; // Altura da janela

const int fire_source_intensity = 36; // Padrão: 36

const int begin_of_last_line = canvas_width * (canvas_height - 1); // Indice do primeiro elemento da última linha

ALLEGRO_DISPLAY *display; // A tela do allegro

int *canvas;

bool running = true;

int main() {
    catch_signal(SIGTERM, stop);
    catch_signal(SIGINT, stop);
    srand(time(NULL));
    if (!al_init())
        stop(-1);
    printf("Criado canvas de tamanho: %i\n", canvas_length);
    canvas = malloc(sizeof(int)*canvas_length);
    al_set_new_display_flags(ALLEGRO_WINDOWED);
    display = al_create_display(display_width, display_height);
    if (!canvas || !display) 
        stop(-1); // Verifica erros
    al_flip_display();
    add_fire_source(fire_source_intensity);
    render_state();
    while (1) {
        calc_canvas();
        render_state();
        usleep(1000*1000/FPS);
        if (!running) stop(0);
    }
}

// https://github.com/lucasew/allegro_blasteroids/blob/master/src/util_signal.c
int catch_signal(int sig, void (*handler)(int)) {
#ifndef WIN32
    struct sigaction action;
    action.sa_handler = handler;
    sigemptyset(&action.sa_mask);
    action.sa_flags = 0;
    return sigaction(sig, &action, 0); // 0 == NULL
#else
    return signal(SIGINT, handler) ? 0: 1;
#endif
}

void render_state() {
    al_clear_to_color(al_map_rgb(0,0,0));
    int i;
    for (i = 0; i < canvas_length; i++) {
        float x = (i % canvas_width)*render_ratio;
        float y = (i / canvas_width)*render_ratio;
        short color_idx = canvas[i] / color_step;
        ALLEGRO_COLOR color = al_map_rgb(pallete[color_idx][0], pallete[color_idx][1], pallete[color_idx][2]); // Cria o ALLEGRO_COLOR com os 3 valores
        al_draw_filled_rectangle(x, y, x + render_ratio, y + render_ratio, color);
    }
    al_flip_display();
}

void add_fire_source(int intensity) {
    if (intensity > 36) {
        printf("ERRO: Intensidade acima do permitido");
        stop(1);
    }
    int i;
    for (i = begin_of_last_line; i < canvas_length; i++) {
        canvas[i] = intensity * color_step;
    }
}

void calc_canvas() {
    int i;
    // Não é necessário fazer correção de sinal por que o cálculo é feito de baixo pra cima
    for (i = begin_of_last_line - 1; i >= 0; i--) {
        int source_index = i + canvas_width - rand()%wind_offset;
        // int source_index = i + canvas_width - wind_offset;
        source_index = source_index < canvas_length ? source_index : source_index - canvas_width; // Resolve um bug com vento negativo (para outro lado)
        int res = canvas[source_index] - rand()%decay;
        canvas[i] = res > 0 ? res : 0;
    }
}


void stop(int code) {
    running = false;
    printf("Saindo...\n");
    al_destroy_display(display);
    free(canvas);
    exit(code);
}
