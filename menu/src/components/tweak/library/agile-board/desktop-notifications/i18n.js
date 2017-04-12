import {en as enGeneric} from '../generic/i18n'

export const en = {
  ...enGeneric,
  message: {
    label: 'Additional message',
    description: 'Displayed on the notifications below issue summary. You can use these placeholders: %boardName% %sprintName% %projectName% %reporterName%'
  },
  ttl: {
    label: 'Notification TTL (ms)',
    description: 'Empty for infinite notifications'
  },
  icon: {
    label: 'Custom icon',
    description: 'http://any.url'
  },
  comparingMode: {
    label: 'Conditions comparing mode',
    left: 'Soft',
    right: 'Strict'
  },
  conditions: {
    label: 'Notification conditions (interpreted as AND)',
    add: 'Add',
    fieldName: 'Field name',
    fieldValue: 'Expected field value'
  }
}

export default en
