import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import dataRetriever from '../repository/dataRetriever';
import streetDataContainer from '../streetDataContainer';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @ViewChild('container') searchInputStreet: ElementRef | undefined;
  @Input() inData: any | null = null;

  myItems: any[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void{
    if(this.inData != null && this.inData.data != undefined){
      this.myItems.length = 0;
      this.inData.data.forEach((item: any) => {
        this.myItems.push(item);
      });
      //let items = JSON.parse(this.in);
      /*this.myItems.length = 0;
      items.forEach((item: any) => {
        let streetItem: streetDataContainer = new streetDataContainer(); 
        this.myItems.push(streetItem);
      });*/
    }
  }

}
