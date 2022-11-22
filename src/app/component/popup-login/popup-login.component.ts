import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
  selector: "app-popup-login",
  templateUrl: "./popup-login.component.html",
  styleUrls: ["./popup-login.component.css"],
})
export class PopupLoginComponent implements OnInit {
  @Input() activePopup: boolean;
  @Output() backStatusLogin = new EventEmitter<boolean>();

  constructor(private router: Router, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const popup = document.querySelector(".popup-content-box");
    const overLay = document.querySelector(".over-lay");
    if (this.activePopup) {
      popup?.classList.add("open-popup-active");
      overLay?.classList.remove("d-none");
    }

    this.localStorageService.setIsPopup(0);

    this.localStorageService.watchStoragePopup().subscribe((data) => {
      if (data == 1) {
        const popup = document.querySelector(".popup-content-box");
        const overLay = document.querySelector(".over-lay");
        popup?.classList.add("open-popup-active");
        overLay?.classList.remove("d-none");
      }
    });
  }

  closePopup(status: boolean) {
    const popup = document.querySelector(".popup-content-box");
    const overLay = document.querySelector(".over-lay");
    popup?.classList.remove("open-popup-active");
    overLay?.classList.add("d-none");
    this.backStatusLogin.emit(false);

    if (status) {
      // handle save current route name
      this.localStorageService.saveCurrentRoute();

      this.router.navigate(["/login"]);
    }
  }
}
