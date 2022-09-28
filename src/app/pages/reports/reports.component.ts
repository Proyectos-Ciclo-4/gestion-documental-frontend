import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentModelQuery, DocumentWithDownloads } from 'src/app/models/document.model';
import { DownloadModel } from 'src/app/models/download.model';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { ControlSesion } from 'src/app/utils/controlSesion';
import * as XLSX from 'xlsx';


@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  repetidos: any = {};
  page: number = 1;
  reportName= 'ExcelSheet.xlsx';
  downloadsArray: DownloadModel[] = [];
  documentsWithDownloads: DocumentWithDownloads[] = [];
  controlSesion = new ControlSesion();
  documentsReportList: DocumentModelQuery[] = [];

  formReports = new FormGroup({
    date_start: new FormControl('', { validators: [Validators.required] }),
    date_end: new FormControl('', { validators: [Validators.required] }),
    report_type: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private router: Router,
    private endPointService: EndpointsService
  ) {}

  ngOnInit(): void {
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 555:
        this.router.navigate(['document']);
        break;
    }
  }
  generateReport() {
    const startDate = this.formReports.get('date_start');
    const finalDate = this.formReports.get('date_end');
    console.log('startDate:', startDate.value);
    console.log('FinalDate:', finalDate.value);
    this.endPointService
      .getDownloadByPeriod(startDate.value, finalDate.value)
      .subscribe({
        next: (downloadres) => {
          this.downloadsArray = downloadres;
        },
        error: () => {},
        complete: () => {
          console.log('DOWNLOADS', this.downloadsArray);
          this.countDownloads();
        },
      });
  }
  countDownloads() {
    this.downloadsArray.forEach((download)=>{
      this.repetidos[download.documentId] = (this.repetidos[download.documentId] || 0) + 1;
    });
    console.log("repetios",this.repetidos)
    //let arrray=[];
    for(let docId in this.repetidos){
      //arrray.push(docId)
      this.endPointService.getDocumentById(docId).subscribe({
        next: (downloadres) => {
          this.documentsWithDownloads.push({...downloadres,downloads:this.repetidos[docId]})
        //this.documentsReportList.push(downloadres);
        },
        error: () => {},
        complete: () => {
          //console.log('Documentosconnumero de descargas', this.documentsWithDownloads);
        //this.countDownloads();
        },
      });
    }
    this.documentsWithDownloads.sort((a, b) => {
      if (a.downloads > b.downloads) return 1;
      if (a.downloads < b.downloads) return -1;
      return 0;
    })
  }
  downloadReport(){
    /* el id de la tabla se pasa aquí */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* genera el libro de trabajo y agrega la hoja de trabajo */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    /* guardar en archivo */
    XLSX.writeFile(wb, this.reportName);
  }

}

