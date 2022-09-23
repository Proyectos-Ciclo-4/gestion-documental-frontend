import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';

@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {

  controlSesion = new ControlSesion();
  isAdmin = false;
  showModalNoUser: boolean = false;
  imagePrevius: any;
  fileInAngular: any;
  docType: any;
  docsAllowed: String[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];


  constructor(private sanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit(): void {
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 700:
        this.isAdmin = true;
        break;
    };
  }

  getDocument() { }
  async onFileSelected(event: any) {
    const docFile = event.target.files[0];
    this.docType = docFile.type;
    console.log(event.target);
    if (this.docsAllowed.includes(docFile.type)) {
      this.fileInAngular = docFile;
      this.blobFile(docFile).then((res: any) => {
        this.imagePrevius = res.base;
        console.log(this.imagePrevius)
        const db = this.imagePrevius.split(",")[1]
        console.log(db)
      })
      console.log('Es un archivo permitido');
    } else {
      event.target.value = "";
      this.revealForm();
      console.log('archivo no permitido');
    }

  }
  blobFile = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeDoc = window.URL.createObjectURL($event);
        const docF = this.sanitizer.bypassSecurityTrustUrl(unsafeDoc);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            blob: $event,
            docF,
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            blob: $event,
            docF,
            base: null,
          });
        };
      } catch (e) {
        return null;
      }
    });
  revealForm() {
    this.showModalNoUser = !this.showModalNoUser
    console.log("ESTADO CAMBIADO")
  }
}
