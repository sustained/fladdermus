import { MessageEmbed } from 'discord.js'
import { EventStore } from 'klasa'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'
import { ExtendedMessage } from '@services/StarboundService'

export default class StarboundPlayerChatEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundPlayerChatEvent',
      enabled: true,
      event: 'chat',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName, chatColour, message }: ExtendedMessage) {
    const embed = new MessageEmbed().setColor(chatColour)

    if (discordName) {
      embed
        .setDescription(`${discordName} ${message}`)
        .setFooter(`Playing as ${playerName}.`)
    } else {
      embed
        .setDescription(`**<${playerName}>** ${message}`)
        .setFooter(`Not linked to Discord.`)
    }

    this.channel?.send(embed)
  }
}
