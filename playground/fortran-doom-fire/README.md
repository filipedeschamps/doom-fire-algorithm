# Fortran Doom Fire

Doom fire algorithm in Fortran 2018 (with the original's left-leaning flames), rendered in the terminal with Unicode block characters and ANSI 256-color escapes. Based on [Fabien Sanglard's article](https://fabiensanglard.net/doom_fire_psx/index.html).

## Running

Requirements:

- `gfortran` (any version with F2018 support) and `make`
- A **UTF-8** terminal with **256-color** support, at least 100 columns x 31 rows (Tested on kitty terminal)

```sh
make run
```

Or build and run separately:

```sh
make
./doom_fire
```

Controls:

- `Left` / `Right` arrows: change the wind, i.e. which way the flames lean
- `Up` / `Down` arrows: make the flames taller / shorter
- `q` (or `Ctrl-C`): quit; the terminal settings are restored on exit

If your compiler is installed under a different name, the Makefile tries `gfortran` and then `gfortran-16`. You can also choose one explicitly:

```sh
make FC=gfortran-16
```

Other targets:

- `make debug` builds with `-O0 -g -fcheck=all -ffpe-trap=invalid,zero,overflow` to catch out-of-bounds accesses
- `make clean` removes build artifacts
