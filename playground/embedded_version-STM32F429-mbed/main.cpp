/*********************************************************************
 * available in: https://os.mbed.com/users/agaelema/code/Doom_Flame-F429ZI_v02/
 * 
 * Based on: https://github.com/filipedeschamps/doom-fire-algorithm
 * modified by: Haroldo Amaral - http://bit.ly/haroldo_github
 *********************************************************************/

#include "mbed.h"
#include "LCD_DISCO_F429ZI.h"
#include "STM32F4_RNG.h"

LCD_DISCO_F429ZI lcd;               // declare lcd class

STM32F4_RNG rnd;                    // declare random number class (use internal HW)

DigitalOut led1(LED1);              // declare GPIO class (output)

Serial pc(USBTX, USBRX);            // declare serial class (UART)

//#define     ENABLE_DEBUGMATRIX      // uncomment to enable matrix debug via UART


#define     PALETTESIZE     (sizeof(ColorPalette)/sizeof(uint32_t))

#define     ROWS            40          // numeber of lines
#define     COLS            40          // number of columns
#define     MATRIXSIZE      (ROWS*COLS) // number os vector (cells)

#define     PIXELSIZE       4           // size of pixel

uint8_t     FlameMatrix[ROWS*COLS];

uint32_t ColorPalette[] = 
{
    0xFF070707, //{"r":7,"g":7,"b":7}
    0xFF1F0707, //{"r":31,"g":7,"b":7}
    0xFF2F0F07, //{"r":47,"g":15,"b":7}
    0xFF470F07, //{"r":71,"g":15,"b":7}
    0xFF571707, //{"r":87,"g":23,"b":7}
    0xFF671F07, //{"r":103,"g":31,"b":7}
    0xFF771F07, //{"r":119,"g":31,"b":7}
    0xFF8F2707, //{"r":143,"g":39,"b":7}
    0xFF9F2F07, //{"r":159,"g":47,"b":7}
    0xFFAF3F07, //{"r":175,"g":63,"b":7}
    0xFFBF4707, //{"r":191,"g":71,"b":7}
    0xFFC74707, //{"r":199,"g":71,"b":7}
    0xFFDF4707, //{"r":223,"g":79,"b":7}
    0xFFDF5707, //{"r":223,"g":87,"b":7}
    0xFFDF5707, //{"r":223,"g":87,"b":7}
    0xFFD75F07, //{"r":215,"g":95,"b":7}
    0xFFD75F07, //{"r":215,"g":95,"b":7}
    0xFFD7670F, //{"r":215,"g":103,"b":15}
    0xFFCF6F0F, //{"r":207,"g":111,"b":15}
    0xFFCF770F, //{"r":207,"g":119,"b":15}
    0xFFCF7F0F, //{"r":207,"g":127,"b":15}
    0xFFCF8717, //{"r":207,"g":135,"b":23}
    0xFFC78717, //{"r":199,"g":135,"b":23}
    0xFFC78F17, //{"r":199,"g":143,"b":23}
    0xFFC7971F, //{"r":199,"g":151,"b":31}
    0xFFBF9F1F, //{"r":191,"g":159,"b":31}
    0xFFBF9F1F, //{"r":191,"g":159,"b":31}
    0xFFBFA727, //{"r":191,"g":167,"b":39}
    0xFFBFA727, //{"r":191,"g":167,"b":39}
    0xFFBFAF2F, //{"r":191,"g":175,"b":47}
    0xFFB7AF2F, //{"r":183,"g":175,"b":47}
    0xFFB7B72F, //{"r":183,"g":183,"b":47}
    0xFFB7B737, //{"r":183,"g":183,"b":55}
    0xFFCFCF6F, //{"r":207,"g":207,"b":111}
    0xFFDFDF9F, //{"r":223,"g":223,"b":159}
    0xFFEFEFC7, //{"r":239,"g":239,"b":199}
    0xFFFFFFFF, //{"r":255,"g":255,"b":255}
};


/*********************************************************************
 * Prototype of functions
 *********************************************************************/
void fillWithZeros(uint8_t *ptrMatrix, uint32_t size);
void createFireSource(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, uint32_t fireIntensity);
void drawFlames(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, uint32_t pixelSize);
void calculateFirePropagation(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, int32_t randAtt, int32_t wind);

void debugMatrix(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols);


