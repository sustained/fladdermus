import { CommandStore, CommandOptions, util } from 'klasa'
import FladdermusCommand from '@structures/FladdermusCommand'

// declare module 'klasa' {
//   interface CommandOptions {
//     exclusive?: ExclusiveCommandOptions
//   }
// }

export interface ExclusiveOptions {
  guilds: string[]
  subcommands?: string[]
}

export interface ExclusiveCommandOptions extends CommandOptions {
  exclusive: ExclusiveOptions
}

export default class ExclusiveCommand extends FladdermusCommand {
  exclusive: ExclusiveOptions

  constructor(
    store: CommandStore,
    file: string[],
    directory: string,
    options?: ExclusiveCommandOptions
  ) {
    super(store, file, directory, options)

    this.exclusive = util.mergeDefault(
      {
        guilds: [],
        subcommands: [],
      },
      options.exclusive
    )
  }
}
