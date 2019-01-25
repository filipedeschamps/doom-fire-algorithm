#include <SDL2/SDL.h>
#include <math.h>
#include <time.h>

int WINDOW_WIDTH = 640;
int WINDOW_HEIGHT = 480;

SDL_Window *window;
SDL_Renderer *renderer;

int fireSize = 4;
int firePixelsArray[50000000] = {0};
int numberOfPixels = 0; 

int fireColorsPalette[37][3] = {{7, 7, 7}, {31, 7, 7}, {47, 15, 7}, {71, 15, 7}, {87, 23, 7}, {103, 31, 7}, {119, 31, 7}, {143, 39, 7}, {159, 47, 7}, {175, 63, 7}, {191, 71, 7}, {199, 71, 7}, {223, 79, 7}, {223, 87, 7}, {223, 87, 7}, {215, 95, 7}, {215, 95, 7}, {215, 103, 15}, {207, 111, 15}, {207, 119, 15}, {207, 127, 15}, {207, 135, 23}, {199, 135, 23}, {199, 143, 23}, {199, 151, 31}, {191, 159, 31}, {191, 159, 31}, {191, 167, 39}, {191, 167, 39}, {191, 175, 47}, {183, 175, 47}, {183, 183, 47}, {183, 183, 55}, {207, 207, 111}, {223, 223, 159}, {239, 239, 199}, {255, 255, 255}};

void start(){
	numberOfPixels = (WINDOW_WIDTH/fireSize) * (WINDOW_HEIGHT/fireSize);
	for (int i = 0; i < numberOfPixels; i++) {
    firePixelsArray[i] = 36;
  }
}

void updateFireIntensityPerPixel(int currentPixelIndex) {
	int belowPixelIndex = currentPixelIndex + (WINDOW_WIDTH / fireSize);
	if (belowPixelIndex < numberOfPixels) {
		int decay = floor(rand() % 3);
		int belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
		int newFireIntensity =
			belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
		int pos = (currentPixelIndex - decay >= 0) ? currentPixelIndex - decay : 0;
		firePixelsArray[pos] = newFireIntensity;
  }
}

void renderFire(){
	SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
	SDL_RenderClear(renderer);
	for (int x = 0; x < WINDOW_WIDTH; x+=fireSize){
		for (int y = 0; y < WINDOW_HEIGHT; y+=fireSize){
			int p = x + ((WINDOW_WIDTH/fireSize) * y);
			int pixelIndex = p / fireSize;
			int fireIntensity = firePixelsArray[pixelIndex];
			int colorR = fireColorsPalette[fireIntensity][0];
			int colorG = fireColorsPalette[fireIntensity][1];
			int colorB = fireColorsPalette[fireIntensity][2];
			SDL_SetRenderDrawColor(renderer, colorR, colorG, colorB, 255); 
			SDL_Rect rectToDraw = {x, y, x + fireSize, y + fireSize};
			SDL_RenderFillRect(renderer, &rectToDraw);
		}
	}
	SDL_RenderPresent(renderer);
}

void calculateFirePropagation() {
  renderFire(); 
	for (int i = 0; i < numberOfPixels; i++) {
		updateFireIntensityPerPixel(i);
	}
}

// *** //

int main(int argc, char *argv[]) {
	srand(time(NULL));

	start(); 

	SDL_Init(SDL_INIT_VIDEO);

	window = SDL_CreateWindow(
		"Doom Fire Effect",
		SDL_WINDOWPOS_UNDEFINED,
		SDL_WINDOWPOS_UNDEFINED,
		WINDOW_WIDTH,
		WINDOW_HEIGHT,
		SDL_WINDOW_OPENGL);

	if (window == NULL){
		printf("Could not create window: %s\n", SDL_GetError());
		return 1;
	}
	
	renderer = SDL_CreateRenderer(window, -1, 0);

	bool is_running = true;
	SDL_Event event;
	while (is_running){
		while (SDL_PollEvent(&event)){
			if (event.type == SDL_QUIT){
				is_running = false;
			}
		}
 
		calculateFirePropagation();
		SDL_Delay(50);

	}

	SDL_DestroyWindow(window);
	SDL_DestroyRenderer(renderer);

	SDL_Quit();
	return 0;
}