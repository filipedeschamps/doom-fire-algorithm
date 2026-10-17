! DOOM fire algorithm in Fortran (F2018), rendered in a UTF-8 / 256-color
! terminal.
!
! Algorithm: https://fabiensanglard.net/doom_fire_psx/index.html
!
! Grid: 100 columns x 30 rows (hardcoded).  Press q (or Ctrl-C) to quit.

program doom_fire
  use, intrinsic :: iso_c_binding,   only: c_int, c_char, c_long, c_size_t
  use, intrinsic :: iso_fortran_env, only: output_unit
  implicit none

  ! POSIX usleep(3): sleep for N microseconds (used for frame timing).
  interface
    subroutine usleep(usec) bind(C, name='usleep')
      import :: c_int
      integer(c_int), value :: usec
    end subroutine usleep

    ! POSIX read(2): with the terminal set to "min 0 time 0" (see below) it
    ! returns immediately, giving 0 when no key is waiting.
    function c_read(fd, ch, n) bind(C, name='read') result(nread)
      import :: c_int, c_char, c_long, c_size_t
      integer(c_int),    value      :: fd
      character(c_char), intent(out) :: ch(*)
      integer(c_size_t), value      :: n
      integer(c_long)               :: nread
    end function c_read
  end interface

  ! Configuration
  integer,        parameter :: W        = 100       ! columns
  integer,        parameter :: H        = 30        ! rows
  integer,        parameter :: MAX_HEAT = 36        ! canonical max intensity
  integer(c_int), parameter :: FRAME_US = 50000_c_int   ! 50 ms -> ~20 fps

  ! Room for per-row reset/newline and the cursor-home prefix.
  integer, parameter :: BUF_LEN = W * H * 14 + H * 8 + 64

  character(len=1), parameter :: ESC = achar(27)

  ! 256-colour palette index for each heat value 0..36:
  ! black -> deep red -> red -> orange -> yellow -> white.
  integer, parameter :: PALETTE(0:MAX_HEAT) = [ &
       16,  52,  52,  88,  88,  88, 124, 124, 124, 160, &   !  0.. 9
      160, 160, 196, 196, 196, 202, 202, 202, 208, 208, &   ! 10..19
      208, 214, 214, 214, 220, 220, 220, 226, 226, 226, &   ! 20..29
      227, 228, 229, 230, 230, 231, 231 ]                   ! 30..36

  ! State
  ! Declared (width, height): Fortran is column-major, so the leftmost index
  ! (x) is contiguous in memory.  Inner loops therefore run over x.
  real :: fire(0:W-1, 0:H-1)

  character(len=16)    :: color_seq(0:MAX_HEAT)   ! precomputed ESC[38;5;Nm
  integer              :: color_len(0:MAX_HEAT)
  character(len=3)     :: glyph(0:4)               ! ' ', light, medium, dark, full
  integer              :: glyph_len(0:4)
  character(len=BUF_LEN) :: buf                    ! whole frame lives here
  integer              :: pos                      ! chars used in buf

  integer :: i
  logical :: quit

  ! Setup
  call random_seed()

  ! Build colour escape strings once
  do i = 0, MAX_HEAT
    write(color_seq(i), '(A,A,I0,A)') ESC, '[38;5;', PALETTE(i), 'm'
    color_len(i) = len_trim(color_seq(i))
  end do

  glyph(0) = ' ';                              glyph_len(0) = 1
  glyph(1) = char(226)//char(150)//char(145);  glyph_len(1) = 3  ! U+2591 light shade
  glyph(2) = char(226)//char(150)//char(146);  glyph_len(2) = 3  ! U+2592 medium shade
  glyph(3) = char(226)//char(150)//char(147);  glyph_len(3) = 3  ! U+2593 dark shade
  glyph(4) = char(226)//char(150)//char(136);  glyph_len(4) = 3  ! U+2588 full block

  fire = 0.0
  fire(:, H-1) = real(MAX_HEAT)

  ! Put the terminal in non-blocking
  call execute_command_line('stty -icanon -echo -isig min 0 time 0 2>/dev/null')

  ! Clear screen
  write(output_unit, '(A)', advance='no') ESC//'[2J'//ESC//'[H'

  ! Main loop
  quit = .false.
  do while (.not. quit)
    call propagate()
    call render()
    call poll_quit(quit)
    call usleep(FRAME_US)
  end do

  ! Restore the terminal
  call execute_command_line('stty icanon echo isig 2>/dev/null')
  write(output_unit, '(A)') ESC//'[0m'

contains

  ! Spread heat from every row upward by one row.
  subroutine propagate()
    integer :: x, y, decay, dst_x
    real    :: r

    do y = 1, H - 1
      do x = 0, W - 1
        call random_number(r)
        decay = int(r * 3.0) ! 0, 1 or 2

        dst_x = modulo(x - decay, W)

        fire(dst_x, y - 1) = max(fire(x, y) - real(decay), 0.0)
      end do
    end do
  end subroutine propagate

  ! Append s(1:n) to the frame buffer.
  subroutine put(s, n)
    character(len=*), intent(in) :: s
    integer,          intent(in) :: n
    buf(pos+1:pos+n) = s(1:n)
    pos = pos + n
  end subroutine put

  ! Drain all pending keystrokes; set quit if one is `q`, `Q` or Ctrl-C.
  subroutine poll_quit(want_quit)
    logical, intent(out) :: want_quit
    character(kind=c_char) :: ch(1)
    integer(c_long) :: n

    want_quit = .false.
    do
      n = c_read(0_c_int, ch, 1_c_size_t)
      if (n <= 0) exit                      ! nothing (more) waiting
      if (ch(1) == 'q' .or. ch(1) == 'Q' .or. ch(1) == char(3)) want_quit = .true.
    end do
  end subroutine poll_quit

  ! Build the full frame in `buf`, then emit it with a single write.
  subroutine render()
    integer :: x, y, heat, level, last_heat

    pos = 0
    call put(ESC//'[H', 3)                  ! cursor home (no clear -> no flicker)

    do y = 0, H - 1
      last_heat = -1                        ! force a colour code at row start
      do x = 0, W - 1
        heat  = min(max(int(fire(x, y)), 0), MAX_HEAT)

        ! Map heat 0..36 to one of 5 glyph levels 0..4.
        level = min(int(real(heat) * 5.0 / real(MAX_HEAT)), 4)

        if (level > 0 .and. heat /= last_heat) then
          call put(color_seq(heat), color_len(heat))   ! only on colour change
          last_heat = heat
        end if
        call put(glyph(level), glyph_len(level))
      end do
      call put(ESC//'[0m', 4)               ! reset colours at end of row
      if (y < H - 1) call put(achar(10), 1) ! no newline after last row: no scroll
    end do

    write(output_unit, '(A)', advance='no') buf(1:pos)
    flush(output_unit)
  end subroutine render

end program doom_fire
