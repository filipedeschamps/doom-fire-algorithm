defmodule DoomFire.FireState do
  use GenServer

  def update_whole_state(column, {state, row, update_function}) do
    new_state = update_function.(row, column, state)
    {new_state, row, update_function}
  end

  def update_row(row, {state, width, update_function}) do
    {new_state, _, _} =
      Enum.reduce(0..width, {state, row, update_function}, &update_whole_state/2)

    {new_state, width, update_function}
  end

  def update_state({state, width, height}, update_function) do
    height_minus = height
    width_minus = width

    {update_state, _, _} =
      Enum.reduce(0..height_minus, {state, width_minus, update_function}, &update_row/2)

    update_state
  end

  def update_state_initiate({state, width, height}) do
    update_fun = fn row, column, state ->
      if row == 0 do
        index = column + (width - 1) * (height - 1) - width
        index_row = Kernel.trunc(index / (width - 1))

        index_column =
          cond do
            index_row > 0 -> Kernel.trunc(rem(index, index_row * (width - 1)))
            true -> 0
          end

        DoomFire.Utils.TupleMatrix.put(state, index_row, index_column, 36)
      else
        state
      end
    end

    update_state({state, width, height}, update_fun)
  end

  def generate_decay() do
    Kernel.trunc(:rand.uniform(100) * 3 / 100)
  end

  def update_state_fire_propagation({state, width, height}) do
    update_fun = fn row, column, state ->
      if row + 1 < height - 1 && column < width - 1 do
        value = row * (width - 1) + column
        bellow_value = DoomFire.Utils.TupleMatrix.get(state, row + 1, column)
        decay = generate_decay()
        update_pixel_decay = value - decay

        update_pixel_decay =
          cond do
            update_pixel_decay > 0 -> update_pixel_decay
            true -> 0
          end

        bellow_value_intensity = bellow_value - decay

        bellow_value_intensity =
          cond do
            bellow_value_intensity > 0 -> bellow_value_intensity
            true -> 0
          end

        upd_row = Kernel.trunc(update_pixel_decay / (width - 1))

        upd_column =
          cond do
            upd_row > 0 -> Kernel.trunc(rem(update_pixel_decay, upd_row * (width - 1)))
            true -> 0
          end

        DoomFire.Utils.TupleMatrix.put(state, upd_row, upd_column, bellow_value_intensity)
      else
        state
      end
    end

    update_state({state, width, height}, update_fun)
  end

  @impl true
  def init(_) do
    {:ok, width} = :io.columns()
    {:ok, height} = :io.rows()

    {:ok,
     {List.duplicate(List.duplicate(0, width + 1) |> List.to_tuple(), height + 1)
      |> List.to_tuple(), width, height}}
  end

  @impl true
  def handle_call(:state, _from, {state, width, height}) do
    GenServer.cast(self(), :update)
    {:reply, {state, width, height}, {state, width, height}}
  end

  @impl true
  def handle_cast(:update, {state, width, height}) do
    state = update_state_fire_propagation({state, width, height})
    {:noreply, {state, width, height}}
  end

  def handle_cast(:initiate, {state, width, height}) do
    state = update_state_initiate({state, width, height})
    {:noreply, {state, width, height}}
  end
end
