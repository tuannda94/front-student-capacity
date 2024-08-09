import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';
import { faQq } from '@fortawesome/free-brands-svg-icons';

@Injectable({
    providedIn: 'root'
})
export class QAService {

    constructor(private http: HttpClient) { }

    getQAInternship(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/internship`);
    }

    getQAJob(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/job`);
    }

    getQAEvent(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/event`);
    }

    getQADetail(faq: any): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/detail/${faq}`);
    }

    getRelated(faq: any): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/related/${faq}`);
    }

    rating(faq: any, data: any): Observable<ResponsePayload> {
        return this.http.post<ResponsePayload>(`${environment.qaUrl}/rate/${faq}`, data);
    }
}
