# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :live_doom_fire, LiveDoomFireWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "gyUjOdfii8foS3z6mxtEreHhh7MRiTPsfKyYY1wS/CYhYk0nqKqTKDSQcla1+jCD",
  render_errors: [view: LiveDoomFireWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: LiveDoomFire.PubSub, adapter: Phoenix.PubSub.PG2],
  live_view: [signing_salt: "R0QeR4t0JhxQy4aWZ71cnY8GCJSBf7bn"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

config :phoenix, :json_library, Jason
config :phoenix, template_engines: [leex: Phoenix.LiveView.Engine]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
