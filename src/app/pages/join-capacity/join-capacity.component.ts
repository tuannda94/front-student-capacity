import { UserService } from "src/app/services/user.service";
import { NgToastService } from "ng-angular-popup";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CapacityService } from "src/app/services/capacity.service";
import { Router } from "@angular/router";

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
  ) {}

  ngOnInit(): void {
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
      return this.toastService.info({ summary: "Vui lòng nhập mã code" });
    }

    this.isCheckCode = true;
    this.capacityService.checkCode(code).subscribe(
      () => {
        this.router.navigate(["/capacity-play", code]);
      },
      (err) => {
        this.toastService.warning({ summary: err });
        this.isCheckCode = false;
      },
    );
  }
}
