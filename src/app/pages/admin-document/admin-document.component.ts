import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { DocumentModel } from 'src/app/models/document.model';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {
  group: AbstractControl;
  MAX_DOC_SIZE: number = 1000000;
  documentModel: DocumentModel;

  // Variables de filtro
  listaCategorias: Array<String> = ['Amarillo', 'Azul', 'Rojo'] // Lista quemada hasta tener el backend
  listaSubCategorias: Array<String> = ['Amarillo', 'Azul', 'Rojo'] // Lista quemada hasta tener el backend
  listaDocumentos: Array<any> = []; // Lista quemada hasta tener el backend

  // Helpers
  currentDocFile: any;

  // ???
  controlSesion = new ControlSesion();
  isAdmin = false;
  showModalNoUser: boolean = false;
  showModalNoUser2: boolean = false;
  imagePrevius: any;
  fileInAngular: any;
  docType: any;

  docsAllowed: String[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  documentForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    category: new FormControl('', { validators: [Validators.required] }),
    subcategory: new FormControl(''),
    upload: new FormControl('', { validators: [Validators.required] })
  })

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private endPointService: EndpointsService,
    private storage: Storage) { }


  // Validacion comentada por sebastian santis por problemas con el backend ... (si no tienes problemas descomentar)
  ngOnInit(): void {

    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 700:
        this.isAdmin = true;
        this.getStorage();
        break;
    };

  }

  getDocument() { }

  protected async onFileSelected(event: any) {

    const docFile = event.target.files[0];
    this.currentDocFile = event.target.files[0];
    this.docType = docFile.type;

    if (this.docsAllowed.includes(docFile.type) && event.target.files[0].size <= this.MAX_DOC_SIZE) {

      this.fileInAngular = docFile;

      this.blobFile(docFile).then((res: any) => {
        this.imagePrevius = res.base;
        const db = this.imagePrevius.split(',')[1];
      });

    } else {

      event.target.value = '';
      this.revealForm();

    }

  }

  private blobFile = async ($event: any) => new Promise((resolve, reject) => {

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

  protected revealForm() {
    this.showModalNoUser = !this.showModalNoUser;
  }
  protected revealForm2() {
    this.showModalNoUser2 = !this.showModalNoUser2
  }

  protected async submit() {

    const docName = this.documentForm.get('name');
    const docDescription = this.documentForm.get('description');
    const docCategory = this.documentForm.get('category');
    const docSubCategory = this.documentForm.get('subcategory');
    const docUpload = this.documentForm.get('upload');
    const pathDocument  = await this.sendToStorage()

    this.endPointService.createDocument({
      name: docName.value,
      categoryId: docCategory.value,
      subCategoryName: docSubCategory.value,
      version: 1,
      pathDocument: pathDocument,
      blockChainId: 'blockChainId1',
      description: docDescription.value
    }).subscribe(n => {
      docName.setValue("");
      docCategory.setValue("");
      docSubCategory.setValue("");
      docDescription.setValue("");
      docUpload.setValue("");
      this.revealForm2();

    });
  }


  /**
   * @Description sendToStorage es una funcion que sirve para enviar hacia el storage de firebase el documento seleccionado por el administrador
   */

  protected async sendToStorage():Promise<string> {

    const docRef = ref(this.storage, `documents/${this.currentDocFile.name}`);
    uploadBytes(docRef, this.currentDocFile)
    return (await getDownloadURL(docRef))

  }

  /**
 * @Description getStorage es una funcion que nos sirve para obtener cada uno de los datos que se encuentran dentro de nuestro storage en firebase
 */

  private async getStorage():Promise<void> {

    const docRef = ref(this.storage, 'documents')
    listAll(docRef)
      .then(async docs => {

        for (let doc of docs.items) {
          const url = await getDownloadURL(doc)
          this.listaDocumentos.push(url)
        }

      })
      .catch(err => { console.error(err) });

    console.log(this.listaDocumentos)

  }

  /**
   * @Description goToViewSelectedDocument es una funcion que sirve para enviar al usuario al componente de visualizacion de documentos
   * @param url hace referencia a la url que genera firebase para obtener un archivo almacenado en storage
   */

  protected goToViewSelectedDocument(url: string):void {
    sessionStorage.setItem('docurl', url)
    this.router.navigate([`view-document`])
  }

}
