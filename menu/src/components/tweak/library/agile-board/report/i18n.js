import {en as enGeneric} from '../generic/i18n'

export const en = {
  ...enGeneric,
  groupByField: {
    label: 'Group by this field'
  },
  messageFormat: {
    label: 'Per issue message format',
    description: 'Allowed placeholders: %id%, %link%, %group%, %summary%'
  },
  useForSingleIssue: {
    label: 'Use this hotkey if only one issue selected',
    left: 'Use',
    right: 'Do not use'
  },
  addNewlineAfterGroup: {
    label: 'Add new line after each group of issues',
    left: 'Add',
    right: 'Do not add'
  }
}

export default en
