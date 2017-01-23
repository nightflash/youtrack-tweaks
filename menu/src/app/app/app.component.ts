import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'YouTrack Tweaks!';
  value = 'text';

  onInput = ($event) => {
    console.log($event);
    // this.value = val;
  };
}
