import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentsService {

  constructor(private http: HttpClient) { }
  getAll() : Observable<ResponsePayload>  {
    return this.http.get<ResponsePayload>(`${environment.recruitment}`);
  }

  // Gọi ra tất cả các đặt tuyển dụng
  getAllRecruitment(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.recruitment}`);
  }

  // search recruitment
  filterRecruitmentSkill(skill: number): Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.recruitment}?skill_id=${skill}`);
  }

  // Chi tiết một đợt tuyển dụng
  getRecruitmentDetail(recruitment_id: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.recruitment}/${recruitment_id}`);
  }

  //  Filter recruitment
  filterRecruitment(keyword:string , major_id: any = '' , status: string , skill:any = ''):Observable<ResponsePayload>{
    const params = new HttpParams()
    .set('keyword', keyword)
    .set('recruitmentHot', status)
    .set('skill_id', skill)
    .set('major_id', major_id)
    return this.http.get<ResponsePayload>(`${environment.recruitment}?${params}`);
  }
}
