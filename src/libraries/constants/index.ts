import { resolve, join } from 'path'

const BASE_PATH = resolve(__dirname, '../../../')

export const GUILDS = {
  THE_POND: '590826948125786113',
  VUE_LAND_BOT_TESTING: '617839535727968282',
  VUE_UNDERGROUND: '646850343388315693',
}

export const PATHS = {
  BASE: BASE_PATH,
  LOGS: join(BASE_PATH, 'logs/'),
  IMAGES: join(BASE_PATH, 'assets/images/'),
}
