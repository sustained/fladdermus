import StarboundService from '@services/StarboundService'
import { GUILDS } from '@constants/index'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class extends StarboundBaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'StarboundJoinEvent',
      enabled: true,
      event: 'join',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName }) {
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
