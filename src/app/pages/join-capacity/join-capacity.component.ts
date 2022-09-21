import { FormControl, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CapacityService } from "src/app/services/capacity.service";

@Component({
  selector: "app-join-capacity",
  templateUrl: "./join-capacity.component.html",
  styleUrls: ["./join-capacity.component.css"],
})
export class JoinCapacityComponent implements OnInit {
  formCheckCode!: FormGroup;

  constructor(private capacityService: CapacityService) {}

  ngOnInit(): void {
    this.formCheckCode = new FormGroup({
      code: new FormControl(""),
    });
  }

  handleCheckCode() {
    const { code } = this.formCheckCode.value;
    this.capacityService.checkCode(code).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log("Error", err);
      },
    );
  }
}
