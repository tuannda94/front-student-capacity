import { Component, OnInit } from "@angular/core";
import { Challenge } from "src/app/models/challenge.model";
import { ChallengeService } from "src/app/services/challenge.service";

@Component({
  selector: "app-challenge",
  templateUrl: "./challenge.component.html",
  styleUrls: ["./challenge.component.css"],
})
export class ChallengeComponent implements OnInit {
  challenges!: Challenge[];

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.getChallenges();
  }

  getChallenges() {
    this.challengeService.getChallenges().subscribe((res) => {
      if (res.status) {
        this.challenges = res.payload;
        console.log(this.challenges);
      }
    });
  }
}
