import StarboundService from '@services/StarboundService'
import { GUILDS } from '@constants/index'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class extends StarboundBaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'StarboundReadyEvent',
      enabled: true,
      event: 'ready',
      emitter: 'starbound',
      once: false,
    })
  }

  run() {
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(
        'The server booted up successfully and is now accepting connections.'
      )

    this.channel?.send(embed)
  }
}
