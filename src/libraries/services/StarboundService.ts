import { spawn } from 'child_process'
import { join, basename, dirname } from 'path'
import { EventEmitter } from 'events'
import { GUILDS } from '../constants/index'
import FladdermusClient from '../FladdermusClient'
import { GuildMember, User, Collection } from 'discord.js'
import { ChildProcessWithoutNullStreams } from 'child_process'

const { NODE_ENV, STARBOUND_SERVER_DIRECTORY } = process.env
const FLUSH_MESSAGES_AFTER = 1000 * 7

const CHAT_REGEXP = /^\[Info\] Chat: <(?<playerName>[\w]{1,16})> (?<message>.*)$/s
const JOIN_REGEXP = /^\[Info\] UniverseServer: Logged in account ''(?<accountName>[\w]{1,16})'' as player '(?<playerName>[\w]{1,16})' .*/s
const PART_REGEXP = /^\[Info\] UniverseServer: Client '(?<accountName>[\w]{1,16})' <[\d]+> \(.*\) disconnected for reason:\s?(?<reason>.*)?/s

/**
 * Represents a (parsed) chat messsage.
 */
interface PlayerChatMessage {
  message: string
  playerName: string
}

/**
 * Represents a (parsed) join/connect message.
 */
interface PlayerJoinMessage {
  accountName: string
  playerName: string
}

/**
 * Represents a (parsed) part/disconnect message.
 */
interface PlayerPartMessage {
  accountName: string
  reason?: string
}

type PlayerMessage = PlayerChatMessage | PlayerJoinMessage | PlayerPartMessage

/**
 * Represents a player which has been extended with Discord-specific data.
 */
// TODO: Figure out how to make EITHER playerName OR accountName optional but not both.
export interface Player {
  chatColour: string
  discordName?: GuildMember | string // Can be either a GuildMember or a user tag.
  playerName?: string
  accountName?: string
}

/**
 * Represents a chat message which has been extended with Discord-specific data.
 */
export interface ExtendedMessage extends Player {
  message: string
  timestamp: number
}

enum MessageTypes {
  CHAT = 'chat',
  JOIN = 'join',
  PART = 'part',
}

export class ServerAlreadyRunningError extends Error {}
export class ServerNotYetRunningError extends Error {}

export default class StarboundService extends EventEmitter {
  basePath: string
  client: FladdermusClient
  players: Collection<string, Player>
  server: ChildProcessWithoutNullStreams
  chatQueue: ExtendedMessage[]

  private running: boolean

  constructor(client: FladdermusClient) {
    super()

    // TODO: Make it so everything still works even if the env var isn't set.
    if (!STARBOUND_SERVER_DIRECTORY) {
      throw new Error(
        'Required environmental variable STARBOUND_SERVER_EXECUTABLE not present!'
      )
    }

    this.basePath = STARBOUND_SERVER_DIRECTORY

    // NOTE: Account for if the server binary was included in the path.
    if (basename(this.basePath) === 'starbound_server') {
      this.basePath = dirname(this.basePath)
    }

    this.client = client
    this.server = null
    this.players = new Collection()
    this.running = false
    this.chatQueue = []

    process.on('SIGINT', () => {
      if (this.isRunning()) {
        this.server.once('exit', () => {
          process.exit()
        })
        this.server.kill('SIGINT') // NOTE: Should exit gracefully because ^c does?
      } else {
        process.exit()
      }
    })
  }

  /**
   * Is the Starbound server online?
   */
  isRunning() {
    return this.running
  }

  /**
   * Spawn the Starbound server process, if applicable.
   */
  // TODO: Run server in another process, we should probably use PM2 which can
  // communicate with other processes, then, if the bot dies, or is otherwise
  // restarted, the server will stay up.
  startServer() {
    if (this.isRunning()) {
      throw new ServerAlreadyRunningError()
    }

    this.server = spawn(join(this.basePath, 'starbound_server'), {
      cwd: this.basePath,
    })

    this.server.stdout.on('data', (data: Buffer) => {
      if (NODE_ENV === 'development') {
        process.stdout.write(data.toString('utf8'))
      }

      this.parseLine(data.toString('utf8'))
    })

    this.server.stderr.on('data', (data: string) => {
      if (NODE_ENV === 'development') {
        process.stdout.write(data)
      }
    })

    this.server.on('close', (code: number) => {
      if (NODE_ENV === 'development') {
        process.stdout.write(`Starbound server exited with code ${code}.`)
      }
    })

    this.running = true
  }

  /**
   * Terminate the Starbound server process, if applicable.
   */
  stopServer() {
    if (!this.isRunning()) {
      return false
    }

    this.server.kill('SIGINT') // NOTE: Should exit gracefully because ^c does?
  }

  /**
   * Determine which Discord user a Starbound player corresponds to, if any.
   *
   * @param {PlayerMessage} message An object containing either a playerName or an accountName, or both.
   */
  getUserForPlayer(message: PlayerMessage): User | undefined {
    if ('accountName' in message) {
      return this.client.users.find(
        ({ settings }) =>
          settings.get('starbound.accountName') === message.accountName
      )
    } else if ('playerName' in message) {
      return this.client.users.find(
        ({ settings }) =>
          settings.get('starbound.playerName') === message.playerName
      )
    }
  }

  /**
   * Extend the parsed message (PlayerJoinMessage) with Discord-specific data.
   */
  extendPlayer(message: PlayerJoinMessage): Player {
    const user = this.getUserForPlayer(message)
    const member = this.client.guilds.get(GUILDS.THE_POND).members.get(user?.id)

    return {
      ...message,
      chatColour: user?.settings?.get('starbound.chatColour') as string,
      discordName: member ? member : user ? user.tag : null,
    }
  }

