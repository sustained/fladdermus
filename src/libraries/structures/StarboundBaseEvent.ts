import { Event, util } from 'klasa'
import { GUILDS } from '../../libraries/constants/index'
import { GuildChannel, TextChannel } from 'discord.js'

export default abstract class StarboundBaseEvent extends Event {
  channel?: TextChannel

  // TODO: At the moment we are hard-coding the guild and the channel, but we
  // should/could change that - not that we plan to allow this on any other
  // guilds... but hey?
  async init() {
    this.channel = this.client.guilds
      .get(GUILDS.THE_POND)
      .channels.find(
        channel => channel.name === 'starbound' && channel.type === 'text'
      ) as TextChannel
  }
}
