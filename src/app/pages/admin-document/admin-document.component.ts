import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { DocumentModel, DocumentModelQuery, DocumentUpdateModel } from 'src/app/models/document.model';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, deleteObject, getMetadata } from '@angular/fire/storage';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { stringLength } from '@firebase/util';

@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {

  page: number = 1;
 
  uuidDoc: string;
  group: AbstractControl;
  MAX_DOC_SIZE: number = 1000000;
  documentModel: DocumentModel;
  updateModel: DocumentUpdateModel;
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  subcategoriesFilter: SubCategory[] = [];
  documentsList: DocumentModelQuery[] = [];

  // Variables de filtro
  listaDocumentos: Array<any> = []; // Lista quemada hasta tener el backend
  listaNombresStorage: Array<string> = []; // Lista dinamica creada con los datos del storage

  // Helpers
  currentDocFile: any;
  returnToView = false;
  returnToViewObject: Object;
  private deleteDoc!: string;
  referenceDelte: any;

  // ???
  controlSesion = new ControlSesion();
  isAdmin = false;
  isUser = false;
  showModalNoUser: boolean = false;
  showModalNoUser2: boolean = false;
  showModalNoUser3: boolean = false;
  showModalNoUser4: boolean = false;
  showModalNoUser5: boolean = false;
  showModalNoUser6: boolean = false;
  imagePrevius: any;
  fileInAngular: any;
  docType: any;

  //ModalInfoVariables
  modalInfoNombre: string;
  modalInfoCategoria: string;
  modalInfoSubcategoria: string;
  modalInfoVersion: string;
  modalInfoFecha: string;
  modalInfoBlockChain: string;
  modalInfoDesription: string;

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

  finDocumentForm = new FormGroup({
    categoryFilter: new FormControl('', { validators: [Validators.required] }),
    subcategoryFilter: new FormControl(''),
  })
  updateDocumentForm = new FormGroup({
    nameUpdate: new FormControl(''),
    descriptionUpdate: new FormControl(''),
    uploadUpdate: new FormControl('')
  })
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private endPointService: EndpointsService,
    private storage: Storage) {

  }


  ngOnInit(): void {
    this.getCategoryList()
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.isUser = false;
        this.isAdmin = false;
        break;
      case 700:
        this.isAdmin = true;
        this.isUser = true;
        break;
      case 555:
        this.isUser = true;
        this.isAdmin = false;
        break;
    };
  }
  protected async onFileSelected(event: any) {

    const docFile = event.target.files[0];
    this.currentDocFile = event.target.files[0];
    this.docType = docFile.type;

    if (this.docsAllowed.includes(docFile.type) && event.target.files[0].size <= this.MAX_DOC_SIZE) {
      this.fileInAngular = docFile;
    } else {
      event.target.value = '';
      this.revealForm();
    }

  }

  protected submit() {
    this.sendToStorage()
  }


  /**
   * @Description sendToStorage es una funcion que sirve para enviar hacia el storage de firebase el documento seleccionado por el administrador
   */

  protected sendToStorage() {
    console.log("Error en SENDSotrage")
    const docRef = ref(this.storage, `documents/${this.documentForm.get('name').value}`);
    uploadBytes(docRef, this.currentDocFile).then(() => {
      getDownloadURL(docRef).then(res => {
        this.saveDocument(res)
      })
    })

  }
  saveDocument(res: any) {
    console.log("respuesta", res)
    const docName = this.documentForm.get('name');
    const docDescription = this.documentForm.get('description');
    const docCategory = this.documentForm.get('category');
    const docSubCategory = this.documentForm.get('subcategory');
    const docUpload = this.documentForm.get('upload');
    const pathDocument = res
    this.endPointService.createDocument({
      name: docName.value,
      categoryId: docCategory.value,
      subCategoryName: docSubCategory.value,
      version: 1,
      pathDocument: pathDocument,
      blockChainId: 'blockChainId1',
      description: docDescription.value,
      dateCreated: new Date()
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
 * @Description getStorage es una funcion que nos sirve
 * para obtener cada uno de los datos que se encuentran dentro
 * de nuestro storage en firebase
 */

  private async getStorage(): Promise<void> {
    const docRef = ref(this.storage, 'documents')
    listAll(docRef)
      .then(async docs => {

        for (let doc of docs.items) {
          console.log("Error en getSotrage")
          const url = await getDownloadURL(doc)
          this.listaDocumentos.push(url)
        }
      })
      .catch(err => { console.error(err) });
    let data: any;
    listAll(docRef).then(data => data.items.forEach(e => {
      let data = e.fullPath.split('/');
      this.listaNombresStorage.push(data[1])
    }));
    console.log(this.listaDocumentos)
    console.log(this.listaNombresStorage)
  }

  /**
   * @Description goToViewSelectedDocument es una funcion que sirve para enviar al usuario al componente de visualizacion de documentos
   * @param url hace referencia a la url que genera firebase para obtener un archivo almacenado en storage
   */

  protected goToViewSelectedDocument(url: string): void {

    if (this.isUser) {
      sessionStorage.setItem('docurl', url)
      this.router.navigate([`view-document`])
    } else {
      this.showModalNoUser4 = true;
    }

  }
  getCategoryList() {
    this.endPointService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      complete: () => {
        this.categories.sort((a, b) => {
          if (a.categoryName > b.categoryName) {
            return 1;
          }
          if (a.categoryName < b.categoryName) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      }
    })
  }
  getSubcategoriesByCategory() {
    const docCategory = this.documentForm.get('category');
    this.endPointService.getSubCategories(docCategory.value).subscribe({
      next: (res) => {
        this.subcategories = res;
      },
      complete: () => {
        this.subcategories.sort((a, b) => {
          if (a.subCategoryName > b.subCategoryName) {
            return 1;
          }
          if (a.subCategoryName < b.subCategoryName) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      }
    })
  }
  getSubcategoriesByCategoryFilter() {
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    this.endPointService.getSubCategories(docCategoryFilter.value).subscribe({
      next: (res) => {
        this.subcategoriesFilter = res;
      },
      complete: () => {
        this.subcategoriesFilter.sort((a, b) => {
          if (a.subCategoryName > b.subCategoryName) {
            return 1;
          }
          if (a.subCategoryName < b.subCategoryName) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      }
    })
  }
  filterDocumentBy() {
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    const docSubCategoryFilter = this.finDocumentForm.get('subcategoryFilter');
    this.endPointService.findDocumentBy(docCategoryFilter.value, docSubCategoryFilter.value).subscribe({
      next: (res) => {
        this.documentsList = res;
        docSubCategoryFilter.setValue("");
      },
      complete: () => {
        this.documentsList.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      }
    });
  }
  upDate(uuid: string) {
    this.uuidDoc = uuid;
    this.revealForm5();
  }
  upDateDocument() {
    const docNameUpdate = this.updateDocumentForm.get('nameUpdate');
    const docDescriptionUpdate = this.updateDocumentForm.get('descriptionUpdate');
    const docUpload = this.updateDocumentForm.get('uploadUpdate');
    this.endPointService.updateDocument(this.uuidDoc,
      {
        name: docNameUpdate.value || null,
        description: docDescriptionUpdate.value || null,
        pathDocument: docUpload.value || null
      }
    ).subscribe();
    this.revealForm5();

  }
  //Controladores de los modales
  protected revealForm() {
    this.showModalNoUser = !this.showModalNoUser;
  }
  protected revealForm2() {
    this.showModalNoUser2 = !this.showModalNoUser2;
  }
  protected revealForm3() {
    this.showModalNoUser3 = false;
  }
  protected revealForm5() {
    this.showModalNoUser5 = !this.showModalNoUser5;
  }

  // Manda a el usuarioa la pagina de login, guardando en el sessionStorage los datos del filtro que realizo
  protected revealForm4_1() {
    this.router.navigate(['/'])
  }

  // Quita el modal de la vista
  protected revealForm4_2() {
    this.showModalNoUser4 = false;
  }

  deleteDocument(uuid: string, name: string) {


    this.referenceDelte = ref(this.storage, `documents/${name}`)

    this.deleteDoc = uuid;
    this.showModalNoUser6 = true;

  }

  // Confirma que el usuario quiere realizar la respectiva eliminacion de ese documento
  protected revealForm6_1() {

    deleteObject(this.referenceDelte)
      .then(res => console.log(res))
      .catch(e => console.log(e));

    this.endPointService.deleteDocumentBy(this.deleteDoc).subscribe({
      next: (res) => {
        console.log("Documento Eliminado Correctamente!")
      }
    })

    this.showModalNoUser6 = false;

  }

  // Quita el modal de la vista
  protected revealForm6_2() {
    this.showModalNoUser6 = false;
  }

  showDetails() {
    this.showModalNoUser3 = true;
  }

  visualizarModal(
    modalInfoNombre,
    modalInfoCategoria,
    modalInfoSubcategoria,
    modalInfoVersion,
    modalInfoFecha,
    modalInfoBlockChain,
    modalInfoDesription) {

    this.modalInfoNombre = modalInfoNombre;
    this.modalInfoCategoria = modalInfoCategoria;
    this.modalInfoSubcategoria = modalInfoSubcategoria;
    this.modalInfoVersion = modalInfoVersion;
    this.modalInfoFecha = modalInfoFecha;
    this.modalInfoBlockChain = modalInfoBlockChain;
    this.modalInfoDesription = modalInfoDesription;

    this.showModalNoUser3 = true;

  }

}