int main()
{      
    led1 = 1;                                       // set LED
    
    uint8_t *matrixPtr;                             // pointer to matrix
    matrixPtr = FlameMatrix;
    
    lcd.Clear(LCD_COLOR_BLACK);                     // fill lcd with black color
    
    fillWithZeros(matrixPtr, MATRIXSIZE);           // fill matrix with zeros
#if defined (ENABLE_DEBUGMATRIX)
    debugMatrix(matrixPtr, ROWS, COLS);
#endif
    
    /*
     * create firesource 
     * - matrix     -> pointer to fire matrix
     * - rows       -> number of lines
     * - cols       -> number of columns
     * - fireIntensity -> intensity of source
     */
    createFireSource(matrixPtr, ROWS, COLS, 36);
#if defined (ENABLE_DEBUGMATRIX)
    debugMatrix(matrixPtr, ROWS, COLS);
#endif
    
    while(1)
    {
        /*
         * merge functions "calculateFirePropagation" and "updateFireIntensityPerPixel"
         * - matrix     -> pointer to fire matrix
         * - rows       -> number of lines
         * - cols       -> number of columns
         * - randAtt    -> attenuation of randomness
         * - wind       -> negative number (left), positive (right), zero (no wind)
         */
        calculateFirePropagation(matrixPtr, ROWS, COLS, 3 , -3);
    
        drawFlames(matrixPtr, ROWS, COLS, PIXELSIZE);
        
        wait(0.05);
        led1 = (led1 ^ 1);
    }
}




void fillWithZeros(uint8_t *ptrMatrix, uint32_t size)
{
    uint32_t counter;
    
    for (counter = 0; counter < size; counter++)
    {
        *(ptrMatrix+counter) = 0;
//        pc.printf("Cl = %u \r\n", counter);
    }
}

void createFireSource(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, uint32_t fireIntensity)
{
    uint32_t lasRow = rows*cols - cols;
    uint32_t counter;
    
    if (fireIntensity > 36) fireIntensity = 36;
    
    for (counter = 0; counter < cols; counter++)                // in each cell
    {
        ptrMatrix[lasRow + counter] = fireIntensity;
//        pc.printf("Fs %u = %u \r\n", lasRow + counter, fireIntensity);
    }
}

void drawFlames(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, uint32_t pixelSize)
{
    uint32_t rowCounter = 0;
    uint32_t colCounter = 0;
    
    for (rowCounter = 0; rowCounter < rows; rowCounter++)       // in each line
    {
        for (colCounter = 0; colCounter < cols; colCounter++)   // in each column
        {
            lcd.SetTextColor( ColorPalette[*(ptrMatrix + rowCounter*cols + colCounter)] );
            lcd.FillRect(pixelSize*colCounter, pixelSize*rowCounter, pixelSize, pixelSize);
        }
    }
}

void calculateFirePropagation(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols, int32_t randAtt, int32_t wind)
{
    uint32_t rowCounter = 0;
    uint32_t colCounter = 0;
    int32_t currentIndex;
    
    for (colCounter = 0; colCounter < cols; colCounter++)           // in each column
    {
        for (rowCounter = 0; rowCounter < rows - 1; rowCounter++)   // in each line
        {
            float random = (float)rnd.Get()/0xFFFFFFFF;             // calculate a random number  between 0-1
            int32_t decay = (int32_t)(random * randAtt);            // calculate decay

            /*
             * calculate the current index considering the randomness
             */
            currentIndex = rowCounter*cols + colCounter + (int32_t)(random * wind);
            if (currentIndex < 0) currentIndex = 0;                 // avoid exit the matrix
            
            int32_t temp = *(ptrMatrix + (rowCounter+1)*cols + colCounter) - decay;
            *(ptrMatrix + currentIndex) = (temp <=0) ? 0 : temp;    // avoid nonexistent palette color
        }
    }
}


void debugMatrix(uint8_t *ptrMatrix, uint32_t rows, uint32_t cols)
{
    uint32_t rowCounter = 0;
    uint32_t colCounter = 0;
    
    pc.printf("\r\n debug matrix linear \r\n");
    
    for (colCounter = 0; colCounter < cols*rows; colCounter++)
    {
        pc.printf("%02d ", *(ptrMatrix + colCounter));
    }
    pc.printf("\r\n");
    
    pc.printf("\r\n debug matrix form \r\n");
    for (rowCounter = 0; rowCounter < rows; rowCounter++)
    {
        for (colCounter = 0; colCounter < cols; colCounter++)
        {
            pc.printf("%02d-%02d-%02d ", *(ptrMatrix + rowCounter*cols + colCounter), rowCounter*cols, colCounter);
        }
        pc.printf("\r\n");
    }
}