const fieldsEn = {
  conversions: {
    no: 'Keep field name',
    letter: 'Show only first letter'
  },
  ignoreColors: 'Ignore colors',
  placeholder: 'Field name',
  add: 'Add'
}

export const en = {
  boardName: {
    label: 'Board Names',
    add: 'Add',
    placeholder: 'Any board if empty',
    hint: 'You can specify one or several agile board names to filter tweak behaviour'
  },
  sprintName: {
    label: 'Sprint Names',
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
