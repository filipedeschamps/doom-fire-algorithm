defmodule LiveDoomFireWeb.UserSocket do
  use Phoenix.Socket

  def connect(_params, socket) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
