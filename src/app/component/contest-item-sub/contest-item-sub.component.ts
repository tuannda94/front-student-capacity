import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormatDatePipe } from 'src/app/helper/pipe/format-date.pipe';
import { Contest } from 'src/app/models/contest';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contest-item-sub',
  templateUrl: './contest-item-sub.component.html',
  styleUrls: ['./contest-item-sub.component.css'],
})
export class ContestItemSubComponent implements OnInit {
  @Input() contestItem: Contest;
  @Input() status: number;
  date_end: number;
  date_start: number;
  date_register_start: number;
  date_register_end: number;
  today: number;
  checkUserHasLogin: boolean = false;
  disabled: boolean = true;
  statusCountDown: boolean = true;

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserValue().id != undefined
      ? (this.checkUserHasLogin = true)
      : this.checkUserHasLogin;

    this.date_start = new Date(
      moment(this.contestItem.date_start).format('lll')
    ).getTime();
    this.date_end = new Date(
      moment(this.contestItem.register_deadline).format('lll')
    ).getTime();
    this.date_register_start = new Date(
      moment(this.contestItem.start_register_time).format('lll')
    ).getTime();

    setInterval(() => {
      this.date_register_end = new Date(
        moment(this.contestItem.end_register_time).format('lll')
      ).getTime();
      this.today = new Date().getTime();
      let distance = this.date_register_end - this.today;
      this.date_register_start > this.today
        ? (this.disabled = false)
        : this.disabled;

      if (
        distance < 0 ||
        this.contestItem.status == 2 ||
        this.date_register_start > this.today
      ) {
        this.statusCountDown = false;
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      } else {
        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
    }, 1000);
  }

  // Check trạng thái
  checkStatusContest(item: Contest): any {
    let result;
    if (item.status <= 1) {
      if (this.date_register_start > this.today) {
        result = 'Sắp diễn ra';
      } else if (this.date_register_end > this.today) {
        result = item.status_user_has_join_contest ? 'Đã tham gia' : 'Đăng ký';
      } else if (this.date_start > this.today) {
        result = 'Đã đóng đăng ký';
      } else if (this.date_end > this.today) {
        result = item.status_user_has_join_contest
          ? 'Đã tham gia'
          : 'Đang diễn ra';
      } else if (this.today > this.date_end) {
        result = 'Đã diễn ra';
      }
    } else {
      result = 'Đã kết thúc';
    }
    return result;
  }

  // Class name where status
  classNameWhereStatus(item: Contest): any {
    let result;
    if (item.status <= 1) {
      if (this.date_register_start > this.today) {
        return 'btn-main btn';
      } else if (this.date_register_end > this.today) {
        result = item.status_user_has_join_contest
          ? 'btn btn-success'
          : 'btn-main btn';
      } else if (this.date_start > this.today) {
        result = 'btn btn-danger border-2 border-danger text-white';
      } else if (this.date_end > this.today) {
        result = item.status_user_has_join_contest
          ? 'btn btn-success'
          : 'btn-main btn';
      } else {
        result = 'btn-main btn';
      }
    } else {
      result = 'btn btn-danger border-2 border-danger text-white';
    }
    return result;
  }

  // Check date cuộc thi
  checkDateContest(item: Contest) {
    let result;
    if (item.status <= 1) {
      if (this.date_start > this.today) {
        result = 'Ngày đóng :' + this.formatDate(item.end_register_time);
      }else if (this.today > this.date_end) {
        result = 'Ngày kết thúc :' + this.formatDate(item.register_deadline);
      }else if (this.date_end > this.today) {
        result = item.status_user_has_join_contest
        result = 'Ngày kết thúc :' + this.formatDate(item.register_deadline);
      }
    } else {
      result = 'Ngày kết thúc :' + this.formatDate(item.register_deadline);
    }
    return result;
  }


  //Chỉnh sửa chuỗi
  formatDate(value: any): string {
    let date = moment(value).format("DD/MM/YYYY");
    let arrDate = date.split(" ");
    return `${arrDate[0]}`;
  }
}
