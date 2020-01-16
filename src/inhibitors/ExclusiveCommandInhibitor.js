import { Inhibitor } from 'klasa'
import ExclusiveCommand from '@libraries/ExclusiveCommand'

export default class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      name: 'ExclusiveCommandChecker',
      enabled: true,
      spamProtection: false,
    })
  }

  async run(message, command) {
    if (!(command instanceof ExclusiveCommand)) {
      return false
    }

    // If we got this far then `runIn` included `dm` which means it's allowed.
    if (message.channel.type === 'dm') {
      return false
    }

    if (!command.exclusive.guilds.includes(message.guild.id)) {
      if (command.subcommands)
        return message.language.get(
          'INHIBITOR_EXCLUSIVE_COMMAND_NOTICE',
          command.exclusiveTo.map(
            guildId => this.client.guilds.get(guildId).name
          )
        )
    }

    return false
  }
}
