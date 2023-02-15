import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  inputValue: string = '';
  constructor() { }
  onInput(e:any){}
  ngOnInit(): void {
  }
  
}
