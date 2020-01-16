import { Command } from 'klasa'
import FladdermusClient from '@libraries/FladdermusClient'

export default class FladdermusCommand extends Command {
  client: FladdermusClient
}
