defmodule LiveDoomFireWeb.Router do
  use LiveDoomFireWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(Phoenix.LiveView.Flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", LiveDoomFireWeb do
    # Use the default browser stack
    pipe_through(:browser)

    get("/", LiveDoomFireController, :live)
  end
end
