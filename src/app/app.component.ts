import { Component } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgToastService } from "ng-angular-popup";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "front";
  windowScroll: boolean = false;
  weixin = ["fab", "weixin"];
  phone = ["fas", "phone"];
  constructor(library: FaIconLibrary, private toast: NgToastService) {
    library.addIconPacks(fas);
    this.toast.success({ detail: "SUCCESS", summary: "Your Success Message", duration: 1000 });
  }
}
