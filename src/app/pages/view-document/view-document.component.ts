import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-viewuniquedocument',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  docId: string;

  // doc="https://docs.google.com/spreadsheets/d/1LEa9PtJTPKNFSDSAA0Rn4g40wksM3jt2/edit?usp=sharing&ouid=108098759828941113844&rtpof=true&sd=true" //drive
  // doc="https://firebasestorage.googleapis.com/v0/b/appcards-307a5.appspot.com/o/Modelo-factura.xlsx?alt=media&token=1ffc1543-da82-4a9f-a53e-6afd1381b488" // storage excel
  //doc="https://firebasestorage.googleapis.com/v0/b/appcards-307a5.appspot.com/o/xd.pptx?alt=media&token=81705afe-92d1-4f4d-a8c9-cac242df779c" // storage powerpoint

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.docId = params['docId'];
      console.log(this.docId)
    })

  }

}
