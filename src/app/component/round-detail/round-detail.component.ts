import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgToastService } from 'ng-angular-popup';
import { map, switchMap } from 'rxjs';
import { Contest } from 'src/app/models/contest';
import { ContestMember } from 'src/app/models/contest-member';
import { Round } from 'src/app/models/round.model';
import { Team } from 'src/app/models/team';
import { RoundService } from 'src/app/services/round.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-round-detail',
  templateUrl: './round-detail.component.html',
  styleUrls: ['./round-detail.component.css']
})
export class RoundDetailComponent implements OnInit {
  @Input() roundDetail: Round;
  @Input() statusRoundDetail: boolean;
  status: boolean = false;
  round_id: any;
  listMember: any;
  team: Team;

  constructor(private route: ActivatedRoute,
    private modalService: NgbModal,
    private roundService: RoundService,
    private toast: NgToastService,
    private router: Router,
    private user: UserService) { }

  ngOnInit(): void {

  }

  openVerticallyCentered(content: any, item: Team, listMember: any) {
    this.modalService.open(content, { centered: true });
    this.listMember = listMember;
    this.team = item;
  }

  takeTheExam(round_id: number, end_time: Date) {
    if (!this.user.getUserValue()) {
      this.router.navigate(['./login']);
    }

    let dateTime = new Date(end_time).getTime();
    let todayTime = new Date().getTime();
    if (todayTime > dateTime) {
      this.toast.warning({ summary: 'Đã hết thời gian thi !!!', detail:"Cảnh báo" ,duration: 3000 });
    } else {
      this.roundService.getInfoTeamFromContestId(round_id)
        .subscribe(res => {
          if (res.payload.length == 0) {
            this.toast.warning({ summary: 'Bạn chưa tham gia cuộc thi này !',detail:"Cảnh báo" , duration: 5000 });
          } else {
            this.router.navigate(['/vao-thi', this.roundDetail.contest_id, 'vong', this.roundDetail.id]);
          }
        })
    }
  }

  getMembers(teams: Array<Team> = []): number {
    let totalMember = 0;
    teams.forEach(t => {
      if (t.members != undefined) {
        totalMember += t.members.length;
      }
    });
    return totalMember;
  }
}

