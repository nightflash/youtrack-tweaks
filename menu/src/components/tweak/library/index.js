import * as desktopNotifications from './agile-board/desktop-notifications/tweak'
import * as cardFields from './agile-board/card-fields/tweak'
import * as layout from './agile-board/layout/tweak'
import * as report from './agile-board/report/tweak'
import * as issueScreen from './issue-screen/general/tweak'

const tweaksMap = new Map()
tweaksMap.set(desktopNotifications.type, desktopNotifications)
tweaksMap.set(cardFields.type, cardFields)
tweaksMap.set(layout.type, layout)
tweaksMap.set(report.type, report)
tweaksMap.set(issueScreen.type, issueScreen)

export default tweaksMap
