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
  limitLangs = 4;

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.getChallenges();
  }

  getChallenges() {
    this.challengeService.getChallenges().subscribe((res) => {
      if (res.status) {
        this.challenges = res.payload.map((item: Challenge) => {
          // ds ngôn ngữ code
          const codeLangs = item.sample_code.map((sampleItem) => sampleItem.code_language);

          // tooltip khi vượt quá limit
          let tooltipLang = "";
          if (codeLangs.length > this.limitLangs) {
            tooltipLang = codeLangs
              .slice(this.limitLangs)
              .map((x) => x.ex.toUpperCase())
              .join(", ");
          }

          return {
            ...item,
            tooltipLang,
            codeLangs,
          };
        });
      }
    });
  }

  // get mức độ thử thách
  getTypeChallenge(type: number): string {
    switch (type) {
      case 0:
        return "Mức độ dễ";
      case 1:
        return "Mức độ trung bình";
      case 2:
        return "Mức độ khó";
      default:
        return "Lỗi";
    }
  }
}
