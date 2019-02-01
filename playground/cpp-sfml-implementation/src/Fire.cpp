#include "Fire.h"

const sf::Color Fire::colorPalette[37] {
    sf::Color(7,7,7), sf::Color(31,7,7),  sf::Color(47,15,7), 
    sf::Color(71,15,7), sf::Color(87,23,7), sf::Color(103,31,7), 
    sf::Color(119,31,7), sf::Color(143,39,7), sf::Color(159,47,7), 
    sf::Color(175,63,7), sf::Color(191,71,7), sf::Color(199,71,7), 
    sf::Color(223,79,7), sf::Color(223,87,7), sf::Color(223,87,7), 
    sf::Color(215,95,7), sf::Color(215,95,7), sf::Color(215,103,15), 
    sf::Color(207,111,15), sf::Color(207,119,15), sf::Color(207,127,15), 
    sf::Color(207,135,23), sf::Color(199,135,23), sf::Color(199,143,23), 
    sf::Color(199,151,31), sf::Color(191,159,31), sf::Color(191,159,31), 
    sf::Color(191,167,39), sf::Color(191,167,39), sf::Color(191,175,47), 
    sf::Color(183,175,47), sf::Color(183,183,47), sf::Color(183,183,55), 
    sf::Color(207,207,111), sf::Color(223,223,159), sf::Color(239,239,199), 
    sf::Color(255,255,255)
};

Fire::Fire(float pixelSize, unsigned int width,
           unsigned int height, sf::Vector2f origin)
{
    m_pixelSize = pixelSize;
    m_width  = width;
    m_height = height;
    m_origin = origin;

    m_values = new unsigned int*[height];
    for (int i=0; i < height; i++) {
        m_values[i] = new unsigned int[width];
        for (int j=0; j < width; j++) {
            // Initializes all values as 0
            m_values[i][j] = 0;
        }
    }
}

Fire::~Fire()
{
    for (int i=0; i < m_height; i++) {
        delete[] m_values[i];
    }

    delete[] m_values;
}

void Fire::setFireSourceStrength(int strength)
{
    if (strength < 0)
        strength = 0;
    if (strength > 36)
        strength = 36;

    for (int j=0; j < m_width; j++) {
        m_values[m_height-1][j] = strength;
    }
}

unsigned int Fire::getFireSourceStrength() const
{
    return m_values[m_height-1][0];
}

void Fire::update()
{
    int decay;
    int newFireValue;
    for (int i=0; i < m_height - 1; i++) {
        for (int j=0; j < m_width; j++) {
            decay = (rand() % 3);
            newFireValue = m_values[i+1][j] - (decay & 1);

            //  If the J value is less than 0, it will change the other
            // side of the fire
            //  If it is greater than the size of the width of the fire,
            // the same will happen
            int newJ = j-decay+1;
            newJ = newJ < 0 ? m_width - 1 : newJ;
            newJ = newJ >= m_width ? 0 : newJ; 
            m_values[i][newJ] = newFireValue >= 0 ? newFireValue : 0;
        }
    }
}


// This function requires testing
void Fire::render(sf::RenderWindow& window)
{
    sf::RectangleShape currentPixel;
    for (int i=0; i < m_height; i++) {
        for (int j=0; j < m_width; j++) {
            currentPixel = sf::RectangleShape(
                                sf::Vector2f(m_pixelSize, m_pixelSize));
            currentPixel.setPosition(m_origin.x + j * m_pixelSize,
                                     m_origin.y + i * m_pixelSize);
            currentPixel.setFillColor(colorPalette[m_values[i][j]]);

            window.draw(currentPixel);
        }
    }
}