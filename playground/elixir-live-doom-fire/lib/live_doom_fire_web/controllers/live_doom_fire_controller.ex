defmodule LiveDoomFireWeb.LiveDoomFireController do
  use LiveDoomFireWeb, :controller

  def live(conn, _params) do
    Phoenix.LiveView.Controller.live_render(
      conn,
      LiveDoomFireWeb.LiveDoomFire,
      session: %{cookies: conn.cookies}
    )
  end
end
