import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { GetValueLocalService } from "src/app/services/get-value-local.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  user: User;
  statusWindow: boolean = false;
  constructor(private userInfo: GetValueLocalService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((data) => {
      this.user = data!;
    });

    this.user = this.userInfo.getValueLocalUser("user");
    this.saveUrlCurrent();
  }

  closeMenuRes(element: HTMLElement) {
    console.log(element);
    element.removeAttribute("checked");
  }

  // LogOut
  logOut() {
    localStorage.clear();
    this.ngOnInit();
    this.userService.logout();
    // window.location.reload();
  }

  // Save url login
  saveUrlCurrent() {
    const urlCurrent = window.location.pathname;
    localStorage.setItem("url-current", urlCurrent);
  }
}
