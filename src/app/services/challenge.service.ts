import { ResponsePayload } from "./../models/response-payload";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChallengeService {
  constructor(private http: HttpClient) {}

  getChallenges(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.challengeV1Url}`);
  }
}
