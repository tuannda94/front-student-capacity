import { ResponsePayload } from "./../models/response-payload";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ResponseSubmitCode, ResponseTestCase } from "../models/challenge.model";

@Injectable({
  providedIn: "root",
})
export class ChallengeService {
  constructor(private http: HttpClient) {}

  getChallenges(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.challengeListUrl}`);
  }

  getChallenge(challenge_id: number): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.challengeListUrl}/${challenge_id}`);
  }

  // test case
  runTestCase({
    type_id,
    content,
    challengeId,
  }: {
    type_id: number;
    content: string;
    challengeId: number;
  }): Observable<ResponseTestCase[]> {
    return this.http.post<ResponseTestCase[]>(`${environment.challengeV1Url}/run-code/${challengeId}`, {
      type_id,
      content,
    });
  }

  // nộp bài
  submitCode({
    type_id,
    content,
    challengeId,
  }: {
    type_id: number;
    content: string;
    challengeId: number;
  }): Observable<ResponseSubmitCode> {
    return this.http.post<ResponseSubmitCode>(`${environment.challengeV1Url}/submit-code/${challengeId}`, {
      type_id,
      content,
    });
  }
}
