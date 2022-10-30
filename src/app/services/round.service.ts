import { DataExam, ResponseCheckSttExam } from './../models/capacity';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, jwtApiUrl } from 'src/environments/environment';
import { ResponseSubmitExam } from '../models/capacity';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class RoundService {

  constructor(private http: HttpClient) { }

  getRoundWhereId(id: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(environment.roundListUrl + '/' + id);
  }

  // Get Thông tin đội thông qua id vòng thi
  getInfoTeamFromContestId(round_id: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.roundV1Url}/${round_id}/team-me`);
  }

  // Kiểm tra trạng thái user và thêm cột cho cuộc thi
  getInfoExamRound(round: Object): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/student`, round);
  }

  // check trạng thái làm bài
  getInfoCapacityExamRound(round: {}): Observable<ResponseCheckSttExam> {
    return this.http.post<ResponseCheckSttExam>(`${environment.takeExamUrl}/check-student-capacity`, round);
  }

  // sinh viên làm bài
  takeExam(round: { round_id: number }): Observable<{status: boolean, payload: any, exam_at: Date}> {
    return this.http.post<{status: boolean, payload: any, exam_at: Date}>(`${environment.takeExamUrl}/student-capacity`, round);
  }

  // nộp bài test năng lực
  capacitySubmitExam(data: DataExam): Observable<ResponseSubmitExam> {
    return this.http.post<ResponseSubmitExam>(`${environment.takeExamUrl}/student-capacity-submit`, data)
  }

  // Sinh viên nộp bài 
  submitExam(resultExam: Object): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/student-submit`, resultExam, {
      headers: headers
    });
  }

  // Trả kết quả của vòng thi
  getResultRound(round_id: number ,sort: string , limit : number) {
    return this.http.get<ResponsePayload>(`${environment.publicApiUrl}/contest/round/${round_id}/result?sort=${sort}&limit=${limit}`)
  }

  // Trả kết quả của vòng thi
  getResultRoundUrl(url: string) {
    return this.http.get<ResponsePayload>(url);
  }

  // thông tin vòng thi capacity tiếp theo
  getNextRound(capacity_id: number): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${jwtApiUrl}/get-next-round-capacity`, {
      contest_id: capacity_id
    })
  }
}
