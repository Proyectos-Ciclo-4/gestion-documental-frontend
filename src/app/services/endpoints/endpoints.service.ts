import { Host, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseVerify } from 'src/app/utils/models/responseVerify';
import { environment } from 'src/environments/environment.prod';
import { DocumentModel } from 'src/app/models/document.model';


@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor(private http: HttpClient) { }

  verifyUser(email: string): Observable<ResponseVerify> {
    return this.http.get<ResponseVerify>(`${environment.host.verifyUser}${email}`);
  }

  createDocument(document: DocumentModel) {
    return this.http.post(environment.host.createDocument, { ...document });
  }

}
