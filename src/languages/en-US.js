import { Language } from 'klasa'
import { MessageEmbed } from 'discord.js'
module.exports = class extends Language {
  constructor(...args) {
    super(...args)
    this.language = {
      INHIBITOR_EXCLUSIVE_COMMAND_NOTICE: guilds =>
        new MessageEmbed().setDescription(
          `Sorry but that command is exclusive to the following guild(s): ${guilds.join(
            ', '
          )}!"`
        ),
      STARBOUND_START_ALREADY_RUNNING: () =>
        new MessageEmbed()
          .setColor('RED')
          .setDescription(
            'The Starbound server is already online (or booting up)!'
          ),
      STARBOUND_START_SUCCESS: () =>
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription('The Starbound server has been ${!'),
      STARBOUND_START_FAILURE: () =>
        new MessageEmbed()
          .setColor('RED')
          .setDescription('The Starbound server could not be started. :('),
      STARBOUND_STOP_SUCCESS: () =>
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription('The Starbound server has been stopped!'),
      STARBOUND_STop_FAILURE: message =>
        new MessageEmbed()
          .setColor('RED')
          .setDescription('The Starbound server could not be started. :('),
    }
  }

  async init() {
    await super.init()
  }
}
