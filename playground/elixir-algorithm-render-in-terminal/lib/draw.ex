defmodule DoomFire.Draw do
  @color_palette {
    IO.ANSI.color_background(232),
    IO.ANSI.color_background(52),
    IO.ANSI.color_background(52),
    IO.ANSI.color_background(53),
    IO.ANSI.color_background(88),
    IO.ANSI.color_background(89),
    IO.ANSI.color_background(89),
    IO.ANSI.color_background(90),
    IO.ANSI.color_background(132),
    IO.ANSI.color_background(130),
    IO.ANSI.color_background(167),
    IO.ANSI.color_background(167),
    IO.ANSI.color_background(196),
    IO.ANSI.color_background(196),
    IO.ANSI.color_background(196),
    IO.ANSI.color_background(202),
    IO.ANSI.color_background(202),
    IO.ANSI.color_background(203),
    IO.ANSI.color_background(160),
    IO.ANSI.color_background(160),
    IO.ANSI.color_background(160),
    IO.ANSI.color_background(162),
    IO.ANSI.color_background(162),
    IO.ANSI.color_background(166),
    IO.ANSI.color_background(167),
    IO.ANSI.color_background(168),
    IO.ANSI.color_background(178),
    IO.ANSI.color_background(178),
    IO.ANSI.color_background(179),
    IO.ANSI.color_background(179),
    IO.ANSI.color_background(180),
    IO.ANSI.color_background(142),
    IO.ANSI.color_background(142),
    IO.ANSI.color_background(144),
    IO.ANSI.color_background(185),
    IO.ANSI.color_background(228),
    IO.ANSI.color_background(229),
    IO.ANSI.color_background(231)
  }

  def draw_column(column, {state, row, line}) do
    color = DoomFire.Utils.TupleMatrix.get(state, row, column)
    cell = elem(@color_palette, color) <> " "
    line = [line ++ cell]
    {state, row, line}
  end

  def draw_row(row, {state, width, concat_line}) do
    {new_state, _, new_line} = Enum.reduce(0..width, {state, row, []}, &draw_column/2)
    line = [concat_line ++ new_line]
    {new_state, width, line}
  end

  def draw(state) do
    {:ok, width} = :io.columns()
    {:ok, height} = :io.rows()
    height_minus = height - 2
    width_minus = width - 1
    {_, _, line} = Enum.reduce(0..height_minus, {state, width_minus, []}, &draw_row/2)
    line = Enum.join(line, "\n")
    line = line <> IO.ANSI.black_background()
    IO.puts(line)
  end
end
