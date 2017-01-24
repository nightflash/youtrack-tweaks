import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-tweak',
  templateUrl: './tweak.component.html',
  styleUrls: ['./tweak.component.css']
})
export class TweakComponent implements OnInit {
  @Input()
  data = {};

  @Input()
  url = "*";

  constructor() {
  }

  ngOnInit() {
  }

}
