import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient) { }

  // Lấy tất cả các cơ sở
  getAll(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(environment.branchesListUrl);
  }
}
