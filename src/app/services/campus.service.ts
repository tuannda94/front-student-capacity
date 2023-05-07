import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  constructor(private http: HttpClient) { }

  getListCampus(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.campusListUrl}`);
  }
}
