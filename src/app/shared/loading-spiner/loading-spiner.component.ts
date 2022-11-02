import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spiner',
  template:
    `<div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`,
  styleUrls: ['./loading-spiner.component.css']
})
export class LoadingSpinerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
