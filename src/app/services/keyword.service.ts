import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor(private http: HttpClient) { }


  getKeywordWhereType(type: number): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.keywordListUrl}?type=${type}`);
  }
}
