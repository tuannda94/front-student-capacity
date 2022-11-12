import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-loading-overlay",
  templateUrl: "./loading-overlay.component.html",
  styleUrls: ["./loading-overlay.component.css"],
})
export class LoadingOverlayComponent implements OnInit {
  @Input() active!: boolean;
  @Input() textLoading!: string;

  constructor() {}

  ngOnInit(): void {}
}
