import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';


@Injectable({
  providedIn: 'root'
})
export class TestCapacityService {

   constructor(private http: HttpClient) { }

    // List test năng lực
    getAllTestCapacity(): Observable<ResponsePayload> {
      return this.http.get<ResponsePayload>(`${environment.capacityListUrl}`);
    }

    getAllKeywordTrendingCapacity(): Observable<ResponsePayload> {
      return this.http.get<ResponsePayload>(`${environment.keywordTrendingUrl}?type=2`);
    }

    getRankingByMajor(slugMajor: string, page: string | null): Observable<ResponsePayload> {
      let pageQuery =  page == null ? '1' : page;
      return this.http.get<ResponsePayload>(`${environment.RankCapacityUrl}/${slugMajor}?page=${pageQuery}`);
    }

    // Lọc Capacity
    filterCapacity(keyword:string | null , major_id: number | null | string = null ,  skill: string |number | null = null):Observable<ResponsePayload>{
      let keywordQuery =  keyword == null ? '' : keyword;
      let majorChange =  major_id == null ? '' : major_id;
      let skillChange = skill == null ? '' : skill;
      return this.http.get<ResponsePayload>(`${environment.capacityListUrl}?q=${keyword}&major_id=${majorChange}&skill_id=${skillChange}`);
    }

    paginationCapacity(url: string ):Observable<ResponsePayload>{
      return this.http.get<ResponsePayload>(url);
    }

    getBannerCapacity():Observable<ResponsePayload>{
      return this.http.get<ResponsePayload>(`${environment.sliderListUrl}?capacity=1`);
    }
}
