import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-tweak',
  templateUrl: './tweak.component.html',
  styleUrls: ['./tweak.component.css']
})
export class TweakComponent implements OnInit {
  focusedParam = null;

  @Input()
  data = {
    url: '*'
  };

  @Input()
  configParams = [];

  constructor() {
  }

  ngOnInit() {
  }

}
