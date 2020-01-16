import { spawn } from 'child_process'
import { join, basename, dirname } from 'path'
import EventEmitter from 'events'
import { GUILDS } from '@constants/index'
import FladdermusClient from '@libraries/FladdermusClient'
import { GuildMember } from 'discord.js'
const { NODE_ENV, STARBOUND_SERVER_DIRECTORY } = process.env

if (!STARBOUND_SERVER_DIRECTORY) {
  throw new Error(
    'Required environmental variable STARBOUND_SERVER_EXECUTABLE not present!'
  )
}

interface ChatMessage {
  message: string
  timestamp: number
  chatColour?: string
  discordName?: GuildMember | string
}

interface ChatMessage {
  message: string
  playerName: string
}

interface PlayerConnectedMessage {
  accountName: string
  playerName: string
}

interface PlayerDisonnectedMessage {
  accountName: string
  reason?: string
}

export class ServerAlreadyRunningError extends Error {}
export class ServerNotYetRunningError extends Error {}

export default class StarboundService extends EventEmitter {
  basePath: string
  client: FladdermusClient
  players: object
  server: any
  _running: boolean
  chatStack: object[]

  constructor(client) {
    super()

    this.basePath = STARBOUND_SERVER_DIRECTORY
    if (basename(this.basePath) === 'starbound_server') {
      this.basePath = dirname(this.basePath)
    }

    this.client = client
    this.players = {}
    this.server = null
    this._running = false

    this.chatStack = []

    process.on('SIGINT', () => {
      if (this.isRunning()) {
        this.server.kill('SIGINT')
      }
      setTimeout(() => {
        process.exit()
      }, 1000)
    })
  }

  isRunning() {
    return this._running
  }

  /**
   * Spawn the Starbound server process.
   */
  startServer() {
    if (this.isRunning()) {
      throw new ServerAlreadyRunningError()
    }

    this.server = spawn(join(this.basePath, 'starbound_server'), {
      cwd: this.basePath,
    })

    this.server.stdout.on('data', data => {
      if (NODE_ENV === 'development') {
        // process.stdout.write(data.toString('utf8'))
      }

      this._parseLine(data.toString('utf8'))
    })

    this.server.stderr.on('data', data => {
      if (NODE_ENV === 'development') {
        // process.stdout.write(data.toString('utf8'))
      }

      this._parseLine(data)
    })

    this.server.on('close', code => {
      this.client.console.debug(`Starbound server exited with code ${code}.`)
    })

    this._running = true
  }

  /**
   * Terminate the Starbound server process.
   */
  stopServer() {
    if (!this.isRunning()) {
      return false
    }

    this.emit('shutdown')
    this.server.kill('SIGINT')
  }

  /**
   * Determine which Discord user a Starbound player corresponds to.
   *
   * @param {object} data An object containing either a playerName or an accountName, or both.
   */
  getUserForPlayer({ accountName, playerName }) {
    if (accountName) {
      return this.client.users.find(
        ({ settings }) => settings.get('starbound.accountName') === accountName
      )
    } else if (playerName) {
      return this.client.users.find(
        ({ settings }) => settings.get('starbound.playerName') === playerName
      )
    }
  }

  /**
   * Extend the parsed chat message with extra data.
   *
   * @param {object} message
   */
  extendPlayer(message): ChatMessage {
    const user = this.getUserForPlayer(message)
    const member = this.client.guilds.get(GUILDS.THE_POND).members.get(user?.id)

    return {
      ...message,
      timestamp: Date.now(),
      chatColour: user?.settings?.get('starbound.chatColour'),
      discordName: member ? member : user ? user.tag : null,
    }
  }

  _parseLine(data) {
    console.log(
      data
        .trim()
        .replace('\r', 'CR')
        .replace('\n', 'LF')
    )

    if (data.startsWith('[Info] Chat')) {
      const { groups: ChatMessage } = data
        .trim()
        .match(/^\[Info\] Chat: <(?<playerName>[\w]{1,16})> (?<message>.*)$/s)

      if (!groups.playerName || !groups.message) {
        return void console.debug('Unmatched played sent chat message?', data)
      }

      this.emit('chat', this.extendPlayer(groups))
      // if (this.chatStack.length) {
      //   if (
      //     this.chatStack[this.chatStack.length - 1].player === parsed.player
      //   ) {
      //     this.chatStack.push(chatMessage)
      //   } else {
      //     this.flushChats()
      //   }
      // } else {
      //   this.chatStack.push(chatMessage)
      // }

      // if (Date.now() - this.chatStack[0].timestamp > 10000) {
      //   this.flushChats()
      // }
    } else if (data.startsWith('[Info] UniverseServer: Logged in account')) {
      const { groups } = data
        .trim()
        .match(
          /^\[Info\] UniverseServer: Logged in account ''(?<accountName>[\w]{1,16})'' as player '(?<playerName>[\w]{1,16})' .*/s
        )

      console.log('!!!', data)

      if (!groups.playerName) {
        return void console.debug('Unmatched played logged in?', data)
      }

      this.emit('join', this.extendPlayer(groups))
    } else if (
      data.startsWith('[Info] Universe Server: Client') &&
      data.includes('disconnected for reason')
    ) {
      const { groups } = data
        .trim()
        .match(
          /^\[Info\] UniverseServer: Client '(?<playerName>[\w]{1,16})' <[\d]+> \(.*\) disconnected for reason:\s?(?<reason>.*)?/s
        )

      console.log('!!!', data)

      if (!groups.playerName) {
        return void console.debug('Unmatched played logged off?', data)
      }

      this.emit('part', this.extendPlayer(groups))
    } else if (
      data.startsWith(
        '[Info] UniverseServer: listening for incoming TCP connections'
      )
    ) {
      this.emit('ready')
    } else if (data.startsWith('[Info] Server shutdown gracefully')) {
      this.emit('shutdown')
    }
  }

  getOnlinePlayers() {}

  flushChats(chatMessage) {
    this.emit('chat', [...this.chatStack])
    this.chatStack = []
    if (chatMessage) {
      this.chatStack.push(chatMessage)
    }
  }

  // async queryServer() {
  //   const query = await gamedig.default.query({
  //     type: 'starbound',
  //     host: '127.0.0.1',
  //   })
  // }
}
