cmake_minimum_required(VERSION 3.10)
project(DoomFire)

set(CMAKE_CXX_STANDARD 11)

# Compile to debug
#set(CMAKE_BUILD_TYPE Debug)

# Adds all header files in the include folder to the project
include_directories(include)

# Adds all the source files in the src folder to the project
file(GLOB SOURCES "src/*.cpp")
# set(MAIN main.cpp src/file1.cpp src/file2.cpp)

# Creates project executable
# add_executable(DoomFire ${MAIN})
add_executable(DoomFire main.cpp ${SOURCES})

# Detect and add SFML
set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake_modules" ${CMAKE_MODULE_PATH})
find_package(SFML 2 REQUIRED system graphics window network audio)
if(SFML_FOUND)
    include_directories(${SFML_INCLUDE_DIR})
    target_link_libraries(${PROJECT_NAME} ${SFML_LIBRARIES})
endif()
