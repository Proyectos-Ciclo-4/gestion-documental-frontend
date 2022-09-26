import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { DocumentModel, DocumentModelQuery } from 'src/app/models/document.model';
import { Storage, ref, uploadBytes, listAll, getDownloadURL,deleteObject,getMetadata } from '@angular/fire/storage';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';


@Component({
  selector: 'document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.css'],
})
export class AdminDocumentComponent implements OnInit {
  uuidDoc:string;
  group: AbstractControl;
  MAX_DOC_SIZE: number = 1000000;
  documentModel: DocumentModel;
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  subcategoriesFilter: SubCategory[] = [];
  documentsList:DocumentModelQuery[]= [];
  // Variables de filtro
  listaCategorias: Array<String> = ['Amarillo', 'Azul', 'Rojo'] // Lista quemada hasta tener el backend
  listaSubCategorias: Array<String> = ['Amarillo', 'Azul', 'Rojo'] // Lista quemada hasta tener el backend
  listaDocumentos: Array<any> = []; // Lista quemada hasta tener el backend
  listaNombresStorage:Array<string> = []; // Lista dinamica creada con los datos del storage

  // Helpers
  currentDocFile: any;
  returnToView = false;
  returnToViewObject: Object;
  private deleteDoc!:string;
  referenceDelte:any;

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
  modalInfoNombre:string;
  modalInfoCategoria:string;
  modalInfoSubcategoria:string;
  modalInfoVersion:string;
  modalInfoFecha:string;
  modalInfoBlockChain:string;
  modalInfoDesription:string;

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


  // Validacion comentada por sebastian santis por problemas con el backend ... (si no tienes problemas descomentar)
  ngOnInit(): void {
    this.getCategoryList()
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.isUser = false;
        this.isAdmin = false;
        this.getStorage();
        break;
      case 700:
        this.isAdmin = true;
        this.isUser = true;
        this.getStorage();
        break;
      case 555:
        this.isUser = true;
        this.isAdmin = false;
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

  protected async submit() {

    const docName = this.documentForm.get('name');
    const docDescription = this.documentForm.get('description');
    const docCategory = this.documentForm.get('category');
    const docSubCategory = this.documentForm.get('subcategory');
    const docUpload = this.documentForm.get('upload');
    const pathDocument = await this.sendToStorage()

    this.endPointService.createDocument({
      name: docName.value,
      categoryId: docCategory.value,
      subCategoryName: docSubCategory.value,
      version: 1,
      pathDocument: pathDocument,
      blockChainId: 'blockChainId1',
      description: docDescription.value,
      dateCreated:new Date()
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

  protected async sendToStorage(): Promise<string> {

    const docRef = ref(this.storage, `documents/${this.documentForm.get('name').value}`);
    uploadBytes(docRef, this.currentDocFile)
    return (await getDownloadURL(docRef))

  }

  /**
 * @Description getStorage es una funcion que nos sirve para obtener cada uno de los datos que se encuentran dentro de nuestro storage en firebase
 */

  private async getStorage(): Promise<void> {

    const docRef = ref(this.storage, 'documents')
    listAll(docRef)
      .then(async docs => {

        for (let doc of docs.items) {
          const url = await getDownloadURL(doc)
          this.listaDocumentos.push(url)
        }

      })
      .catch(err => { console.error(err) });

      let data:any;
      listAll(docRef).then( data => data.items.forEach(e=>{

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

    if(this.isUser){
      sessionStorage.setItem('docurl', url)
      this.router.navigate([`view-document`])
    }else{
      this.showModalNoUser4 = true;
    }

  }
  getCategoryList() {
    this.endPointService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      }
    })
  }
  getSubcategoriesByCategory(){
    const docCategory = this.documentForm.get('category');
    this.endPointService.getSubCategories(docCategory.value).subscribe({
      next: (res) => {
        this.subcategories = res;
      }
    })
  }
  getSubcategoriesByCategoryFilter(){
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    this.endPointService.getSubCategories(docCategoryFilter.value).subscribe({
      next: (res) => {
        this.subcategoriesFilter = res;
      }
    })
  }
  filterDocumentBy(){
    const docCategoryFilter = this.finDocumentForm.get('categoryFilter');
    const docSubCategoryFilter = this.finDocumentForm.get('subcategoryFilter');
    this.endPointService.findDocumentBy(docCategoryFilter.value,docSubCategoryFilter.value).subscribe({
      next: (res) => {
        this.documentsList = res;
      }
    });
  }
  upDate(uuid:string){
    this.uuidDoc=uuid;
    this.revealForm5();
  }
  upDateDocument(){
    const docNameUpdate = this.documentForm.get('nameUpdate');
    const docDescriptionUpdate = this.documentForm.get('descriptionUpdate');
    const docUpload = this.documentForm.get('uploadUpdate');
    this.endPointService.updateDocument(this.uuidDoc,{
      name:docNameUpdate,
      description:docDescriptionUpdate,
      pathtDocument:docUpload
    }).subscribe();
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
  protected revealForm4_1(){
    this.router.navigate(['/'])
  }

  // Quita el modal de la vista
  protected revealForm4_2(){
    this.showModalNoUser4 = false;
  }

  deleteDocument(uuid:string,name:string){


    this.referenceDelte = ref(this.storage,`documents/${name}`)

    this.deleteDoc =uuid;
    this.showModalNoUser6=true;

  }

  // Confirma que el usuario quiere realizar la respectiva eliminacion de ese documento
  protected revealForm6_1(){

    deleteObject(this.referenceDelte)
    .then(res=>console.log(res))
    .catch(e=>console.log(e));

    this.endPointService.deleteDocumentBy(this.deleteDoc).subscribe({
      next: (res) => {
        console.log("Documento Eliminado Correctamente!")
      }
    })

    this.showModalNoUser6 = false;

  }

  // Quita el modal de la vista
  protected revealForm6_2(){
    this.showModalNoUser6 = false;
  }

  showDetails(){
    this.showModalNoUser3 =true;
  }

  visualizarModal(
    modalInfoNombre,
    modalInfoCategoria,
    modalInfoSubcategoria,
    modalInfoVersion,
    modalInfoFecha,
    modalInfoBlockChain,
    modalInfoDesription)
  {

    this.modalInfoNombre=modalInfoNombre;
    this.modalInfoCategoria=modalInfoCategoria;
    this.modalInfoSubcategoria=modalInfoSubcategoria;
    this.modalInfoVersion=modalInfoVersion;
    this.modalInfoFecha=modalInfoFecha;
    this.modalInfoBlockChain=modalInfoBlockChain;
    this.modalInfoDesription=modalInfoDesription;

    this.showModalNoUser3=true;



  }

}
