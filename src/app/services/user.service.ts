import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Contest} from '../models/contest';
import {ResponsePayload} from '../models/response-payload';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User>;
  private jwtToken: BehaviorSubject<string>;
  public user: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.jwtToken = new BehaviorSubject<string>(localStorage.getItem('auth_token') || "");
    this.user = this.userSubject.asObservable();
  }

  public getUserValue() {
    return this.userSubject.value;
  }

  public getJwtToken() {
    return this.jwtToken.value;
  }

  login(data: {
    token: string,
    campus_code: string,
  }) {
    return this.http.post<ResponsePayload>(environment.loginUrl, data)
      .pipe(map(response => {
        if (response.status == true) {
          let dataUser = response.payload!.user;
          if (dataUser.avatar == null) {
            dataUser.avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
          }
          ;
          localStorage.setItem("user", JSON.stringify(response.payload!.user));
          localStorage.setItem("avatar", JSON.stringify(dataUser.avatar));
          localStorage.setItem('auth_token', response.payload!.token);
          localStorage.setItem('token_type', JSON.stringify(response.payload!.token_type));
          this.userSubject.next(response.payload.user);
          this.jwtToken.next(response.payload.token);
        }

        return response.status;
      }));
  }

  // Update localStorageHasEdit
  setLocalStorageHasEdit(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token_type')
    this.userSubject.next(JSON.parse('{}'));
    this.jwtToken.next("");
    this.router.navigate(['/login']);
  }

  listUser(): Observable<Array<User>> {
    return this.http.get<Array<User>>(environment.userListUrl);
  }

  //  Các cuộc thi mà user đã tham gia
  getContestByUser(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined?sort=desc`)
  }

  // Lộc cuộc thi đã tham gia theo trạng thái
  getContestByUserStatus(key_word: string, status: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined-1?status=${status}&q=${key_word}`);
  }

  // Chỉnh sửa thông tin user
  editInfoUser(data: any): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.userListUrl}/edit`, data);
  }
}
