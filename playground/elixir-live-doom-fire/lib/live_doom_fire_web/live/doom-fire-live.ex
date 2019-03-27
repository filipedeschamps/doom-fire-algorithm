defmodule LiveDoomFireWeb.LiveDoomFire do
  use Phoenix.LiveView

  alias LiveDoomFireWeb.DoomFire

  def render(assigns) do
    LiveDoomFireWeb.LiveDoomFireView.render("index.html", assigns)
  end

  def mount(_session, socket) do
    if connected?(socket), do: :timer.send_interval(72, self(), :tick)

    {fire_data, width, height} = DoomFire.create_fire_data_structure(40, 30)
    fire_data = DoomFire.create_fire_source(fire_data, width, height, 20)

    {:ok, assign(socket, fire: fire_data, width: width, height: height)}
  end

  def handle_info(:tick, socket) do
    width = socket.assigns.width
    height = socket.assigns.height
    fire = socket.assigns.fire
    fire = DoomFire.calculate_fire_propagation(fire, width, height)

    {:noreply, assign(socket, fire: fire)}
  end
end
