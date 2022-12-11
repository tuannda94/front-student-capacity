import { jwtApiUrl } from "./../../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ResponsePayload } from "../models/response-payload";
import { ResponseCapacityHistory } from "../models/capacity";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CapacityService {
  constructor(private http: HttpClient) {}

  // đánh giá năng lực theo id
  getWhereId(id: number): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.capacityListUrl}/${id}`);
  }

  // bài đánh giá liên quan
  getRelated({ capacity_id, ...args }: any): Observable<ResponsePayload> {
    const params = new HttpParams({
      fromObject: {
        ...args,
      },
    });
    return this.http.get<ResponsePayload>(`${environment.capacityListUrl}/${capacity_id}/related`, {
      params,
    });
  }

  // lịch sử làm bài
  getHistoryExam(capacity_id: number): Observable<ResponseCapacityHistory> {
    return this.http.post<ResponseCapacityHistory>(`${environment.takeExamUrl}/student-capacity-history`, {
      result_capacity_id: capacity_id,
    });
  }

  // real time
  checkCode(code: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${jwtApiUrl}/auth-room-play/${code}`);
  }

  connectRoom(code: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${jwtApiUrl}/connect-room/${code}`);
  }

  submitCode(code: string, data: any): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${jwtApiUrl}/sumit-room/${code}`, data);
  }

  nextSubmitCode(code: string, data: any): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${jwtApiUrl}/next-sumit-room/${code}`, data);
  }
}
