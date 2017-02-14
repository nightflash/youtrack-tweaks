const fieldExample = `Example: Subsystems:letter, Type
                      Syntax: FieldName<string>[:DisplayType<enum>[:IgnoreColors<any>]]
                      DisplayTypes: full, letter`;

export const options = [
  {
    name: 'agile-board/card-fields',
    label: 'Agile Board Custom Fields',
    configParams: [
      {
        name: 'boardName',
        label: 'Agile board name',
        type: 'string'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'string'
      },
      {
        name: 'sizeParams0',
        label: 'S size fields',
        example: fieldExample,
        type: 'string'
      },
      {
        name: 'sizeParams1',
        label: 'M size fields',
        example: fieldExample,
        type: 'string'
      },
      {
        name: 'sizeParams2',
        label: 'L size fields',
        example: fieldExample,
        type: 'string'
      },
      {
        name: 'sizeParams3',
        label: 'XL size fields',
        example: fieldExample,
        type: 'string'
      }
    ]
  },
  {
    name: 'agile-board/desktop-notifications',
    label: 'Agile Board Notifications',
    configParams: [
      {
        name: 'boardName',
        label: 'Agile board name',
        type: 'string'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'string'
      },
      {
        name: 'newIssueWatcher',
        label: 'Notify condition',
        example: `Example: Type: Bug
                  Syntax: FieldName:FieldValue
                  Logic: you can use "," as AND and ";" as OR`,
        type: 'string'
      }
    ]
  }
];
