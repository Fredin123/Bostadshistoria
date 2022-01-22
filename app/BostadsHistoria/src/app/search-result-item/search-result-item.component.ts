import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent implements OnInit {
  @Input() streetItems: any | null = null;
  @ViewChild('mainImage') searchInputStreet: ElementRef | undefined;

  @ViewChild('fullDisplay') fullDisplay: ElementRef | undefined;

  itemDisplayColor = "white";
  itemData: any;
  streetName: string = "";
  streetMainImageSource: string = "";

  constructor() { 
    /*this.itemData = itemData;

    this.streetName = itemData.streetName as string;
    var img = document.createElement('img');
    img.src = 'data:image/jpeg;base64,' + btoa(itemData.images[0]);
    this.streetMainImage = img;*/
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void{
    //this.streetItems
    this.streetItems.forEach((item: any) => {
      //unescape
      item.description = unescape(item.description);
      item.county = unescape(item.county);
      item.streetName = unescape(item.streetName);
      item.price = unescape(item.price);//item.price.replaceAll("&nbsp;", " ");//unescape(item.price.replaceAll("&nbsp;", " "));
      item.price = item.price.replaceAll("&nbsp;", " ");
      console.log("Price: ",item.price);
      item.created_on = item.created_on.substring(0, item.created_on.indexOf("T"));
      
      item.images.forEach((image: any) => {
        image.base64 = "data:"+image.type.mime+";base64," + image.base64;
        //this.streetMainImageSource = "data:"+this.streetItems[0].images[0].type.mime+";base64," + this.streetItems[0].images[0].base64;
      });
    });
    //this.streetMainImageSource = "data:"+this.streetItems[0].images[0].type.mime+";base64," + this.streetItems[0].images[0].base64;
  }


  onItemClick(item: any): void {
    if(this.fullDisplay?.nativeElement.firstChild){
      this.itemDisplayColor = "white";
      while(this.fullDisplay?.nativeElement.firstChild){
        this.fullDisplay?.nativeElement.removeChild(this.fullDisplay?.nativeElement.firstChild);
      }
    }else{
      this.itemDisplayColor = "yellow";
      item.images.forEach(this.appendDisplayImage.bind(this));
    }
  }

  appendDisplayImage(image: any){
    let newImage = document.createElement("img") as HTMLImageElement;
    newImage.style.width = "45vw";
    newImage.style.margin = "16px";
    newImage.style.boxShadow = "box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;";
    newImage.src = image.base64;
    this.fullDisplay?.nativeElement.appendChild(newImage);
  }



}
