import { Component, OnInit } from '@angular/core';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { DocumentModel, DocumentModelQuery, DocumentUpdateModel } from 'src/app/models/document.model';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject, getMetadata } from '@angular/fire/storage';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';

@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {

  page: number = 1;
  idDocumentToUpdate: string;

  group: AbstractControl;
  MAX_DOC_SIZE: number = 1000000;
  documentModel: DocumentModel;
  updateModel: DocumentUpdateModel;
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  subcategoriesFilter: SubCategory[] = [];
  documentsList: DocumentModelQuery[] = [];

  // Helpers
  currentDocFile: any;
  private deleteDoc!: string;
  referenceDelte: any;

  controlSesion = new ControlSesion();
  isAdmin = false;
  isUser = false;
  showModalRequiresDocument: boolean = false;
  showModalSaveDocument: boolean = false;
  showModalDetailsDocument: boolean = false;
  showModalRequireLogin: boolean = false;
  showModalActualizarDocument: boolean = false;
  showModalDeleteDocument: boolean = false;
  showModalUpdatedDocument: boolean = false;
  fileInAngular: any;

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
    private router: Router,
    private endPointService: EndpointsService,
    private storage: Storage) { }

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

    if (this.docsAllowed.includes(docFile.type) && event.target.files[0].size <= this.MAX_DOC_SIZE) this.fileInAngular = docFile;
    else {
      event.target.value = '';
      this.showModalRequiresDocument = true;
    }
  }

  /**
   * sendToStorage es una funcion que sirve para enviar hacia el storage de firebase el documento 
   * seleccionado por el administrador
   */
  protected sendToStorage() {
    const docRef = ref(this.storage, `documents/${this.documentForm.get('name').value}`);
    uploadBytes(docRef, this.currentDocFile).then(() => {
      getDownloadURL(docRef).then(res => {
        this.saveDocument(res)
      })
    })
  }

  saveDocument(res: any) {

    const docName = this.documentForm.get('name');
    const docDescription = this.documentForm.get('description');
    const docCategory = this.documentForm.get('category');
    const docSubCategory = this.documentForm.get('subcategory');
    const docUpload = this.documentForm.get('upload');
    const pathDocument = res;

    this.endPointService.createDocument({

      name: docName.value,
      userId: this.controlSesion.getIdUser(),
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
      this.showModalSaveDocument = true;

    });
  }

  /**
   * @Description goToViewSelectedDocument es una funcion que sirve para enviar al usuario al componente de visualizacion de documentos
   * @param url hace referencia a la url que genera firebase para obtener un archivo almacenado en storage
   */
  protected goToViewSelectedDocument(url: string, name: string): void {
    if (this.isUser) {

      sessionStorage.setItem('docurl', url)
      sessionStorage.setItem('name_document', name)

      this.router.navigate([`view-document`])
    } else this.showModalRequireLogin = true;
  }

  /**
   * 
   */
  getCategoryList() {
    this.endPointService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      complete: () => {
        this.categories.sort((a, b) => {
          if (a.categoryName > b.categoryName) return 1;
          if (a.categoryName < b.categoryName) return -1;
          return 0;
        })
      }
    })
  }

  /**
   * 
   */
  getSubcategoriesByCategory() {
    const docCategory = this.documentForm.get('category');
    this.endPointService.getSubCategories(docCategory.value).subscribe({
      next: (res) => {
        this.subcategories = res;
      },
      complete: () => {
        this.subcategories.sort((a, b) => {
          if (a.subCategoryName > b.subCategoryName) return 1;
          if (a.subCategoryName < b.subCategoryName) return -1;
          return 0;
        })
      }
    })
  }

  /**
   * 
   */
  getSubcategoriesByCategoryFilter() {
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    this.endPointService.getSubCategories(docCategoryFilter.value).subscribe({
      next: (res) => {
        this.subcategoriesFilter = res;
      },
      complete: () => {
        this.subcategoriesFilter.sort((a, b) => {
          if (a.subCategoryName > b.subCategoryName) return 1;
          if (a.subCategoryName < b.subCategoryName) return -1;
          return 0;
        })
      }
    })
  }

  /**
   * 
   */
  filterDocumentBy() {
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    const docSubCategoryFilter = this.finDocumentForm.get('subcategoryFilter');
    this.endPointService.findDocumentBy(docCategoryFilter.value, docSubCategoryFilter.value).subscribe({
      next: (res) => {
        this.documentsList = res;
      },
      complete: () => {
        this.documentsList.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        })
      }
    });
  }

  confirmUpdateDocument(uuid: string) {
    this.idDocumentToUpdate = uuid;
    this.showModalActualizarDocument = true;
  }

  updateDocument() {

    const docNameUpdate = this.updateDocumentForm.get('nameUpdate');
    const docDescriptionUpdate = this.updateDocumentForm.get('descriptionUpdate');
    const docUpload = this.updateDocumentForm.get('uploadUpdate');
    this.endPointService.updateDocument(this.idDocumentToUpdate,
      {
        name: docNameUpdate.value || null,
        description: docDescriptionUpdate.value || null,
        pathDocument: docUpload.value || null
      }
    ).subscribe({
      complete: () => {
        this.showModalActualizarDocument = false;
        this.showModalUpdatedDocument = true;
        this.reloadDocuments();
      }
    });

  }

  // Manda a el usuario la pagina de login, guardando en el sessionStorage los datos del filtro que realizo
  protected goToLogin() {
    this.router.navigate(['/'])
  }

  /**
   * confirmDeleteDocument muestra un modal para que el usuario confirme sei desea eliminar el documento
   * @param uuid Id de documento a eliminar
   * @param name Nombre del documento a eliminar
   */
  confirmDeleteDocument(uuid: string, name: string) {
    this.referenceDelte = ref(this.storage, `documents/${name}`)
    this.deleteDoc = uuid;
    this.showModalDeleteDocument = true;
  }

  /**
   * Elimina el documento de Firestone 
   */
  protected deleteDocument() {

    deleteObject(this.referenceDelte);
    this.endPointService.deleteDocumentBy(this.deleteDoc).subscribe({
      next: (res) => { this.reloadDocuments(); }
    })
    this.showModalDeleteDocument = false;
  }

  /**
   * Recarga los documentos, limpiando la lista de documentos y la carga nuevamente
   */
  reloadDocuments() {
    this.documentsList = [];
    this.filterDocumentBy();
  }

  viewModalDetailsDocument(
    modalInfoNombre,
    modalInfoCategoria,
    modalInfoSubcategoria,
    modalInfoVersion,
    modalInfoFecha,
    modalInfoBlockChain,
    modalInfoDesription) {

    this.showModalDetailsDocument = true;

    this.modalInfoNombre = modalInfoNombre;
    this.modalInfoCategoria = modalInfoCategoria;
    this.modalInfoSubcategoria = modalInfoSubcategoria;
    this.modalInfoVersion = modalInfoVersion;
    this.modalInfoFecha = modalInfoFecha;
    this.modalInfoBlockChain = modalInfoBlockChain;
    this.modalInfoDesription = modalInfoDesription;
  }

  downloadDoc(idDoc: string) {
    const idUser = this.controlSesion.getIdUser();
    this.endPointService.updateDownloads(idDoc, idUser).subscribe();
  }

}
