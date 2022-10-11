import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest } from 'src/app/models/contest';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contest-user-join',
  templateUrl: './contest-user-join.component.html',
  styleUrls: ['./contest-user-join.component.css'],
})
export class ContestUserJoinComponent implements OnInit {
  listContestByUser: Array<Contest>;
  statusListContests: boolean = false;
  valueStatus: string = '';
  keyword: string = '';
  orderObj: any;

  constructor(private usersService: UserService, private router: Router ,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.orderObj = { ...params };
    });


    if (this.orderObj.params) {
      this.keyword = this.orderObj.params.keyword
        ? this.orderObj.params.keyword
        : '';
      this.valueStatus = this.orderObj.params.status
        ? this.orderObj.params.status
        : '';
    }
    this.filterContest();
  }

  // Locj theo trạng thái cuộc thi
  filterWhereStatus(event: any) {
    this.statusListContests = false;
    this.valueStatus = event.target.value;
    this.filterContest();
  }

  //  Tìm kiếm cuộc thi
  filterContestSearch() {
    this.statusListContests = false;
    this.keyword;
    this.filterContest();
  }

  setValueSearch(event: any) {
    this.keyword = event.target.value;
  }

  // Dungf chung chung cho chức năng lọc
  filterContest() {
    if (this.valueStatus || this.keyword) {
      this.router.navigate(['/tai-khoan/cuoc-thi-da-tham-gia'], {
        queryParams: {
          status: this.valueStatus,
          keyword: this.keyword,
        },
        queryParamsHandling: 'merge',
      });
    }
    this.usersService
      .getContestByUserStatus(this.keyword, this.valueStatus)
      .subscribe((res) => {
        if (res.status){
          this.listContestByUser = res.payload.data;          
        };
        if (this.listContestByUser) {
          this.statusListContests = true;
        }
      });
  }
}
