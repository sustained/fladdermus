import StarboundService from '@services/StarboundService'
import { GUILDS } from '@constants/index'
import { MessageEmbed } from 'discord.js'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class extends StarboundBaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'StarboundShutdownEvent',
      enabled: true,
      event: 'shutdown',
      emitter: 'starbound',
      once: false,
    })
  }

  run() {
    const embed = new MessageEmbed()
      .setColor('RED')
      .setDescription(
        'Server shutting down NOW! All players will be disconnected.'
      )

    this.channel?.send(embed)
  }
}
