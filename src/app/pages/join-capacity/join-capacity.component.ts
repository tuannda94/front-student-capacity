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

  constructor(private capacityService: CapacityService, private router: Router) {}

  ngOnInit(): void {
    this.formCheckCode = new FormGroup({
      code: new FormControl(""),
    });
  }

  handleCheckCode() {
    const { code } = this.formCheckCode.value;
    this.capacityService.checkCode(code).subscribe(
      (res) => {
        console.log("Code đúng");
        this.router.navigate(["/capacity-play", code]);
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
