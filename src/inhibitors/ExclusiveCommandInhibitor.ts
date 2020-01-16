import { Inhibitor, InhibitorStore, KlasaMessage, Command } from 'klasa'
import ExclusiveCommand from '@libraries/ExclusiveCommand'

export default class extends Inhibitor {
  constructor(store: InhibitorStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'ExclusiveCommandInhibitor',
      enabled: true,
      spamProtection: false,
    })
  }

  async run(message: KlasaMessage, command: Command | ExclusiveCommand) {
    if (!(command instanceof ExclusiveCommand)) {
      return false
    }

    if (message.channel.type === 'dm' && command.runIn.includes('dm')) {
      return false
    }

    if (!command.exclusive.guilds.includes(message.guild.id)) {
      if (command.subcommands) {
        console.log('!!!', command.usage)
      } else {
        return message.language.get(
          'INHIBITOR_EXCLUSIVE_COMMAND_NOTICE',
          command.exclusive.guilds.map(
            guildId => this.client.guilds.get(guildId).name
          )
        )
      }
    }

    return false
  }
}
