import {en as enGeneric} from '../generic/i18n'

export const en = {
  ...enGeneric,
  groupByField: {
    label: 'Group by this field'
  },
  groupAsTitle: {
    label: 'Show group value as a title for each issues group',
    left: 'Yes',
    right: 'No'
  },
  addNewlineAfterGroup: {
    label: 'Add new line after each group of issues',
    left: 'Yes',
    right: 'No'
  },
  messageFormat: {
    label: 'Per issue message format',
    description: 'Allowed placeholders: %id%, %link%, %group%, %summary%'
  },
  useForSingleIssue: {
    label: 'Use this shortcut if only one issue selected',
    left: 'Yes',
    right: 'No'
  }
}

export default en
