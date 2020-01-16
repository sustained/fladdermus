import StarboundService from '@services/StarboundService'
import { GUILDS } from '@constants/index'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class extends StarboundBaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'StarboundPartEvent',
      enabled: true,
      event: 'part',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName }) {
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
