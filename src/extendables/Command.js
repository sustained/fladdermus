import { Extendable, Command } from 'klasa'
import * as constants from '@constants/index'

/**
 * Expose constants to commands.
 */
export default class extends Extendable {
  constructor(...args) {
    super(...args, { appliesTo: [Command] })
  }

  get constants() {
    return constants
  }
}
