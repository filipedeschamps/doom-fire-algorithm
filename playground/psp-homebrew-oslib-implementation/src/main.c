#include <pspkernel.h>
#include <oslib/oslib.h>

PSP_MODULE_INFO("Doom Fire Effect", 0, 1, 0);
PSP_MAIN_THREAD_ATTR(THREAD_ATTR_USER | THREAD_ATTR_VFPU);
PSP_HEAP_SIZE_KB(12*1024);

int WINDOW_WIDTH = 480;
int WINDOW_HEIGHT = 272;
int fireSize = 4;
int firePixelsArray[150000] = {0};
int numberOfPixels = 0;

int fireColorsPalette[37][3] = {{7, 7, 7}, {31, 7, 7}, {47, 15, 7}, {71, 15, 7}, {87, 23, 7}, {103, 31, 7}, {119, 31, 7}, {143, 39, 7}, {159, 47, 7}, {175, 63, 7}, {191, 71, 7}, {199, 71, 7}, {223, 79, 7}, {223, 87, 7}, {223, 87, 7}, {215, 95, 7}, {215, 95, 7}, {215, 103, 15}, {207, 111, 15}, {207, 119, 15}, {207, 127, 15}, {207, 135, 23}, {199, 135, 23}, {199, 143, 23}, {199, 151, 31}, {191, 159, 31}, {191, 159, 31}, {191, 167, 39}, {191, 167, 39}, {191, 175, 47}, {183, 175, 47}, {183, 183, 47}, {183, 183, 55}, {207, 207, 111}, {223, 223, 159}, {239, 239, 199}, {255, 255, 255}};

int initOSLib(){
    oslInit(0);
    oslInitGfx(OSL_PF_8888, 1);
    oslInitAudio();
    oslSetQuitOnLoadFailure(1);
    oslSetKeyAutorepeatInit(40);
    oslSetKeyAutorepeatInterval(10);
    return 0;
}

void start(){
    int i;
	numberOfPixels = (WINDOW_WIDTH/fireSize) * (WINDOW_HEIGHT/fireSize);
	for (i = 0; i < numberOfPixels; i++) {
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
    int x, y;
	for (x = 0; x < WINDOW_WIDTH; x+=fireSize){
		for (y = 0; y < WINDOW_HEIGHT; y+=fireSize){
			int p = x + ((WINDOW_WIDTH/fireSize) * y);
			int pixelIndex = p / fireSize;
			int fireIntensity = firePixelsArray[pixelIndex];
			int colorR = fireColorsPalette[fireIntensity][0];
			int colorG = fireColorsPalette[fireIntensity][1];
			int colorB = fireColorsPalette[fireIntensity][2];
            oslDrawFillRect(x, y, x + fireSize, y + fireSize, RGB(colorR, colorG, colorB));
        }
	}
}

void calculateFirePropagation() {
    renderFire(); 
    int i;
	for (i = 0; i < numberOfPixels; i++) {
		updateFireIntensityPerPixel(i);
	}
}

int main(){
    int skip = 0;

    initOSLib();
    start();
    oslIntraFontInit(INTRAFONT_CACHE_MED);

    while(!osl_quit){
        if (!skip){
            oslStartDrawing();

            calculateFirePropagation();
            oslDrawString(178, 250, "Press X to quit");

            oslEndDrawing();
        }
        oslEndFrame();
        skip = oslSyncFrame();

        oslReadKeys();
        if (osl_keys->released.cross)
            oslQuit();
    }
    oslEndGfx();

    sceKernelExitGame();
    return 0;

}
