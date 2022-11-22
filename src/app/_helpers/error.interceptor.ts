import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          // auto logout if 401 response returned from api
          this.localStorageService.saveCurrentRoute();
          this.userService.logout();
          this.router.navigate(["/login"]);
        }

        const error = err.error.message || err.statusText;

        return throwError(error);
      }),
    );
  }
}
