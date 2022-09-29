import { Component, OnInit } from '@angular/core';
import { DocumentModelBlockchain } from 'src/app/models/document.model';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'change-history',
  templateUrl: './change-history.component.html',
  styleUrls: ['./change-history.component.css']
})
export class ChangeHistoryComponent implements OnInit {
  page: number = 1;
  listDocHistory: DocumentModelBlockchain[] = [];
  listIdBlocks: [] = [];

  constructor(
    private endpoint$: EndpointsService
  ) { }

  ngOnInit(): void {
    this.listIdBlocks = JSON.parse(localStorage.getItem("history_doc"));
    this.getDocHistory();
    console.log("lista de id: ",this.listIdBlocks)
  }

  getDocHistory(){
    this.listIdBlocks.map(item => {
      this.endpoint$.getDataBlockchain(item).subscribe({
        next: (response) => {
          if (response !== null) {
            this.listDocHistory.push(response)
          }
        }
      })

    })
    console.log("R:",this.listDocHistory)
    this.listDocHistory.sort((a, b) => {
      if (b.date > a.date) { return 1; }
      if (b.date < a.date) { return -1; }
      return 0;
    })
  }
}
