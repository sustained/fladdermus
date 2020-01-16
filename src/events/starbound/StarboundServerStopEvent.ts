import { MessageEmbed } from 'discord.js'
import { EventStore } from 'klasa'
import StarboundBaseEvent from '@structures/StarboundBaseEvent'

export default class StarboundServerStopEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundServerStopEvent',
      enabled: true,
      event: 'stop',
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
