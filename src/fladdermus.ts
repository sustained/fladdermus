import 'module-alias/register'
import FladdermusClient from '@libraries/FladdermusClient'
new FladdermusClient().login(process.env.TOKEN)
