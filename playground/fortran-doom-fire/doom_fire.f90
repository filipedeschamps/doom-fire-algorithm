! DOOM fire algorithm in Fortran (F2018), rendered in a UTF-8 / 256-color
! terminal.
!
! Algorithm: https://fabiensanglard.net/doom_fire_psx/index.html
!
! Grid: 100 columns x 30 rows.
!
! Keys:  Left / Right  change the wind (which way the flames lean)
!        Up / Down     make the flames taller / shorter
!        q or Ctrl-C   quit

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

  integer, parameter :: BUF_LEN = W * H * 14 + H * 8 + 256

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

  ! Interactive controls (changed by the arrow keys in poll_input):
  !   drift  - horizontal bias added to every flame's shift.  The average
  !            net shift per row is (drift - 1), so  0 = original DOOM lean
  !            (left), 1 = straight up, 2.. = lean right, -1.. = lean more left.
  !   source - heat of the bottom row.  Heat dies off by ~1 per row, so this is
  !            roughly the flame height in rows.
  integer :: drift, source
  integer :: esc_state      ! 0 normal, 1 saw ESC, 2 saw ESC [  (arrow parser)

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

  drift     = 0
  source    = MAX_HEAT
  esc_state = 0
  fire = 0.0
  fire(:, H-1) = real(source)

  ! Put the terminal in non-blocking
  call execute_command_line('stty -icanon -echo -isig min 0 time 0 2>/dev/null')

  ! Clear screen
  write(output_unit, '(A)', advance='no') ESC//'[2J'//ESC//'[H'

  ! Main loop
  quit = .false.
  do while (.not. quit)
    call propagate()
    call render()
    call poll_input(quit)
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

    ! Fuel row follows height control.
    fire(:, H-1) = real(source)

    do y = 1, H - 1
      do x = 0, W - 1
        call random_number(r)
        decay = int(r * 3.0)                ! 0, 1 or 2

        dst_x = modulo(x + drift - decay, W)

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

  ! Drain all pending keystrokes. Arrow keys arrive as 3 bytes: ESC [ A/B/C/D
  subroutine poll_input(want_quit)
    logical, intent(out) :: want_quit
    character(kind=c_char) :: ch(1)
    character(len=1)       :: c
    integer(c_long)        :: n

    want_quit = .false.
    do
      n = c_read(0_c_int, ch, 1_c_size_t)
      if (n <= 0) exit                      ! nothing (more) waiting
      c = ch(1)

      select case (esc_state)
      case (1)                              ! previous byte was ESC
        if (c == '[' .or. c == 'O') then
          esc_state = 2
        else
          esc_state = 0
        end if
      case (2)                              ! inside an ESC [ sequence
        esc_state = 0
        select case (c)
        case ('A'); source = min(source + 2, MAX_HEAT)   ! up    -> taller
        case ('B'); source = max(source - 2, 2)          ! down  -> shorter
        case ('C'); drift  = min(drift + 1, 4)           ! right -> lean right
        case ('D'); drift  = max(drift - 1, -2)          ! left  -> lean left
        end select
      case default
        if (c == char(27)) then
          esc_state = 1
        else if (c == 'q' .or. c == 'Q' .or. c == char(3)) then
          want_quit = .true.
        end if
      end select
    end do
  end subroutine poll_input

  ! Status text
  function status_line() result(text)
    character(len=W) :: text
    character(len=8) :: wind
    integer :: lean

    lean = drift - 1                        ! average net shift per row
    if (lean < 0) then
      wind = repeat('<', -lean)
    else if (lean > 0) then
      wind = repeat('>', lean)
    else
      wind = '|'
    end if

    write(text, '(A,A,A,I0,A,I0,A)') ' wind: ', trim(wind), '   height: ', &
          source, '/', MAX_HEAT, '   [arrows] wind/height   [q] quit'
  end function status_line

  ! Build the full frame in `buf`, then emit it with a single write.
  subroutine render()
    integer :: x, y, heat, level, last_heat

    pos = 0
    call put(ESC//'[H', 3)                  ! cursor home (no clear -> no flicker)

    do y = 0, H - 1
      last_heat = -1                        ! force a colour code at row start
      do x = 0, W - 1
        ! Scale by the source so the bottom stays white-hot at any height;
        ! shorter flames just fade out over fewer rows.
        heat  = min(max(int(fire(x, y) * real(MAX_HEAT) / real(source)), 0), &
                    MAX_HEAT)

        ! Map heat 0..36 to one of 5 glyph levels 0..4.
        level = min(int(real(heat) * 5.0 / real(MAX_HEAT)), 4)

        if (level > 0 .and. heat /= last_heat) then
          call put(color_seq(heat), color_len(heat))   ! only on colour change
          last_heat = heat
        end if
        call put(glyph(level), glyph_len(level))
      end do
      call put(ESC//'[0m', 4)               ! reset colours at end of row
      call put(achar(10), 1)
    end do

    ! Status line on row H+1
    call put(status_line(), W)
    call put(ESC//'[K', 3)                  ! clear anything left to the right

    write(output_unit, '(A)', advance='no') buf(1:pos)
    flush(output_unit)
  end subroutine render

end program doom_fire
