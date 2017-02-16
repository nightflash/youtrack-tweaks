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
        type: 'text'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'text'
      },
      {
        name: 'sizeParams0',
        label: 'S size fields',
        example: fieldExample,
        type: 'text'
      },
      {
        name: 'sizeParams1',
        label: 'M size fields',
        example: fieldExample,
        type: 'text'
      },
      {
        name: 'sizeParams2',
        label: 'L size fields',
        example: fieldExample,
        type: 'text'
      },
      {
        name: 'sizeParams3',
        label: 'XL size fields',
        example: fieldExample,
        type: 'text'
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
        type: 'text'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'text'
      },
      {
        name: 'newIssueWatcher',
        label: 'Notify condition',
        example: `Example: Type: Bug
                  Syntax: FieldName:FieldValue
                  Logic: you can use "," as AND and new line as OR`,
        type: 'text'
      }
    ]
  }
];
