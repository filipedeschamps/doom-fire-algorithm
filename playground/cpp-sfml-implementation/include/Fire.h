#ifndef FIRE_EF_H
#define FIRE_EF_H

#include <cstdlib>
#include <SFML/Graphics.hpp>

class Fire {
    protected:
        float          m_pixelSize;
        unsigned int   m_width;
        unsigned int   m_height;
        unsigned int** m_values;
        sf::Vector2f   m_origin;

    public:
        Fire(float, unsigned int, unsigned int, sf::Vector2f);
        virtual ~Fire();

        const static sf::Color colorPalette[37];

        float          getPixelSize() const { return m_pixelSize; };
        unsigned int   getWidth()     const { return m_width;  };
        unsigned int   getHeight()    const { return m_height; };
        unsigned int** getValues()    const { return m_values; };
        sf::Vector2f   getOrigin()    const { return m_origin; };

        void update();
        void render(sf::RenderWindow&);

        void setFireSourceStrength(int);
        unsigned int getFireSourceStrength() const;
};

#endif