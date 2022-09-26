import { Host, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseVerify } from 'src/app/models/responseVerify';
import { environment } from 'src/environments/environment.prod';
import { DocumentModel, DocumentModelQuery } from 'src/app/models/document.model';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';

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
  findDocumentBy(categoryId: string,subCategoryName:string){
    return this.http.get<DocumentModelQuery[]>(`${environment.host.getDocumentsBy}/${categoryId}/${subCategoryName}`)
  }
  updateDocument(uuid:string,body:any){
    return this.http.put(`${environment.host.updateDocument}/${uuid}`,{...body});

  }
  deleteDocumentBy(uuid:string){
    return this.http.delete(`${environment.host.deleteDocument}/${uuid}`);
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
    /**
   * SUBCATEGORY ENDPOINTS
   * @param subcategory
   * @returns
   */
     createSubCategory(subcategory: object): Observable<object> {
      return this.http.post(environment.host.createSubcategory, { ...subcategory });
    }
    getSubCategories(categoryId: string): Observable<SubCategory[]> {
      return this.http.get<SubCategory[]>(`${environment.host.getSubcategories}${categoryId}`);
    }

}
