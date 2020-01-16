import { CommandStore, CommandOptions } from 'klasa'
import FladdermusClient from '@libraries/FladdermusClient'
import FladdermusCommand from '@bases/FladdermusCommand'

// declare module 'klasa' {
//   interface CommandOptions {
//     exclusive?: ExclusiveCommandOptions
//   }
// }

export default class ExclusiveCommand extends FladdermusCommand {
  exclusive: ExclusiveInterface

  constructor(
    client: FladdermusClient,
    store: CommandStore,
    file: string[],
    directory: string,
    options?: ExclusiveCommandOptions
  ) {
    super(client, store, file, directory, options)

    if (!options.exclusive) {
      options.exclusive = {
        guilds: [],
        subcommands: [],
      }
    }

    this.exclusive = options.exclusive
  }
}

export interface ExclusiveInterface {
  guilds: string[]
  subcommands: string[]
}

export interface ExclusiveCommandOptions extends CommandOptions {
  exclusive: ExclusiveInterface
}
