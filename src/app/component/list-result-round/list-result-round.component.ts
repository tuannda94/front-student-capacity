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
  @Input() links: Array<any>;
  @Input() next: string;
  @Input() prev: string;
  @Input() total: number;
  @Input() statusLinks: boolean;

  @Output() payingResult = new EventEmitter<string>();
  @Output() payingResultSort = new EventEmitter<boolean>();
  page: any = 1;
  resultRoundAll: Array<ResultRound>;
  i = 1;
  statusSort: boolean = true;
  isSearch: boolean = false;

  constructor(
    private configFunctionService: ConfigFunctionService,
    private roundService: RoundService
  ) {}

  ngOnInit(): void {
    this.getAllResult(this.total);
  }

  searchCheckIndex(id: number) {
    let ind;
    this.resultRoundAll.forEach((item: ResultRound, index: number) => {
      if (item.id == id) {
        ind = index + 1;
      }
    });
    return ind;
  }

  searchResult(event: any) {
    this.statusLinks = false;
    this.isSearch = true;
    if (event.target.value !== '') {
      this.roundResult = this.resultRoundAll.filter(
        (item: ResultRound, index: number) => {
          return (
            this.configFunctionService
              .changeString(item.team.name)
              .includes(
                this.configFunctionService.changeString(event.target.value)
              ) && index < 6
          );
        }
      );

      this.roundResult ? (this.statusLinks = true) : null;
    } else {
      this.statusLinks = false;
      this.getAllResult(6);
    }
  }

  getAllResult(limit: number) {
    this.roundService
      .getResultRound(this.roundResult[0].round_id, 'desc', limit)
      .subscribe((res) => {
        if (res.status) {
          if (limit == 6) {
            this.roundResult = res.payload.data;
            this.statusLinks = true;
            this.links = res.payload.links;
            this.next = res.payload.next_page_url;
            this.prev = res.payload.prev_page_url;
            this.links.pop();
            this.links.shift();
            this.isSearch = false;
          } else {
            this.resultRoundAll = res.payload.data;
          }
        }
      });
  }

  payingResultEvent(url: string) {
    this.page = url.split('=')[url.split('=').length - 1];
    console.log(this.page);
    if (url) {
      this.payingResult.emit(url);
    }
  }

  payingResultEventSort() {
    this.page = 1;
    if (this.statusSort) {
      this.statusSort = false;
    } else {
      this.statusSort = true;
    }
    this.payingResultSort.emit(this.statusSort);
  }
}
