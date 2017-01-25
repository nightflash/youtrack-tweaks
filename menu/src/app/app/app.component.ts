import {Component, OnInit, NgZone} from '@angular/core';

const tweakOptions = [
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
        name: 'sizeParams2',
        label: 'M size card',
        type: 'string'
      },
      {
        name: 'sizeParams3',
        label: 'L size card',
        type: 'string'
      },
      {
        name: 'sizeParams4',
        label: 'XL size card',
        type: 'string'
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  title = 'YouTrack Tweaks!';

  tweaks = [];

  tweakOptions = [];
  tweakOptionsMap = {};
  connection = null;

  constructor(private zone: NgZone) {
    const connection = this.connection = chrome.runtime.connect({
      name: "ytTweaks"
    });
    connection.onMessage.addListener(function(msg) {
      console.log("message recieved: " + msg);
    });
  }

  loadOptions() {
    this.tweakOptions = tweakOptions;
    this.tweakOptionsMap = {};
    tweakOptions.forEach(t => {
      this.tweakOptionsMap[t.name] = t;
    })
  }

  sync() {
    chrome.storage && chrome.storage.sync.get('tweaks', data => {
      console.log('tweaks are fetched', data['tweaks']);
      this.zone.run(() => {
        this.tweaks = data['tweaks'] || [];
      });
    });
  }

  ngOnInit() {
    this.loadOptions();
    this.sync();
  }

  addEmptyTweak = (tweakType) => {
    const option = this.tweakOptionsMap[tweakType];

    const newTweak = {
      url: '',
      type: tweakType,
      config: {}
    };

    option.configParams.forEach(p => {
      let value = '';

      switch(p.type) {
        case 'string':
          value = p.value || value;
          break;
      }

      newTweak.config[p.name] = value;
    });

    this.tweaks.push(newTweak);
  };

  getConfigParams(tweakType) {
    return this.tweakOptionsMap[tweakType].configParams;
  }

  removeTweak = tweak => {
    const index = this.tweaks.indexOf(tweak);
    this.tweaks.splice(index, 1);
  };

  saveTweaks = () => {
    chrome.storage && chrome.storage.sync.set({'tweaks': this.tweaks}, () => {
      console.log('tweaks are saved');
      this.connection.postMessage({
        tweaks: this.tweaks
      });
    });
  };

  reload = () => {
    this.sync();
  };
}
