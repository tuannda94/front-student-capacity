import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class ChatSupportService {
  constructor(private http: HttpClient) {}

  sendDataChat(data: any): any {
    return this.http.post<any>(`${environment.v1ApiUrl}/fake-post`, data);
  }
}
