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
