import { LoginService } from 'src/app/services/login/login.service';
import { Component, OnInit } from '@angular/core';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { DocumentModel, DocumentModelQuery, DocumentUpdateModel, DocumentModelBlockchain } from 'src/app/models/document.model';
import { Storage, uploadBytes, getDownloadURL, deleteObject, ref, getBlob } from '@angular/fire/storage';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { environment } from 'src/environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {

  page: number = 1;
  maxPage = environment.paginationmax;

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
  disableLoginWithEmail = false;
  nameDocumentToUpdate!: string;
  documentSelected: DocumentModelQuery;

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
  showModalNoUserRequireLoginTolookDoc: boolean = false;
  showModalNoUserRequireLoginToDownloadDoc: boolean = false;
  showModalNoUserRequireLoginToShowHistoryDoc: boolean = false;
  showModalNoUser: boolean = false;
  showModalNoDocAndName: boolean = false;
  showModalNothingSelected: boolean = false;
  showModalLoader: boolean = false;
  showModalLoaderGeneric = false;

  fileInAngular: any;

  //ModalInfoVariables
  modalInfoNombre: string;
  modalInfoCategoria: string;
  modalInfoSubcategoria: string;
  modalInfoVersion: number;
  modalInfoFecha: Date;
  modalInfoFechaDownload: any;
  modalInfoDesription: string;
  dateIsEqualsToDownload = false;

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
    private storage: Storage,
    private login$: LoginService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
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

    document.addEventListener('keydown', (event) => {

      if (event.code == "Escape") {
        this.showModalRequiresDocument = false;
        this.showModalSaveDocument = false;
        this.showModalDetailsDocument = false;
        this.showModalRequireLogin = false;
        this.showModalActualizarDocument = false;
        this.showModalDeleteDocument = false;
        this.showModalUpdatedDocument = false;
        this.showModalNoUserRequireLoginTolookDoc = false;
        this.showModalNoUserRequireLoginToDownloadDoc = false;
        this.showModalNoUserRequireLoginToShowHistoryDoc = false;
        this.showModalNoUser = false;
      }

    }, false);

    this.getCategoryList()

  }

  protected async onFileSelected(event: any) {

    const docFile = event.target.files[0];
    this.currentDocFile = event.target.files[0];

    if (this.docsAllowed.includes(docFile.type) && event.target.files[0].size <= this.MAX_DOC_SIZE) {
      this.fileInAngular = docFile;
    } else {
      event.target.value = '';
      this.showModalRequiresDocument = true;
    }
  }

  /**
   * sendToStorage es una funcion que sirve para enviar hacia el storage de firebase el documento
   * seleccionado por el administrador
   */
  protected sendToStorage() {

    this.showModalLoader = true;
    const category: string = this.documentForm.get('category').value;
    const subcategory: string = this.documentForm.get('subcategory').value;
    const name: string = this.documentForm.get('name').value;

    const docRef = ref(this.storage, `documents/${category}/${subcategory}/${name}`);
    uploadBytes(docRef, this.currentDocFile).then(() => {
      getDownloadURL(docRef).then(res => {
        this.saveDocument(res)
        this.reloadDocuments()
      })
    }).catch(() => { this.showModalLoader = false; })
  }

  saveDocument(res: any) {

    const docName = this.documentForm.get('name');
    const docDescription = this.documentForm.get('description');
    const docCategory = this.documentForm.get('category');
    const docSubCategory = this.documentForm.get('subcategory');
    const docUpload = this.documentForm.get('upload');
    const pathDocument = res;
    const id_doc = `${Date.now()}-777`;

    this.generateBase64Doc(this.currentDocFile).then((base64: any) => {

      const docToSendBlockchain: DocumentModelBlockchain = {
        _id: id_doc,
        name: docName.value,
        version: 1,
        pathDocument: base64.base,
        description: docDescription.value,
        date: new Date(),
        categoryId: docCategory.value,
        subCategoryName: docSubCategory.value
      }

      this.endPointService.putDataBlockchain(docToSendBlockchain).subscribe((response) => {

        const hash = response.hash;

        this.endPointService.createDocument({
          _id: id_doc,
          name: docName.value,
          userId: this.controlSesion.getIdUser(),
          categoryId: docCategory.value,
          subCategoryName: docSubCategory.value,
          version: 1,
          pathDocument: pathDocument,
          blockChainId: [hash],
          description: docDescription.value

        }).subscribe({
          next: (n) => {
            docName.setValue("");
            docCategory.setValue("");
            docSubCategory.setValue("");
            docDescription.setValue("");
            docUpload.setValue("");
          },
          error: () => { },
          complete: () => {
            this.showModalSaveDocument = true;
            this.showModalLoader = false;
          },
        });
      })

    });
  }

  private generateBase64Doc = async ($event: any) => new Promise((resolve, reject) => {

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


  /**
   * @Description goToViewSelectedDocument es una funcion que sirve para enviar al usuario al componente de visualizacion de documentos
   * @param url hace referencia a la url que genera firebase para obtener un archivo almacenado en storage
   */
  protected goToViewSelectedDocument(url: string, name: string): void {

    sessionStorage.setItem('docurl', url)
    sessionStorage.setItem('name_document', name)

    if (this.isUser) {
      window.open("/view-document", "_blank");

    } else this.showModalNoUserRequireLoginTolookDoc = true;

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
          if (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) return 1;
          if (a.categoryName.toLowerCase() < b.categoryName.toLowerCase()) return -1;
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
          if (a.subCategoryName.toLowerCase() > b.subCategoryName.toLowerCase()) {
            return 1;
          }
          if (a.subCategoryName.toLowerCase() < b.subCategoryName.toLowerCase()) {
            return -1;
          }

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
          if (a.subCategoryName.toLowerCase() > b.subCategoryName.toLowerCase()) return 1;
          if (a.subCategoryName.toLowerCase() < b.subCategoryName.toLowerCase()) return -1;
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
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        })
      }
    });
  }

  confirmUpdateDocument(doc: DocumentModelQuery) {
    this.showModalActualizarDocument = true;
    this.documentSelected = doc;
  }

  updateDocument() {

    let docNameUpdate = this.updateDocumentForm.get('nameUpdate');
    let docDescriptionUpdate = this.updateDocumentForm.get('descriptionUpdate');
    let docUpload = this.updateDocumentForm.get('uploadUpdate');

    const onlyDescriptionChange: boolean = (("" + docDescriptionUpdate.value).trim() !== "") && (("" + docNameUpdate.value).trim() == "") && (("" + docUpload.value).trim() == "");
    const otherDocInput: boolean = ("" + docUpload.value).trim() !== "";
    const nothingSelected: boolean = (("" + docDescriptionUpdate.value).trim() === "") && (("" + docNameUpdate.value).trim() === "") && (("" + docUpload.value).trim() === "");

    if (nothingSelected) this.showModalNothingSelected = true;
    else if (onlyDescriptionChange) {

      this.showModalLoaderGeneric = true;
      this.endPointService.getLastBase64Document(this.documentSelected.blockChainId[this.documentSelected.blockChainId.length - 1])
        .subscribe(response => {

          const base64 = response.pathDocument;
          const docToSendBlockchain: DocumentModelBlockchain = {
            _id: this.documentSelected.uuid,
            name: this.documentSelected.name,
            version: this.documentSelected.version += 1,
            pathDocument: base64,
            description: docDescriptionUpdate.value,
            date: new Date(),
            categoryId: this.documentSelected.categoryId,
            subCategoryName: this.documentSelected.subCategoryName
          }

          this.endPointService.putDataBlockchain(docToSendBlockchain).subscribe((response) => {

            const hash = response.hash;

            this.endPointService.updateDocument(
              this.documentSelected.uuid,
              {
                name: null,
                description: docDescriptionUpdate.value || null,
                pathDocument: null,
                blockChainId: [hash]
              }

            ).subscribe(e => {

              this.showModalLoaderGeneric = false;
              this.showModalUpdatedDocument = true;
              this.showModalActualizarDocument = false;
              
              this.reloadDocuments();

            });

          });
        });

    } else if (otherDocInput) {
      this.showModalLoaderGeneric = true;
      this.sendToStorageVersionUpdateWithNameChange(docNameUpdate.value, docDescriptionUpdate.value)

    } else this.showModalNoDocAndName = true;

    this.cleanFormUpdate();
  }

  protected sendToStorageVersionUpdateWithNameChange(name: string, description: string) {

    const lastName = this.documentSelected.name;
    const category = this.documentSelected.categoryId;
    const subcategory = this.documentSelected.subCategoryName;

    // Elimina el archivo con el nombre anterior en dado caso sea diferente
    if (name != lastName && (name != "")) {
      const docRefDelete = ref(this.storage, `documents/${category}/${subcategory}/${lastName}`);
      deleteObject(docRefDelete)
    }

    let nameSend = name;
    if (name == "") nameSend = lastName

    const docRef = ref(this.storage, `documents/${category}/${subcategory}/${name}`);

    uploadBytes(docRef, this.currentDocFile).then(() => {

      this.generateBase64Doc(this.currentDocFile).then((base64: any) => {

        const docToSendBlockchain: DocumentModelBlockchain = {
          _id: this.documentSelected.uuid,
          name: nameSend,
          version: this.documentSelected.version += 1,
          pathDocument: base64.base,
          description: description,
          date: new Date(),
          categoryId: category,
          subCategoryName: subcategory
        }

        this.endPointService.putDataBlockchain(docToSendBlockchain).subscribe((response) => {

          const hash = response.hash;

          getDownloadURL(docRef).then(res => {

            this.endPointService.updateDocument(this.documentSelected.uuid,
              {
                name: nameSend || null,
                description: description || null,
                pathDocument: res,
                blockChainId: [hash]
              }
            ).subscribe(e => this.reloadDocuments());

            this.showModalLoaderGeneric = false;
            this.showModalUpdatedDocument = true;
            this.showModalActualizarDocument = false;
          })
        })
      })
    })

  }

  cleanFormUpdate() {
    this.updateDocumentForm = new FormGroup({
      nameUpdate: new FormControl(''),
      descriptionUpdate: new FormControl(''),
      uploadUpdate: new FormControl('')
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
  confirmDeleteDocument(uuid: string, name: string, cateogory, subcategory) {
    this.referenceDelte = ref(this.storage, `documents/${cateogory}/${subcategory}/${name}`)
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

  viewModalDetailsDocument(data: DocumentModelQuery) {

    this.showModalDetailsDocument = true;

    this.modalInfoNombre = data.name;
    this.modalInfoCategoria = data.categoryId;
    this.modalInfoSubcategoria = data.subCategoryName;
    this.modalInfoVersion = data.version;
    this.modalInfoFecha = data.dateCreated;

    if (data.dateCreated === data.lastDateDownload) {
      this.modalInfoFechaDownload = "None";
      this.dateIsEqualsToDownload = true;
    } else {
      this.modalInfoFechaDownload = data.lastDateDownload;
      this.dateIsEqualsToDownload = false;
    }

    this.modalInfoDesription = data.description;
  }

  async downloadDoc(nameDoc: string, idDoc: string, category: string, subcategories: string) {

    if (this.isUser) {

      const reference = ref(this.storage, `documents/${category}/${subcategories}/${nameDoc}`);
      getBlob(reference).then((blob) => {

        const newFile = new File([blob], nameDoc, { type: blob.type });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(newFile);
        a.target = '_blank';

        blob.type == 'application/pdf' ? a.download = `${nameDoc}.pdf` : a.download = `${nameDoc}`;
        a.click();

      });

      const userEmail = this.controlSesion.getEmailUser();
      this.endPointService.updateDownloads(idDoc, userEmail).subscribe();

    } else {
      sessionStorage.setItem('docId', idDoc);
      sessionStorage.setItem('docName', nameDoc);
      sessionStorage.setItem('cat', category);
      sessionStorage.setItem('subcat', subcategories);
      this.showModalNoUserRequireLoginToDownloadDoc = true;
    }
  }

  loginWithGoogleLookDocument() {

    this.login$.login().then((data) => {

      this.endPointService.verifyUser(data.user.email)
        .subscribe(data => {

          if (data == null) this.showModalNoUser = true;
          else {

            this.controlSesion.writeSesionUser(data);
            let nowurl = location.href;

            if (data.tipo == 700) {

              this.isAdmin = true;
              this.isUser = true;
              nowurl = nowurl.replace("document", "view-document");

            } else if (data.tipo == 555) this.isUser = true;

            window.open(nowurl, "_blank");
            this.showModalNoUserRequireLoginTolookDoc = false;
          }

        });
    });
  }

  loginWithGoogleDownloadDocument() {

    this.login$.login().then((data) => {

      this.endPointService.verifyUser(data.user.email)
        .subscribe(data => {

          if (data == null) this.showModalNoUser = true;
          else {

            this.controlSesion.writeSesionUser(data);
            if (data.tipo == 700) {
              this.isAdmin = true;
              this.isUser = true;

            } else if (data.tipo == 555) this.isUser = true;

            this.showModalNoUserRequireLoginToDownloadDoc = false;

            this.downloadDoc(
              sessionStorage.getItem('docName'),
              sessionStorage.getItem('docId'),
              sessionStorage.getItem('cat'),
              sessionStorage.getItem('subcat'))
          }

        });
    });
  }

  goToHistoryDocument(data: object) {
    if (this.isUser || this.isAdmin) {
      localStorage.setItem("history_doc", JSON.stringify(data));
      this.router.navigate(['change-history']);
    } else {
      this.showModalNoUserRequireLoginToShowHistoryDoc = true;
    }
  }

  loginWithGoogleHistoryDocument() {
    this.login$.login().then((data) => {

      this.endPointService.verifyUser(data.user.email)
        .subscribe(data => {

          if (data == null) this.showModalNoUser = true;
          else {

            this.controlSesion.writeSesionUser(data);
            if (data.tipo == 700) {
              this.isAdmin = true;
              this.isUser = true;

            } else if (data.tipo == 555) this.isUser = true;

            this.showModalNoUserRequireLoginToShowHistoryDoc = false;
          }

        });
    });
  }

}

