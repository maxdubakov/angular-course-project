import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() tabChange = new EventEmitter<string>();
  collapsed = true;
  expandManage = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(feature: string) {
    this.tabChange.emit(feature);
  }

}
