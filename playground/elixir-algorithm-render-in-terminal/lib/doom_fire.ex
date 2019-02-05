defmodule DoomFire do
  @moduledoc """
  CLI for drawing doom fire effect in the terminal using ANSI-256 color palette.
  """

  @doc """
  Call the lib with default parameters (burns for 7 seconds at about 13 frames per second).

  ## Examples

      iex> DoomFire.burn()
      :ok

  """
  def burn() do
    burn_loop(100, 75)
    :ok
  end

  @doc """
  Animates doom fire for given number of iterations at a given ms_beetween_frames frames for
  iterations * ms_beetween_frames milliseconds

  ## Examples

      iex> DoomFire.burn(iterations, time_beetween_frames)
      :ok

  """
  def burn(iterations, ms_beetween_frames) do
    burn_loop(iterations, ms_beetween_frames)
    :ok
  end

  defp burn_loop(iterations, ms_beetween_frames) do
    {:ok, pid} = GenServer.start_link(DoomFire.FireState, [])

    Enum.reduce_while(1..iterations, GenServer.cast(pid, :initiate), fn i, state_update ->
      if i > iterations do
        {:halt, state_update}
      else
        {state_update, _, _} = GenServer.call(pid, :state)
        DoomFire.Draw.draw(state_update)
        :timer.sleep(ms_beetween_frames)
        {:cont, state_update}
      end
    end)
  end
end
