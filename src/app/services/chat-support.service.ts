import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { jwtApiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ChatSupportService {
  constructor(private http: HttpClient) {}

  sendDataChat(data: any): Observable<any> {
    return this.http.post<any>(`${jwtApiUrl}/fake-post`, data);
  }
}
