import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }

  getlistWish(type: string){
    return this.http.get<ResponsePayload>(`${environment.wishListV1Url}/user?type=${type}&key=0`);
  }

  wishListAdd(data : Object){
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.wishListV1Url}/add` ,  data ,{
      headers: headers
    });
  }

  wishListRemove(data : Object){
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.wishListV1Url}/remove` ,  data ,{
      headers: headers
    });
  }
}
