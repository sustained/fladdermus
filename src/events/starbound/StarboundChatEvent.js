import StarboundService from '@services/StarboundService'
import { GUILDS } from '@constants/index'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class extends StarboundBaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'StarboundChatEvent',
      enabled: true,
      event: 'chat',
      emitter: 'starbound',
      once: false,
    })
  }

  run({ discordName, playerName, chatColour, message }) {
    const embed = new MessageEmbed().setColor(chatColour)

    if (discordName) {
      embed.setDescription(`${discordName} ${message}`).setFooter(`Playing as ${playerName}.`)
    } else {
      embed.setDescription(`**<${playerName}>** ${message}`).setFooter(`Not linked to Discord.`)
    }

    this.channel?.send(embed)
  }
}
