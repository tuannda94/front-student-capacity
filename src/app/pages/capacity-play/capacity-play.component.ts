import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CapacityService } from 'src/app/services/capacity.service';

@Component({
  selector: 'app-capacity-play',
  templateUrl: './capacity-play.component.html',
  styleUrls: ['./capacity-play.component.css'],
})
export class CapacityPlayComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private capacityService: CapacityService
  ) {}
  users: any = [];
  flagStart: any = false;
  flagEnd: any = false;
  question: any = {};
  answers: any = [];
  usersRanks: any = [];
  userRank: any = [];
  rank: any = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const { code } = params;
      const that = this;
      this.capacityService.connectRoom(code).subscribe(
        (res: any) => {
          that.userRank = res.payload.rank;
          that.usersRanks = res.payload.ranks;
          that.renderRankUser();
          if (res.payload.exam.status == 2) that.flagEnd = true;
          that.channel(code, that);
          if (res.payload.status == false) return;
          // that.usersRanks.map(function (data: any) {
          //   if (data.id == ) {

          //   }
          // });
          that.answers = [];
          that.question = res.payload.question;
          that.flagStart = true;
        },
        (err: any) => {
          alert('Đã xảy ra lỗi !');
          that.router.navigate(['/capacity-join']);
        }
      );
    });
  }

  renderRankUser() {
    if (this.userRank) {
      var that = this;
      this.usersRanks.filter(function (data: any, key: any) {
        if (data.id == that.userRank.id) that.rank = key + 1;
      });
    }
  }

  channel(code: any, that: any) {
    (window as any).Echo.join('room.' + code)
      .here((users: any) => {
        this.users = users;
        console.log('User online ', users); //
      })
      .joining((user: any) => {
        this.users.push(user);
        console.log('User joining', user); //
      })
      .leaving((user: any) => {
        var us = this.users.filter(function (data: any) {
          return data.id !== user.id;
        });
        this.users = us;
      })
      .listen('PlayGameEvent', function (data: any) {
        that.flagStart = true;
        that.usersRanks = data.ranks;
        that.renderRankUser();
        that.question = data.question;
        console.log('Start', data); //
      })
      .listen('NextGameEvent', function (data: any) {
        that.capacityService
          .submitCode(code, {
            question_id: that.question.id,
            answers: that.answers,
          })
          .subscribe(
            (res: any) => {
              that.usersRanks = res.payload.ranks;
              that.renderRankUser();
            },
            (err: any) => {
              alert('Đã xảy ra lỗi !');
              that.router.navigate(['/capacity-join']);
            }
          );
        that.answers = [];
        that.question = data.question;
        that.flagStart = true;
        console.log('Next', data); //
      })
      .listen('EndGameEvent', function (data: any) {
        that.capacityService
          .submitCode(code, {
            question_id: that.question.id,
            answers: that.answers,
            flagEvent: true,
          })
          .subscribe(
            (res: any) => {
              that.usersRanks = res.payload.ranks;
              that.userRank = res.payload.rank;
              that.flagEnd = true;
              that.renderRankUser();
            },
            (err: any) => {
              alert('Đã xảy ra lỗi !');
              that.router.navigate(['/capacity-join', code]);
            }
          );
      })
      .listen('UpdateGameEvent', function (data: any) {
        console.log(data);
        that.usersRanks = data.ranks;
        that.renderRankUser();
      });
  }

  clickAnswer(id: any) {
    var key = 0;
    var keyAnswer = null;
    this.question.answers.filter(function (data: any, k: any) {
      if (data.id == id) key = k;
      return data.id == id;
    });
    var check = this.answers.filter(function (data: any, k: any) {
      if (data == id) keyAnswer = k;
      return data == id;
    });
    if (this.question.type == 1) {
      if (check.length > 0) {
        this.question.answers[key].status = false;
        this.answers.splice(keyAnswer, 1);
      } else {
        this.answers.push(id);
        this.question.answers[key].status = true;
      }
    } else {
      this.answers = [id];
      this.question.answers = this.question.answers.map(function (data: any) {
        return {
          content: data.content,
          id: data.id,
          question_id: data.question_id,
          status: false,
        };
      });
      this.question.answers[key].status = true;
    }
  }
  renderContent(content: string, type: number) {
    return ` ${content} ( ${type == 1 ? 'Nhiều đáp án' : 'Một đáp án '} ) `;
  }
}
