import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-capacity-play",
  templateUrl: "./capacity-play.component.html",
  styleUrls: ["./capacity-play.component.css"],
})
export class CapacityPlayComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const { code } = params;
      console.log("Params", code);

      (window as any).Echo.join("room." + code)
        .here((users: any) => {
          console.log("User online ", users); // Chạy lần đầu tiên
        })
        .joining((user: any) => {
          console.log("User joining", user); // User  khác tham gia sẽ chạy hàm này
        })
        .leaving((user: any) => {
          console.log("User leave ", user); //  User thoát phòng
        })
        .listen("PersenChannel", function (data: any) {
          console.log(data); // Lắng nghe sự kiện
        });
    });
  }
}
