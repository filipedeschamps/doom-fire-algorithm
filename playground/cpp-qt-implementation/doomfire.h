#ifndef DOOMFIRE_H
#define DOOMFIRE_H

#include <qglobal.h>

class DoomFire
{
public:
    DoomFire(int w, int h);
    ~DoomFire();

    const uchar* getAlignedFireVector();
    int witdh();
    int height();

    int windSpeed();

    void createFire();
    void destroyFire();
    void propagateFire();

    void decreaseWindSpeed();
    void increaseWindSpeed();

    void resetFire();
    void printFire();

    void resize(int w, int h);

private:
    class Priv;
    Priv *d;
};

#endif // DOOMFIRE_H
