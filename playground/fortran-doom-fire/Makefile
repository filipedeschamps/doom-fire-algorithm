# Fortran DOOM fire
#
# Compiler selection: use $(FC) if given (e.g. `make FC=gfortran-16`),
# otherwise try `gfortran`, then fall back to `gfortran-16`

ifeq ($(origin FC),default)
FC := $(shell command -v gfortran >/dev/null 2>&1 && echo gfortran || \
              (command -v gfortran-16 >/dev/null 2>&1 && echo gfortran-16))
endif

ifeq ($(strip $(FC)),)
$(error No Fortran compiler found. Install gfortran, or run: make FC=/path/to/gfortran)
endif

TARGET = doom_fire
SRC    = doom_fire.f90

FFLAGS      = -O3 -march=native -Wall -Wextra -std=f2018
DEBUGFLAGS  = -O0 -g -Wall -Wextra -std=f2018 -fcheck=all -ffpe-trap=invalid,zero,overflow

.PHONY: all run debug clean

all:
	$(FC) $(FFLAGS) -o $(TARGET) $(SRC)

run: all
	./$(TARGET)

debug:
	$(FC) $(DEBUGFLAGS) -o $(TARGET) $(SRC)

clean:
	rm -f $(TARGET) *.mod *.o.
