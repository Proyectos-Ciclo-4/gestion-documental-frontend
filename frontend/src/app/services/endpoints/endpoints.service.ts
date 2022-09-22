import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseVerify } from 'src/app/utils/models/responseVerify';


@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  urlHost = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // respuesta { response: ok, id-user: 12345, rol: 700}
  verifyUser(body: any): Observable<ResponseVerify> {
    return this.http.post<ResponseVerify>(this.urlHost, { ...body });
  }

}
