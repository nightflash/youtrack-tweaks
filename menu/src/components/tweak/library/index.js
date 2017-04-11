import * as desktopNotifications from './agile-board/desktop-notifications/tweak'
import * as cardFields from './agile-board/card-fields/tweak'
import * as layout from './agile-board/layout/tweak'

const tweaksMap = new Map()
tweaksMap.set(desktopNotifications.type, desktopNotifications)
tweaksMap.set(cardFields.type, cardFields)
tweaksMap.set(layout.type, layout)

export default tweaksMap
