
#include <iostream>
#include <cstdlib>
#include <SFML/Graphics.hpp>
#include "Fire.h"

// Function to print each position of fireValues
void testPrintFireValues(const Fire& fire)
{
    for (unsigned int i=0; i<fire.getHeight(); i++) {
        for (unsigned int j=0; j<fire.getWidth(); j++) {
            printf("%2i ", fire.getValues()[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

int main()
{
    // Variables used in the fire algorithm
    const int fireWidth  = 240;
    const int fireHeight = 160;
    const float fireSize = 3.f;

    // Configuration variables
    int windowWidth  = fireWidth  * fireSize;
    int windowHeight = fireHeight * fireSize;
    unsigned int fps = 60;

    Fire* fire = new Fire(fireSize, fireWidth, fireHeight, sf::Vector2f(0,0));
    fire->setFireSourceStrength(36);

    // SFML variables
    sf::Uint32 style = sf::Style::Titlebar |
                       sf::Style::Close    |
                       sf::Style::Resize;
    sf::RenderWindow window(sf::VideoMode(windowWidth, windowHeight),
                            "Doom Fire Algorithm",
                            style);
    window.setFramerateLimit(fps);

    bool paused = false;
    while (window.isOpen())
    {
        sf::Event e;

        while (window.pollEvent(e))
        {
            switch (e.type)
            {
                case e.Closed:
                    delete fire;
                    paused = true;
                    window.close();
                    break;

                case e.TextEntered:
                    if (e.text.unicode == 'p') {
                        paused = !paused;
                    }
                    if (e.text.unicode == 't') {
                        testPrintFireValues(*fire);
                    }
                    if (e.text.unicode == ' ') {
                        if (fire->getFireSourceStrength() == 36)
                            fire->setFireSourceStrength(0);
                        else
                            fire->setFireSourceStrength(36);
                    }
                    break;

                default: 
                    break;
            }
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Up)) {
            fire->setFireSourceStrength(fire->getFireSourceStrength() + 1);
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Down)) {
            fire->setFireSourceStrength(fire->getFireSourceStrength() - 1);
        }

        if (!paused) {
            // Clearing background
            //window.clear(sf::Color::Black);
            //  Clearing the background is not necessary
            // in this program.

            fire->update();
            fire->render(window);
        }
        window.display();
    }


    return EXIT_SUCCESS; 
}
