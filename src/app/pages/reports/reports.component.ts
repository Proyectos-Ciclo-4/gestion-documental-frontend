import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentModelQuery, DocumentWithDownloads } from 'src/app/models/document.model';
import { DownloadModel } from 'src/app/models/download.model';
import { userDownloadModel } from 'src/app/models/user.model';
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
  repetidos2:any ={};
  page: number = 1;
  reportName= 'ExcelSheet.xlsx';
  downloadsArray: DownloadModel[] = [];
  documentsWithDownloads: DocumentWithDownloads[] = [];
  usersWithDownloads:userDownloadModel[] = [];
  controlSesion = new ControlSesion();
  documentsReportList: DocumentModelQuery[] = [];
  showDownloadReport: boolean=false;
  showUserReport: boolean=false;

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
    this.repetidos={};
    this.resetVariables();
    const reportType=this.formReports.get('report_type');
    if(reportType.value=="1"){
      this.showUserReport=false;
      this.downloadsArray.forEach((download)=>{
        this.repetidos[download.documentId] = (this.repetidos[download.documentId] || 0) + 1;
      });
      for(let docId in this.repetidos){
        this.endPointService.getDocumentById(docId).subscribe({
          next: (downloadres) => {
            this.documentsWithDownloads.push({...downloadres,downloads:this.repetidos[docId]})
          },
          error: () => {},
          complete: () =>{},
        });
      }
      this.documentsWithDownloads.sort((a, b) => {
        if (a.downloads > b.downloads) {return 1;}
        if (a.downloads < b.downloads) {return -1;}
        return 0;
      })
      this.showDownloadReport=true;
    }else if(reportType.value=="2"){
      this.showDownloadReport=false;
      this.downloadsArray.forEach((user)=>{
        this.repetidos[user.userId] = (this.repetidos[user.userId] || 0) + 1;
      });
      for(let userId in this.repetidos){
        this.usersWithDownloads.push({
          userId:userId,
          downloads:this.repetidos[userId]
        })
      }
      this.usersWithDownloads.sort((a, b) => {
        if (a.downloads > b.downloads) {return 1;}
        if (a.downloads < b.downloads) {return -1;}
        return 0;
      })
      this.showUserReport=true;
    }
    console.log("repetios",this.repetidos)
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
    this.showDownloadReport=false;
    this.resetVariables();
  }
  downloadReportByUser(){
    /* el id de la tabla se pasa aquí */
    let element = document.getElementById('excel-table2');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* genera el libro de trabajo y agrega la hoja de trabajo */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    /* guardar en archivo */
    XLSX.writeFile(wb, this.reportName);
    this.showUserReport=false;
    this.resetVariables();
  }
  resetVariables(){
    this.usersWithDownloads=[];
    this.documentsWithDownloads=[];
  }
}

