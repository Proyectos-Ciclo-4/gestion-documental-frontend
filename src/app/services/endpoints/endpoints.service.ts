import { Host, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseVerify } from 'src/app/models/responseVerify';
import { environment } from 'src/environments/environment.prod';
import { DocumentModel, DocumentModelBlockchain, DocumentModelQuery, DocumentUpdateModel } from 'src/app/models/document.model';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { DownloadModel } from 'src/app/models/download.model';
import { ResponseBlockchainPost } from 'src/app/models/response.blockchain.model';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor(private http: HttpClient) { }

  verifyUser(email: string): Observable<ResponseVerify> {
    return this.http.get<ResponseVerify>(`${environment.host.verifyUser}${email}`);
  }
  /**
   *DOCUMENT ENDPOINTS
   * @param document
   * @returns
   */
  createDocument(document: DocumentModel) {
    return this.http.post(environment.host.createDocument, { ...document });
  }

  findDocumentBy(categoryId: string, subCategoryName: string) {
    if (subCategoryName !== "")
      return this.http.get<DocumentModelQuery[]>(`${environment.host.getDocumentsBy}/${categoryId}/${subCategoryName}`)
    else
      return this.http.get<DocumentModelQuery[]>(`${environment.host.getDocumentsByCategory}/${categoryId}/`)
  }

  updateDocument(uuid: string, body: DocumentUpdateModel) {
    return this.http.put(`${environment.host.updateDocument}/${uuid}`, { ...body });
  }

  deleteDocumentBy(uuid: string) {
    return this.http.delete(`${environment.host.deleteDocument}/${uuid}`);
  }

  getDocumentById(id: string) {
    return this.http.get<DocumentModelQuery>(`${environment.host.getDocumentsById}/${id}`)
  }

  updateDownloadsDateDoc(uuid: string) {
    return this.http.put(`${environment.host.updateDateDownloadsDocument}/${uuid}`, {});
  }

  /**
   *Downloads Query and Commands
   */
  getDownloadByPeriod(startDate: string, finalDate: string) {
    return this.http.get<DownloadModel[]>(`${environment.host.getDownloadsByperiod}/${startDate}/${finalDate}`)
  }

  updateDownloads(docId: string, userId: String) {
    const body = {
      "documentId": docId,
      "userId": userId
    }
    this.updateDownloadsDateDoc(docId).subscribe();
    return this.http.post(`${environment.host.updateDownloads}`, { ...body })
  }

  /**
   * CATEGORY ENDPOINTS
   * @param category
   * @returns
   */
  createCategory(category: object): Observable<object> {
    return this.http.post(environment.host.createCategory, { ...category });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.host.getCategories}`);
  }

  getCategoriesToCompare(categoryName: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.host.getCategoriesToCompareEndPoint}/${categoryName}`);
  }
  /**
 * SUBCATEGORY ENDPOINTS
 * @param subcategory
 * @returns
 */
  createSubCategory(subcategory: object): Observable<object> {
    return this.http.post(environment.host.createSubcategory, { ...subcategory });
  }

  getSubCategories(categoryId: string): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${environment.host.getSubcategories}/${categoryId}`);
  }

  getSubCategoriesToCompare(categoryId: string, subCategoryName: string): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${environment.host.getSubcategoriesToCompareEndPoint}/${categoryId}/${subCategoryName}`);
  }

  /**
   * Guarda informacion den la blockchain
   * @param dataToSend Informacion a guardar en la blockchain
   * @return hash del bloque guardado
   */
  putDataBlockchain(dataToSend: DocumentModelBlockchain): Observable<ResponseBlockchainPost> {
    return this.http.post<ResponseBlockchainPost>(environment.blockchain.putData, { ...dataToSend },
      { headers: this.generateHeaders() });
  }

  /**
   * Obtiene los datos guardados con el id de bloque solicitado
   * @param idBlock hash del bloque del que desea obtener los datos
   */
  getDataBlockchain(idBlock: string): Observable<DocumentModelBlockchain> {
    return this.http.get<DocumentModelBlockchain>(`${environment.blockchain.getData}/${idBlock}`,
      { headers: this.generateHeaders() });
  }

  /**
   * Obtiene el ultimo base64 de la blockchain en caso tal el usuario solamente actualice la descripcion del documento
   * @return retorna el ultimo base64 
   */
  getLastBase64Document(idBlock: string): Observable<DocumentModelBlockchain> {
    return this.http.get<DocumentModelBlockchain>(`${environment.blockchain.getData}/${idBlock}`,
      { headers: this.generateHeaders() });
  }

  generateHeaders() {
    return {
      Authorization: `Bearer ${environment.blockchain.token}`
    }
  }

}
