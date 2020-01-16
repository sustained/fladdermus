import { MessageEmbed } from 'discord.js'
import { EventStore } from 'klasa'
import StarboundBaseEvent from '@structures/StarboundBaseEvent'
import { Player } from '@services/StarboundService'

export default class StarboundPlayerJoinEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundPlayerJoinEvent',
      enabled: true,
      event: 'join',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName }: Player) {
    const embed = new MessageEmbed().setColor('GREEN')

    if (discordName) {
      embed
        .setDescription(`${discordName} joined the server.`)
        .setFooter(`Playing as ${playerName}.`)
    } else {
      embed
        .setDescription(`**<${playerName}>** joined the server.`)
        .setFooter(`Not linked to Discord.`)
    }

    this.channel?.send(embed)
  }
}
