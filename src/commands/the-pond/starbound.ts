import { KlasaMessage, KlasaClient, CommandStore } from 'klasa'
import { GUILDS } from '@libraries/constants/index'
import ExclusiveCommand from '@libraries/ExclusiveCommand'
import { User, Message, GuildMember, Guild } from 'discord.js'
import { Possible } from 'klasa'
import createStarboundTemplate from '@templates/StarboundTemplate'

/**
 * These actions/subcommands require a user to be authorised.
 */
enum ProtectedActions {
  START = 'start',
  STOP = 'stop',
  RESTART = 'restart',
}

export default class StarboundCommand extends ExclusiveCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'starbound',
      usage:
        '<start|stop|restart|info|authorise|status:default> (member:member)',
      runIn: ['text', 'dm'],
      aliases: ['sb'],
      usageDelim: ' ',
      flagSupport: true,
      subcommands: true,
      description: 'Interact with the Starbound server.',
      exclusive: {
        guilds: [GUILDS.THE_POND],
        subcommands: ['start', 'stop', 'restart', 'authorise'],
      },
    })

    this.createCustomResolver(
      'member',
      (
        argument: string,
        possible: Possible,
        message: KlasaMessage,
        [subcommand]: any[]
      ) => {
        if (!message.flagArgs.list) {
          if (subcommand === 'authorise' && !argument) {
            throw message.language.get('STARBOUND_AUTH_USER_REQUIRED')
          }

          return this.client.arguments
            .get('member')!
            .run(argument, possible, message)
        }
      }
    )
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
      throw message.language.get('STARBOUND_NO_PERMISSION', [
        ProtectedActions.START,
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
      return message.sendLocale('STARBOUND_START_FAILURE', [error.message])
    }
  }

  /**
   * Stop the Starbound server.
   */
  async stop(message: KlasaMessage) {
    if (!this.isUserAuthorised(message.author)) {
      throw message.language.get('STARBOUND_NO_PERMISSION', [
        ProtectedActions.STOP,
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
      throw message.language.get('STARBOUND_NO_PERMISSION', [
        ProtectedActions.RESTART,
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

  /**
   * Authorise a user to start/stop/restart the Starbound server.
   */
  async authorise(message: KlasaMessage, [member]: [GuildMember]) {
    if (message.flagArgs.list) {
      return this.listAuthorisedUsers(message)
    }

    if (!message.client.owners.has(member.user)) {
      throw message.language.get('STARBOUND_AUTH_FAILURE')
    }

    const arrayAction = this.isUserAuthorised(member.user) ? 'remove' : 'add'
    this.client.settings.update('starbound.authorisedUsers', member.user.id, {
      arrayAction,
    })
    return message.sendLocale('STARBOUND_AUTH_SUCCESS', [member, arrayAction])
  }

  private listAuthorisedUsers(message: KlasaMessage) {
    const members: GuildMember[] = (this.client.settings.get(
      'starbound.authorisedUsers'
    ) as string[]).map(userId => {
      return message.guild.members.get(userId)
    })

    return message.sendEmbed(
      createStarboundTemplate()
        .setTitle('Authorised Users')
        .setDescription(members.join(', '))
    )
  }
}
