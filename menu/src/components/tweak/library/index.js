import * as desktopNotifications from './agile-board/desktop-notifications/tweak'
import * as cardFields from './agile-board/card-fields/tweak'

const tweaksMap = new Map()
tweaksMap.set(desktopNotifications.type, desktopNotifications)
tweaksMap.set(cardFields.type, cardFields)

export default tweaksMap
