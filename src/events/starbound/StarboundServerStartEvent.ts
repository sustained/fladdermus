import { MessageEmbed } from 'discord.js'
import { EventStore } from 'klasa'
import StarboundService from '@services/StarboundService'
import StarboundBaseEvent from '@libraries/bases/StarboundBaseEvent'

export default class StarboundServerStartEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundServerStartEvent',
      enabled: true,
      event: 'start',
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
