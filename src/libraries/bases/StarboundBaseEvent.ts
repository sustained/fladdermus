import { Event, util } from 'klasa'
import { GUILDS } from '@constants/index'
import { GuildChannel } from 'discord.js'

export default abstract class StarboundBaseEvent extends Event {
  channel: GuildChannel

  async init() {
    const guild = this.client.guilds.get(GUILDS.THE_POND)
    this.channel = guild.channels.find(channel => channel.name === 'starbound')
  }
}
