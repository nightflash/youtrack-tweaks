import {en as enGeneric} from '../generic/i18n'

const fieldsEn = {
  conversions: {
    no: 'Show full name',
    letter: 'Show first letter only'
  },
  color: {
    inherit: 'Use field colors',
    ignore: 'Ignore color settings',
    auto: 'Auto-generated colors',
    generator: 'Tune color scheme changing this value from 10 to 32',
    opacity: 'Opacity of the filed. Use it to blur less important data'
  },
  placeholder: 'Field name',
  add: 'Add',
  update: 'Update'
}

export const en = {
  ...enGeneric,
  prependIssueId: {
    label: 'Prepend issue summary with issue id (S size only)',
    description: 'When S size is enabled card title is hidden. Copy id shortcut will work too',
    left: 'Yes',
    right: 'No'
  },
  showTagsInSmallModes: {
    label: 'Show tags for small cards',
    description: 'Show tags for S and M card sizes',
    left: 'Yes',
    right: 'No'
  },
  extendCardColorArea: {
    label: 'Extend card color area',
    description: 'Colorize card background like a side strip color. Incompatible with Dracula mode',
    left: 'Yes',
    right: 'No'
  },
  singleMode: {
    label: 'Fields configuration mode',
    left: 'Single',
    right: 'Separate for each card size'
  },
  sizeParams0: {
    label: 'S card fields',
    ...fieldsEn
  },
  sizeParams1: {
    label: 'M card fields',
    ...fieldsEn
  },
  sizeParams2: {
    label: 'L card fields',
    ...fieldsEn
  },
  sizeParams3: {
    label: 'XL card fields',
    ...fieldsEn
  },
  sizeParams: {
    label: 'Fields',
    ...fieldsEn
  }
}

export default en
