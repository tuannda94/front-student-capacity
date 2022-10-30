import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import * as $ from "jquery";
import { WishlistService } from "src/app/services/wishlist.service";
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
  countContest: number;
  countPost: number;
  constructor(private wishlist: WishlistService) {}

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
    this.getListCount();
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

  getListCount() {
    this.wishlist.wishListCount().subscribe((res) => {
      if (res.status) {
        this.countContest = res.payload.count_post;
        this.countPost = res.payload.count_contest;
      }
    });
  }

  headerBlockScroll() {
    let header = document.querySelector(".header");
    if (window.scrollY > 400) {
      header?.classList.add("fixed");
      document.querySelector(".overlay")?.classList.add("d-none");
      document.querySelector(".sidepanel")?.classList.remove("save-info-acive");
    } else {
      header?.classList.remove("fixed");
    }
  }

  // Change screen back top
  backTop() {
    $("html , body").animate(
      {
        scrollTop: 0,
      },
      1000,
    );
  }
}
