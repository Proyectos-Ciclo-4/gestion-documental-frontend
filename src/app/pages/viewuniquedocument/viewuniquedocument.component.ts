import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewuniquedocument',
  templateUrl: './viewuniquedocument.component.html',
  styleUrls: ['./viewuniquedocument.component.css']
})
export class ViewuniquedocumentComponent implements OnInit {

  doc="https://docs.google.com/spreadsheets/d/1LEa9PtJTPKNFSDSAA0Rn4g40wksM3jt2/edit?usp=sharing&ouid=108098759828941113844&rtpof=true&sd=true"

  constructor() { }

  ngOnInit(): void {
  }

}