  /**
   * Extend a chat message (PlayerChatMessage) with the extended player data we
   * added when the player joined
   *
   * @see extendPlayer
   * @see handleMessage
   */
  extendChatMessage(message: PlayerChatMessage): ExtendedMessage {
    const playerData = this.getPlayerByPlayerName(message.playerName)
    return {
      ...playerData,
      message: message.message,
      timestamp: Date.now(),
    }
  }

  /**
   * "Parse" (AKA ugly RegRxps) a line from starbound_server's stdout logs.
   */
  private parseLine(data: string) {
    if (data.startsWith('[Info] Chat')) {
      this.parseChatMessage(data)
    } else if (data.startsWith('[Info] UniverseServer: Logged in account')) {
      this.parseJoinMessage(data)
    } else if (
      data.startsWith('[Info] Universe Server: Client') &&
      data.includes('disconnected for reason')
    ) {
      this.parsePartMessage(data)
    } else if (
      data.startsWith(
        '[Info] UniverseServer: listening for incoming TCP connections'
      )
    ) {
      if (this.getClientSetting<string[]>(`enabledEvents`).includes('start')) {
        this.emit('start')
      }
    } else if (data.startsWith('[Info] Server shutdown gracefully')) {
      if (this.getClientSetting<string[]>(`enabledEvents`).includes('stop')) {
        this.emit('stop')
      }
    }
  }

  /**
   * Return a Starbound-related client setting.
   */
  getClientSetting<T>(path): T {
    return (this.client.settings.get(`starbound.${path}`) as unknown) as T
  }

  /**
   * Handle a message.
   */
  private handleMessage(type: MessageTypes, message: PlayerMessage) {
    let extended: ExtendedMessage | Player

    switch (type) {
      case MessageTypes.JOIN:
        extended = this.registerPlayer(message as PlayerJoinMessage)
        break

      case MessageTypes.CHAT:
        extended = this.extendChatMessage(message as PlayerChatMessage)
        if (this.getClientSetting<boolean>(`queueMessages`)) {
          return this.enqueueChat(extended as ExtendedMessage)
        }
        break

      case MessageTypes.PART:
        extended = this.unregisterPlayer(message as PlayerPartMessage)
        break
    }

    if (this.getClientSetting<string[]>(`enabledEvents`).includes(type)) {
      this.emit(type, extended)
    }
  }

  /**
   * Parse a chat message.
   */
  private parseChatMessage(data: string) {
    const parsed = this.extractMessageData<PlayerChatMessage>(data, CHAT_REGEXP)

    if (!parsed.playerName || !parsed.message) {
      return console.warn(
        'Unparseable chat message (this should never happen).',
        data
      )
    }

    this.handleMessage(MessageTypes.CHAT, parsed)
  }

  /**
   * Parse a join/connect message.
   */
  private parseJoinMessage(data: string) {
    const parsed = this.extractMessageData<PlayerJoinMessage>(data, JOIN_REGEXP)

    if (!parsed.playerName) {
      return console.warn(
        'Unparseable join message (this should never happen).',
        data
      )
    }

    this.handleMessage(MessageTypes.JOIN, parsed)
  }

  /**
   * Parse a part/disconnect message.
   */
  parsePartMessage(data: string) {
    const parsed = this.extractMessageData<PlayerPartMessage>(data, PART_REGEXP)

    if (!parsed.accountName) {
      return console.warn(
        'Unparseable part message (this should never happen).',
        data
      )
    }

    this.handleMessage(MessageTypes.PART, parsed)
  }

  /**
   * Register a player as being online.
   */
  registerPlayer(message: PlayerJoinMessage): Player {
    const extended = this.extendPlayer(message)
    this.players.set(message.accountName, extended)
    return extended
  }

  /**
   * Register a player as being offline.
   */
  unregisterPlayer(message: PlayerPartMessage): Player {
    const extended = { ...this.players.get(message.accountName) }
    this.players.delete(message.accountName)
    return extended
  }

  /**
   * Return all online players.
   */
  getOnlinePlayers(): Map<string, Player> {
    return this.players
  }

  /**
   * Return a player by player name.
   */
  getPlayerByPlayerName(name: string): Player {
    return this.players.find(player => player.playerName === name)
  }

  /**
   * Return a player by account name.
   */
  getPlayerByAccountName(name: string): Player {
    return this.players.get(name)
  }

  /**
   * Queue up sequential messages from a specific player, up until which point that
   * either another user sends a message, or the queue has existed for some time.
   */
  // NOTE: Untested.
  private enqueueChat(message: ExtendedMessage) {
    if (this.chatQueue.length) {
      const firstMessage = this.chatQueue[0]
      const previousMessage = this.chatQueue[this.chatQueue.length - 1]

      if (previousMessage.playerName === message.playerName) {
        this.chatQueue.push(message)
      } else {
        this.flushChatQueue() // A new player is chatting, flush the previous queue.
      }

      if (Date.now() - firstMessage.timestamp > FLUSH_MESSAGES_AFTER) {
        this.flushChatQueue()
      }
    } else {
      this.chatQueue.push(message)
    }
  }

  /**
   * Flush queued messages.
   */
  flushChatQueue(message?: ExtendedMessage) {
    if (this.getClientSetting<string[]>(`enabledEvents`).includes('chat')) {
      this.emit(
        'chat',
        this.chatQueue.length === 1 ? this.chatQueue[0] : this.chatQueue
      )
    }

    this.chatQueue = []

    if (message) {
      this.chatQueue.push(message)
    }
  }

  /**
   * Extract the data we care about for the given unparsed string + regexp.
   */
  private extractMessageData<T>(data: string, regexp: RegExp): T | undefined {
    const match = data.trim().match(regexp)
    if (match) {
      return (match.groups as unknown) as T
    }
  }
}
