import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResultRound } from 'src/app/models/result-round.model';
import { Round } from 'src/app/models/round.model';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { ContestService } from 'src/app/services/contest.service';
import { RoundService } from 'src/app/services/round.service';

@Component({
  selector: 'app-list-result-round',
  templateUrl: './list-result-round.component.html',
  styleUrls: ['./list-result-round.component.css'],
})
export class ListResultRoundComponent implements OnInit {
  @Input() roundResult: Array<ResultRound>;

  dataResultRound: Array<ResultRound>;
  statusResultRound: boolean = false;
  payingLinks: Array<any>;
  pages: number = 1;
  checkTeamPoint: boolean = false;
  resPayLoad: any;
  titleResult: string = 'Kết quả chung cuộc';
  constructor(
    private roundService: RoundService,
    private configFunctionService: ConfigFunctionService,
    private contestService: ContestService
  ) {}

  ngOnInit(): void {
    console.log(this.roundResult);
  }

  sortRankTeam(result_id: number): number {
    return this.configFunctionService.indexTable(
      result_id,
      this.dataResultRound,
      this.pages,
      10
    );
  }

  displayedColumns: string[] = ['rank', 'avatar', 'name', 'total-point'];

  // Phân trang theo link
  payingPage(link: any, pages: any) {
    this.statusResultRound = false;
    this.pages = pages;

    this.contestService.getContestWherePage(link).subscribe((res) => {
      if (res.status) {
        this.dataResultRound = res.payload.data;
        this.payingLinks = this.editLink(res.payload.links);
        this.dataResultRound
          ? (this.statusResultRound = true)
          : this.statusResultRound;
      }
    });
  }

  //Sửa mảng link payingLink
  editLink(arr: any) {
    return arr.filter((item: any, index: any) => {
      return index != 0 && index != arr.length - 1;
    });
  }

  // Kiểm tra xem đã có kế quả cho tường đọi chưa
  checkPointTeamNotNull(data: Array<ResultRound>) {
    data.forEach((item) => {
      item.result.point != null
        ? (this.checkTeamPoint = true)
        : this.checkTeamPoint;
    });
  }
}
