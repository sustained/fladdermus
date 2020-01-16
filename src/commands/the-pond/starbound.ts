import { KlasaMessage, KlasaClient, CommandStore } from 'klasa'
import { GUILDS } from '@libraries/constants/index'
import ExclusiveCommand from '@libraries/ExclusiveCommand'

export default class extends ExclusiveCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    // TODO: This is an issue with tuples which we can't avoid, we should just make
    // our command extension take an object instead, then we avoid this issue completely.
    super(store, file, directory, {
      name: 'starbound',
      usage: '<start|stop|restart|info|status:default>',
      runIn: ['text', 'dm'],
      aliases: ['sb'],
      subcommands: true,
      description: 'Interact with the Starbound server.',
      exclusive: {
        guilds: [GUILDS.THE_POND],
        subcommands: ['start', 'stop', 'restart', 'info'],
      },
      // permissionLevel: 6,
    })
  }

  /**
   * Start the Starbound server.
   */
  async start(message: KlasaMessage) {
    if (this.client.starbound.isRunning()) {
      return message.sendLocale('STARBOUND_START_ALREADY_RUNNING')
    }

    try {
      this.client.starbound.startServer()
      return message.sendLocale('STARBOUND_START_SUCCESS')
    } catch (error) {
      console.error(error)
      return message.sendLocale('STARBOUND_START_FAILURE', error.message)
    }
  }

  /**
   * Stop the Starbound server.
   */
  async stop(message: KlasaMessage) {
    try {
      this.client.starbound.stopServer()
    } catch (error) {
      return error
    }
  }

  /**
   * Restart the Starbound server.
   */
  async restart(message: KlasaMessage) {}

  /**
   * Request information about the Starbound server.
   */
  async info(message: KlasaMessage) {}

  /**
   * Get the status of the Starbound server.
   */
  async status(message: KlasaMessage) {}

  /**
   * See who's currently online on the Starbound server.
   */
  async online(message: KlasaMessage) {}
}
