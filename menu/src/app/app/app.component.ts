import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'YouTrack Tweaks!';

  tweaks = [];

  addEmptyTweak = () => {
    this.tweaks.push({
      url: '*wdwdwd'
    });
  };

  removeTweak = tweak => {
    const index = this.tweaks.indexOf(tweak);
    this.tweaks.splice(index, 1);
  };
}
