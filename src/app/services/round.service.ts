import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  // getInfoCapacityExamRound() {
  //   // status: 1 - đang làm, 2 - đã nộp
  //   const response = {
  //     status: true,
  //     payload: {
  //       created_at: new Date(),
  //       questions: [
  //         {
  //           id: 17,
  //           created_at: "1 tuần trước",
  //           updated_at: "1 tuần trước",
  //           content: "<p>Thông thường tiêu chuẩn Internet cho việc đặt tên trang chủ, hay trang đầu tiên mà người dùng truy&nbsp; cập vào website sẽ là</p>",
  //           status: 1,
  //           deleted_at: null,
  //           type: 0,
  //           rank: 0,
  //           pivot: {
  //             exam_id: 2,
  //             question_id: 17
  //           },
  //           answers: [
  //             {
  //               id: 93,
  //               created_at: "2022-06-15T09:27:43.000000Z",
  //               updated_at: "2022-06-15T09:27:43.000000Z",
  //               question_id: 17,
  //               deleted_at: null,
  //               content: "Bất kì tên nào",
  //               is_correct: 0
  //             },
  //             {
  //               id: 94,
  //               created_at: "2022-06-15T09:27:44.000000Z",
  //               updated_at: "2022-06-15T09:27:44.000000Z",
  //               question_id: 17,
  //               deleted_at: null,
  //               content: "index.html",
  //               is_correct: 0
  //             },
  //             {
  //               id: 95,
  //               created_at: "2022-06-15T09:27:44.000000Z",
  //               updated_at: "2022-06-15T09:27:44.000000Z",
  //               question_id: 17,
  //               deleted_at: null,
  //               content: "home.html",
  //               is_correct: 1
  //             },
  //             {
  //               id: 96,
  //               created_at: "2022-06-15T09:27:44.000000Z",
  //               updated_at: "2022-06-15T09:27:44.000000Z",
  //               question_id: 17,
  //               deleted_at: null,
  //               content: "default.html",
  //               is_correct: 0
  //             }
  //           ]
  //         },
  //         {
  //           id: 18,
  //           created_at: "1 tuần trước",
  //           updated_at: "1 tuần trước",
  //           content: "<p>Giao thức nào là giao thức truyền tải siêu văn bản được dùng giữa Web client và Web server</p>",
  //           status: 1,
  //           deleted_at: null,
  //           type: 0,
  //           rank: 0,
  //           pivot: {
  //             exam_id: 2,
  //             question_id: 18
  //           },
  //           answers: [
  //             {
  //               id: 97,
  //               created_at: "2022-06-15T09:28:25.000000Z",
  //               updated_at: "2022-06-15T09:28:25.000000Z",
  //               question_id: 18,
  //               deleted_at: null,
  //               content: "WWW",
  //               is_correct: 0
  //             },
  //             {
  //               id: 98,
  //               created_at: "2022-06-15T09:28:25.000000Z",
  //               updated_at: "2022-06-15T09:28:25.000000Z",
  //               question_id: 18,
  //               deleted_at: null,
  //               content: "HTTP",
  //               is_correct: 1
  //             },
  //             {
  //               id: 99,
  //               created_at: "2022-06-15T09:28:25.000000Z",
  //               updated_at: "2022-06-15T09:28:25.000000Z",
  //               question_id: 18,
  //               deleted_at: null,
  //               content: "FTP",
  //               is_correct: 0
  //             },
  //             {
  //               id: 100,
  //               created_at: "2022-06-15T09:28:25.000000Z",
  //               updated_at: "2022-06-15T09:28:25.000000Z",
  //               question_id: 18,
  //               deleted_at: null,
  //               content: "TCP/IP",
  //               is_correct: 0
  //             }
  //           ]
  //         },
  //         {
  //           id: 19,
  //           created_at: "1 tuần trước",
  //           updated_at: "1 tuần trước",
  //           content: "<p>Mã mầu trong các trang HTML gồm 6 kí tự và đứng trước là dấu thăng (#) sử dụng hệ cơ số nào?</p>",
  //           status: 1,
  //           deleted_at: null,
  //           type: 0,
  //           rank: 0,
  //           pivot: {
  //             exam_id: 2,
  //             question_id: 19
  //           },
  //           answers: [
  //             {
  //               id: 101,
  //               created_at: "2022-06-15T09:28:52.000000Z",
  //               updated_at: "2022-06-15T09:28:52.000000Z",
  //               question_id: 19,
  //               deleted_at: null,
  //               content: "Hệ nhị phân",
  //               is_correct: 0
  //             },
  //             {
  //               id: 102,
  //               created_at: "2022-06-15T09:28:52.000000Z",
  //               updated_at: "2022-06-15T09:28:52.000000Z",
  //               question_id: 19,
  //               deleted_at: null,
  //               content: "Hệ thập lục phân (Hecxa)",
  //               is_correct: 1
  //             },
  //             {
  //               id: 103,
  //               created_at: "2022-06-15T09:28:52.000000Z",
  //               updated_at: "2022-06-15T09:28:52.000000Z",
  //               question_id: 19,
  //               deleted_at: null,
  //               content: "Hệ thập phân",
  //               is_correct: 0
  //             },
  //             {
  //               id: 104,
  //               created_at: "2022-06-15T09:28:52.000000Z",
  //               updated_at: "2022-06-15T09:28:52.000000Z",
  //               question_id: 19,
  //               deleted_at: null,
  //               content: "Hệ BCD nén",
  //               is_correct: 0
  //             }
  //           ]
  //         }
  //       ],
  //       status: 1,
  //       time: 10,
  //       time_type: 0
  //     }
  //   }
  //
  //   return response;
  // }
  // getInfoCapacityExamRound(round_id: any): Observable<ResponsePayload> {
  //   // status: 1 - đang làm, 2 - đã nộp
  //   return this.http.get<ResponsePayload>(`${environment.examUrl}/get-by-round/${round_id}`);
  // }
  getInfoCapacityExamRound(round_id: any): Observable<ResponsePayload> {
    // status: 1 - đang làm, 2 - đã nộp
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/student-capacity`, {round_id});
  }

  // Sinh viên nộp bài
  submitExam(resultExam: Object): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/student-capacity-submit`, resultExam);
  }

  // Trả kết quả của vòng thi
  getResultRound(round_id: number) {
    console.log(round_id);
    return this.http.get<ResponsePayload>(`${environment.publicApiUrl}/contest/round/${round_id}/result`)
  }

  // Trả về trạng thái của vòng thi (Đang - đã - chưa làm)
  getStudentCapacityStatus(round_id: number): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/check-student-capacity`, {round_id});
  }

  // Trả về bài đánh giá năng lực
  getStudentCapacity(round_id: number): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.takeExamUrl}/student-capacity`, {round_id});
  }
}
