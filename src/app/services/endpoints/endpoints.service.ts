import { Host, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseVerify } from 'src/app/utils/models/responseVerify';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor(private http: HttpClient) { }

  verifyUser(email: string): Observable<ResponseVerify> {
    return this.http.get<ResponseVerify>(`${environment.host.verifyUser}${email}`);
  }

  createDocument(document: object): Observable<object> {
    return this.http.post(environment.host.createDocument, { ...document });
  }

}
