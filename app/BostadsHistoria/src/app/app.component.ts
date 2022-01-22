import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { SearchResultComponent } from './search-result/search-result.component';
import dataRetriever from './repository/dataRetriever';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('searchStreet') searchInputStreet: ElementRef | undefined;
  hideSpinner = true;
  title = 'BostadsHistoria';
  currentSearchResult = {};

  countySelecter = new FormControl();

  countyList: string[] = ["Blekinge län",
  "Dalarnas län",
  "Gotlands län",
  "Gävleborgs län",
  "Hallands län",
  "Jämtlands län",
  "Jönköpings län",
  "Kalmar län",
  "Kronobergs län",
  "Norrbottens län",
  "Skåne län",
  "Stockholms län",
  "Södermanlands län",
  "Uppsala län",
  "Värmlands län",
  "Västerbottens län",
  "Västernorrlands län",
  "Västmanlands län",
  "Västra Götalands län",
  "Örebro län",
  "Östergötlands län"];

  clickButton = (event: MouseEvent) => {
    let street: string = this.searchInputStreet?.nativeElement.value;
    let county: string = this.countySelecter.value;

    if(street.length <= 2){
      alert("Gatunamn är för kort");
    }else{
      this.hideSpinner = false;
      dataRetriever.getStreetData(street, county)
      .then(this.resolveSearchResultData.bind(this));
      //this.currentSearchResult = this.searchInputStreet?.nativeElement.value;
    }
  }

  resolveSearchResultData = (data: any) => {
    this.currentSearchResult = data;
    this.hideSpinner = true;
  }

}



