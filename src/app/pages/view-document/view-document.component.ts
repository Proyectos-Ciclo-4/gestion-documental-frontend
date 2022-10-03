import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-viewuniquedocument',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  doc: string;
  name_doc = sessionStorage.getItem('name_document');
  showModalLoaderGeneric = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.doc = sessionStorage.getItem('docurl')
  }

}
