import { EventEmitter } from 'events'
import { PieceOptions } from 'klasa'
import FladdermusClient from '../src/libraries/FladdermusClient'

// type ValueOf<T> = T[keyof T]
// type FilterKeyInstances<O, T> = ValueOf<
//   {
//     [K in keyof O]: O[K] extends T ? K : never
//   }
// >

// declare module 'klasa' {
//   export interface EventOptions extends PieceOptions {
//     emitter?:
//       | NodeJS.EventEmitter
//       | FilterKeyInstances<FladdermusClient, NodeJS.EventEmitter>
//     event?: string
//     once?: boolean
//   }
// }
