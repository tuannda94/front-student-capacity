import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Challenge } from "src/app/models/challenge.model";
import { ChallengeService } from "src/app/services/challenge.service";

@Component({
  selector: "app-challenge",
  templateUrl: "./challenge.component.html",
  styleUrls: ["./challenge.component.css"],
})
export class ChallengeComponent implements OnInit {
  challenges!: Challenge[];
  totalChallenge!: number;
  limitLangs = 4;
  isFetchingChallenge!: boolean;
  params: { page: number; limit: number } = {
    page: 1,
    limit: 10,
  };

  constructor(private challengeService: ChallengeService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle("Thử thách");

    this.handleScrollTop();
    this.getChallenges();
  }

  getChallenges() {
    this.isFetchingChallenge = true;

    this.challengeService.getChallenges(this.params).subscribe((res) => {
      this.isFetchingChallenge = false;

      if (res.status) {
        this.totalChallenge = res.payload.total;
        this.challenges = res.payload.data.map((item: Challenge) => {
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

  // xử lý chuyển trang
  handleChangePageNum(page: number) {
    this.handleScrollTop();
    this.params.page = page;
    this.getChallenges();
  }

  // scroll to top
  handleScrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
