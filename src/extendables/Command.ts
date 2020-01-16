import { Extendable, Command, ExtendableStore } from 'klasa'
import * as constants from '@constants/index'

/**
 * Expose constants to commands.
 */
export default class extends Extendable {
  constructor(store: ExtendableStore, file: string[], directory: string) {
    super(store, file, directory, { appliesTo: [Command] })
  }

  get constants() {
    return constants
  }
}
