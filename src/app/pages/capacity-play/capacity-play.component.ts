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
    });
  }
}
