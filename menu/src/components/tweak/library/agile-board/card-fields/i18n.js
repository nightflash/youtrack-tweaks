const fieldsEn = {
  conversions: {
    no: 'Show full name',
    letter: 'Show first letter only'
  },
  color: {
    inherit: 'Use field colors',
    ignore: 'Ignore color settings',
    auto: 'Auto-generated colors'
  },
  placeholder: 'Field name',
  add: 'Add',
  update: 'Update'
}

export const en = {
  title: {
    label: 'Tweak title'
  },
  url: {
    label: 'Youtrack instance url'
  },
  boardName: {
    label: 'Board names',
    add: 'Add',
    placeholder: 'Any board if empty',
    hint: 'You can specify one or several agile board names to filter tweak behaviour'
  },
  sprintName: {
    label: 'Sprint names',
    placeholder: 'Any sprint if empty',
    add: 'Add'
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
