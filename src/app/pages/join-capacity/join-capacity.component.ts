import { UserService } from "src/app/services/user.service";
import { NgToastService } from "ng-angular-popup";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CapacityService } from "src/app/services/capacity.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-join-capacity",
  templateUrl: "./join-capacity.component.html",
  styleUrls: ["./join-capacity.component.css"],
})
export class JoinCapacityComponent implements OnInit {
  formCheckCode!: FormGroup;
  isCheckCode = false;

  constructor(
    private capacityService: CapacityService,
    private router: Router,
    private toastService: NgToastService,
    private userService: UserService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Nhập mã trò chơi");

    this.formCheckCode = new FormGroup({
      code: new FormControl(""),
    });
  }

  handleCheckCode() {
    const user = this.userService.getUserValue();
    const jwtToken = this.userService.getJwtToken();
    const isLogged = user && jwtToken;
    if (!isLogged) {
      this.toastService.info({ summary: "Vui lòng đăng nhập trước khi tham gia trò chơi!" });
      return this.router.navigate(["/login"]);
    }

    const { code } = this.formCheckCode.value;
    if (!code.trim()) {
      return this.toastService.info({ summary: "Vui lòng nhập mã code", detail: "Thông báo" });
    }

    this.isCheckCode = true;
    this.capacityService.checkCode(code).subscribe(
      () => {
        this.router.navigate(["/capacity-play", code]);
      },
      (err) => {
        this.toastService.warning({ summary: err, detail: "Lỗi" });
        this.isCheckCode = false;
      },
    );
  }
}
