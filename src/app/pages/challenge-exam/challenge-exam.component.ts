import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-challenge-exam",
  templateUrl: "./challenge-exam.component.html",
  styleUrls: ["./challenge-exam.component.css"],
})
export class ChallengeExamComponent implements OnInit {
  isFullScreen = false;

  editorOptions = {
    theme: "vs-dark",
    language: "javascript",
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  };
  code: string = '\nfunction x() {\nconsole.log("Hello world!");\n}';

  constructor() {}

  ngOnInit(): void {}

  // đóng mở full màn hình editor
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }
}
