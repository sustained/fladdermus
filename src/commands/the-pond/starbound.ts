import { KlasaMessage, KlasaClient, CommandStore } from 'klasa'
import { GUILDS } from '@libraries/constants/index'
import ExclusiveCommand from '@libraries/ExclusiveCommand'

/**
 * These actions/subcommands require a user to be authorised.
 */
enum ProtectedAction {
  START = 'start',
  STOP = 'stop',
  RESTART = 'restart',
}

export default class StarboundCommand extends ExclusiveCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
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
   * Check if a user is authorised to carry out protected actions.
   */
  private isUserAuthorised(user: User) {
    return (this.client.settings.get(
      'starbound.authorisedUsers'
    ) as string[]).includes(user.id)
  }

  /**
   * Start the Starbound server.
   */
  async start(message: KlasaMessage) {
    if (!this.isUserAuthorised(message.author)) {
      return message.sendLocale('STARBOUND_NO_PERMISSION', [
        ProtectedAction.START,
      ])
    }

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
    if (!this.isUserAuthorised(message.author)) {
      return message.sendLocale('STARBOUND_NO_PERMISSION', [
        ProtectedAction.STOP,
      ])
    }

    try {
      this.client.starbound.stopServer()
    } catch (error) {
      return error
    }
  }

  /**
   * Restart the Starbound server.
   */
  async restart(message: KlasaMessage) {
    if (!this.isUserAuthorised(message.author)) {
      return message.sendLocale('STARBOUND_NO_PERMISSION', [
        ProtectedAction.RESTART,
      ])
    }
  }

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
