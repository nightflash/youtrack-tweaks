export const options = [
  {
    name: 'agile-board/card-fields',
    label: 'Agile Board Custom Fields',
    configParams: [
      {
        name: 'boardName',
        label: 'Board name',
        type: 'string'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'string'
      },
      {
        name: 'sizeParams0',
        label: 'S size card',
        type: 'string'
      },
      {
        name: 'sizeParams1',
        label: 'M size card',
        type: 'string'
      },
      {
        name: 'sizeParams2',
        label: 'L size card',
        type: 'string'
      },
      {
        name: 'sizeParams3',
        label: 'XL size card',
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
        label: 'Board name',
        type: 'string'
      },
      {
        name: 'sprintName',
        label: 'Sprint name',
        type: 'string'
      },
      {
        name: 'newIssueWatcher',
        label: 'New issue watcher',
        type: 'string'
      }
    ]
  }
];
