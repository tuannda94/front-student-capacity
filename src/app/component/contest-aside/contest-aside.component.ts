import { Component, Input, OnInit } from '@angular/core';
import { Contest } from 'src/app/models/contest';
import * as moment from 'moment/moment';
import { GetValueLocalService } from 'src/app/services/get-value-local.service';
import { ModalAddTeamComponent } from 'src/app/modal/modal-add-team/modal-add-team.component';
import { ModalInfoTeamComponent } from 'src/app/modal/modal-info-team/modal-info-team.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contest-aside',
  templateUrl: './contest-aside.component.html',
  styleUrls: ['./contest-aside.component.css'],
})
export class ContestAsideComponent implements OnInit {
  @Input() contestDetail: Contest;
  @Input() statusContest: boolean;
  roundEndTime: any;
  statusCheckDate: boolean = true;
  statusUserHasJoinContest: boolean = false;
  routeStateRegister: boolean = false;
  nameBtnRegister: string = 'Đăng ký';
  disabled: boolean = true;
  statusCountDown: boolean = true;
  statusComponent: boolean = false;
  date_end: number;
  date_start: number;
  date_register_start: number;
  date_register_end: number;
  today: number;

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(
    private getUserLocal: GetValueLocalService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public location: Location
  ) {}

  ngOnInit(): void {}

  runTime() {
    this.date_start = new Date(
      moment(this.contestDetail.date_start).format('lll')
    ).getTime();
    this.date_end = new Date(
      moment(this.contestDetail.register_deadline).format('lll')
    ).getTime();
    this.date_register_start = new Date(
      moment(this.contestDetail.start_register_time).format('lll')
    ).getTime();

    setInterval(() => {
      this.date_register_end = new Date(
        moment(this.contestDetail.end_register_time).format('lll')
      ).getTime();
      this.today = new Date().getTime();
      let distance = this.date_register_end - this.today;
      this.date_register_start > this.today
        ? (this.disabled = false)
        : this.disabled;

      if (
        distance < 0 ||
        this.contestDetail.status == 2 ||
        this.date_register_start > this.today
      ) {
        this.disabled = false;
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
        result = item.status_user_has_join_contest
          ? 'Đang mở đăng ký'
          : 'Đăng ký';
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
    this.statusComponent = true;
    return result;
  }

  // Class name where status
  classNameWhereStatus(item: Contest): any {
    let result;
    if (item.status <= 1) {
      if (this.date_register_start > this.today) {
        return 'my-btn-disabled my-btn-s';
      } else if (this.date_register_end > this.today) {
        result = item.status_user_has_join_contest
          ? 'my-btn-disabled my-btn-s'
          : 'my-btn-secondary my-btn-s';
      } else if (this.date_start > this.today) {
        result = 'my-btn-disabled my-btn-s';
      } else if (this.date_end > this.today) {
        result = item.status_user_has_join_contest
          ? 'my-btn-disabled my-btn-s'
          : 'my-btn-disabled my-btn-s';
      } else {
        result = 'my-btn-disabled my-btn-s';
      }
    } else {
      result = 'my-btn-disabled my-btn-s';
    }
    return result;
  }

  // Mở model thêm đội thi
  openFormRegister(): void {
    if (
      this.statusCheckDate == true &&
      this.getUserLocal.getValueLocalUser('user')
    ) {
      this.openAddTeam();
    } else {
      this.router.navigate(['./login']);
    }
  }

  // Thông tin đội
  openInfoTeam() {
    let teamId;

    this.contestDetail.teams.forEach((it: any) => {
      it.members.forEach((item: any) => {
        if (item.id == this.userService.getUserValue().id) {
          teamId = it.id;
        }
      });
    });

    this.dialog.open(ModalInfoTeamComponent, {
      width: '900px',
      data: {
        contest_id: this.contestDetail.id,
        team_id: teamId,
        max_user: this.contestDetail.max_user,
      },
    });
  }

  openAddTeam(): void {
    const dialogRef = this.dialog.open(ModalAddTeamComponent, {
      width: '490px',
      data: {
        contest_id: this.contestDetail.id,
        team_id: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }
}
