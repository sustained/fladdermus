import { EventStore } from 'klasa'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@structures/StarboundBaseEvent'
import { Player } from '@services/StarboundService'

export default class StarboundPlayerPartEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundPlayerPartEvent',
      enabled: true,
      event: 'part',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName }: Player) {
    const embed = new MessageEmbed().setColor('RED')

    if (discordName) {
      embed
        .setDescription(`${discordName} (${playerName}) left the server.`)
        .setFooter(`Playing as ${playerName}.`)
    } else {
      embed
        .setDescription(`**<${playerName}>** left the server.`)
        .setFooter(`Not linked to Discord.`)
    }

    this.channel?.send(embed)
  }
}
