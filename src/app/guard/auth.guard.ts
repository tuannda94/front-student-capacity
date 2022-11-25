import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.userService.getUserValue();
    const jwtToken = this.userService.getJwtToken();
    const isLogged = user && jwtToken;

    if (isLogged) {
      return true;
    }

    this.router.navigate(["/login"]);
    return false;
  }
}
