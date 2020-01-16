import { Inhibitor, InhibitorStore, KlasaMessage, Command } from 'klasa'
import ExclusiveCommand from '@libraries/ExclusiveCommand'
import { getSubCommands } from '@utilities/commands'

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
      if (command.subcommands && command.exclusive.subcommands.length) {
        const subcommand = message.args[0]

        if (command.exclusive.subcommands.some(name => name === subcommand)) {
          return message.language.get(
            'INHIBITOR_EXCLUSIVE_SUBCOMMAND_NOTICE',
            subcommand,
            command.exclusive.guilds.map(
              guildId => this.client.guilds.get(guildId).name
            )
          )
        }
      } else {
        return message.language.get(
          'INHIBITOR_EXCLUSIVE_COMMAND_NOTICE',
          message.commandText,
          command.exclusive.guilds.map(
            guildId => this.client.guilds.get(guildId).name
          )
        )
      }
    }

    return false
  }
}
