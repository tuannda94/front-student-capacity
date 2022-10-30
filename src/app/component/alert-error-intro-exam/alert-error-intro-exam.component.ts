import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Location} from '@angular/common';
@Component({
  selector: 'app-alert-error-intro-exam',
  templateUrl: './alert-error-intro-exam.component.html',
  styleUrls: ['./alert-error-intro-exam.component.css']
})
export class AlertErrorIntroExamComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertErrorIntroExamComponent>,
    private _location: Location) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(undefined);
  }
}
