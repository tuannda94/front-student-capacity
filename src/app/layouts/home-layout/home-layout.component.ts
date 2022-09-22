import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import Echo from "laravel-echo";

@Component({
  selector: "app-home-layout",
  templateUrl: "./home-layout.component.html",
  styleUrls: ["./home-layout.component.css"],
})
export class HomeLayoutComponent implements OnInit {
  user: User;
  statusWindow: boolean = false;
  statusLogin: boolean = false;
  constructor() {}

  ngOnInit(): void {
    const token = (localStorage.getItem("auth_token") as string)?.split("|")[1];
    (window as any).Echo = new Echo({
      broadcaster: "socket.io",
      host: `${window.location.protocol}//${window.location.hostname}:6001`,
      withCredentials: true,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    this.backTop();
    this.winBackTop();
    window.addEventListener("scroll", () => {
      this.winBackTop();
      this.headerBlockScroll();
    });
  }

  winBackTop() {
    let windowScroll = window.scrollY;
    if (windowScroll > 0) {
      this.statusWindow = true;
    } else {
      this.statusWindow = false;
    }
  }

  headerBlockScroll() {
    let header = document.querySelector(".header");
    if (window.scrollY > 400) {
      header?.classList.add("fixed");
    } else {
      header?.classList.remove("fixed");
      // document.getElementById = "-50px";
    }
  }

  // Change screen back top
  backTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
