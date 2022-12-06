import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-submit-challenge-success",
  templateUrl: "./modal-submit-challenge-success.component.html",
  styleUrls: ["./modal-submit-challenge-success.component.css"],
})
export class ModalSubmitChallengeSuccessComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalSubmitChallengeSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}
}
