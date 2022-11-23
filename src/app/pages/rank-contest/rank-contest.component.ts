import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Contest } from "src/app/models/contest";
import { ResultRound } from "src/app/models/result-round.model";
import { Round } from "src/app/models/round.model";
import { ConfigFunctionService } from "src/app/services/config-function.service";
import { ContestService } from "src/app/services/contest.service";
import { RoundService } from "src/app/services/round.service";

@Component({
  selector: "app-rank-contest",
  templateUrl: "./rank-contest.component.html",
  styleUrls: ["./rank-contest.component.css"],
})
export class RankContestComponent implements OnInit {
  constructor(
    private contestService: ContestService,
    private configFunctionService: ConfigFunctionService,
    private roundService: RoundService,
    private title: Title,
  ) {}
  contests: Array<Contest>;
  rounds: Array<Round>;
  rankContest: Array<ResultRound> = [];
  linkContests: Array<any>;
  statusRankContest: boolean = false;
  roundId: number;
  roundName: string;
  statusRounds: boolean = false;

  ngOnInit(): void {
    this.title.setTitle("Xếp hạng cuộc thi");
    this.getAllContest();
  }

  formFilter = new FormGroup({
    filterContest: new FormControl(""),
    filterRound: new FormControl(""),
    filterName: new FormControl(""),
  });

  getAllContest() {
    this.contestService.getAllContestRank().subscribe((res) => {
      if (res.status) {
        this.contests = res.payload;
        console.log(this.contests);

        this.getRoundWhereContestId(
          this.contests[this.contests.length - 1].id,
          this.contests[this.contests.length - 1].name,
        );
      }
    });
  }

  getRoundWhereContestId(contestId: number, contestName: string) {
    this.statusRankContest = false;
    this.formFilter.controls["filterContest"].setValue(contestName);
    this.contestService.getWhereId(contestId).subscribe((res) => {
      if (res.status) {
        this.rounds = res.payload.rounds;
        this.statusRounds = true;
        this.getRankRoundContest(this.rounds[0].id, "desc", this.rounds[0].name);
      }
    });
  }

  getRankRoundContest(roundId: number, sort: string, roundName: string) {
    this.statusRounds = false;
    this.roundId = roundId;
    this.roundName = roundName;
    this.formFilter.controls["filterRound"].setValue(roundName);
    this.roundService.getResultRound(roundId, sort, 100).subscribe((res) => {
      if (res.status) {
        this.statusRounds = true;
        this.statusRankContest = true;
        this.rankContest = res.payload.data;
      }
    });
  }

  searchNameTeam(event: any) {
    if (event.target.value !== "") {
      this.rankContest = this.rankContest.filter((item: ResultRound, index: number) => {
        return this.configFunctionService
          .changeString(item.team.name)
          .includes(this.configFunctionService.changeString(event.target.value));
      });
    } else {
      this.getRankRoundContest(this.roundId, "desc", this.roundName);
    }
  }
}
