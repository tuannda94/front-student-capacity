import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map, switchMap } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team';
import { ContestMember } from 'src/app/models/contest-member';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgToastService } from 'ng-angular-popup';
import { ContestService } from 'src/app/services/contest.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { ModalListMemberComponent } from 'src/app/modal/modal-list-member/modal-list-member.component';
import { ModalAddTeamComponent } from 'src/app/modal/modal-add-team/modal-add-team.component';

@Component({
  selector: 'app-modal-info-team',
  templateUrl: './modal-info-team.component.html',
  styleUrls: ['./modal-info-team.component.css']
})
export class ModalInfoTeamComponent implements OnInit {
  statusExam: boolean = false;
  team_id: any;
  contest_id: any;
  statusLeader: boolean = false;
  teamDetail: Team;
  statusTeamDetail: boolean = false;
  arrayMembers: Array<ContestMember>;
  user: User;
  logoDefault = '/src/assets/img/Ai.jpeg';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private teamService: TeamService,
    private contestService: ContestService,
    private toast: NgToastService,
    private userService: UserService,
    public configFunctionService: ConfigFunctionService,
    public dialogRef: MatDialogRef<ModalInfoTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team_id: number,
       contest_id: number, max_user: number, statusExam: boolean }) {
    this.team_id = data.team_id;
    this.statusExam = data.statusExam
    this.contest_id = data.contest_id;
  }

  // Lấy dữ liệu từ modal điều hướng sang chi tiết đội thi
  openFormEditTeam(): void {
    this.dialogRef.close();
    let status = this.dialog.open(ModalAddTeamComponent, {
      width: "490px",
      data: {
        contest_id:  this.contest_id,
        team_id: this.team_id,
        teams: this.teamDetail,
        max_user: this.data.max_user
      },
    });

    status.afterClosed().subscribe(result => {
        if(result){
          this.closeDialog();
        }
    });
  }

  // Mở danh sách các member theo keyword
  openListMemberJoinTeam(keyWord: any = '') {
    this.dialogRef.close();
    const members = this.dialog.open(ModalListMemberComponent, {
      width: "800px",
      data: {
        keyWord: keyWord,
        contest_id: this.teamDetail.contest_id,
        team_id: this.team_id,
        max_user: this.data.max_user,
        array_members: this.arrayMembers,
      },
    });

    members.afterClosed().subscribe(result => {
      this.arrayMembers.concat(result);
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.user = this.userService.getUserValue();
    
    if (!this.user) {
      this.router.navigate(['/login']);
    }

    // Trả ra chi tiết đội
    this.teamService.getTeamDetail(this.team_id).subscribe(res => {
        if (res.status) {
        this.teamDetail = res.payload;
        
        this.statusTeamDetail = true;
        this.arrayMembers = this.teamDetail.members;
        
        this.checkUserTeamLeader();
        this.arrayMembers.map(res => {
          res.checked = false;
        })
      }
    })
  }

   // Check xem ai là trưởng nhóm
   checkLeader(bot: number) {
    if (bot == 1) {
      return 'Trưởng nhóm';
    }
    return '';
  }

  checkUserTeamLeader() {
    let leader = this.arrayMembers.filter(item => {
      return item.pivot.bot == 1 && item.id == this.user.id;
    });
    if (leader.length > 0)
      this.statusLeader = true;
    if (this.statusLeader == false)
      this.displayedColumns = this.displayedColumns.filter(item => {
        return item !== 'symbol';
      })
  }

  removeMembers(member: number) {
    let check = confirm('Bạn có muốn xóa thành viên này ?');
    if (check == true) {
      let data = {
        team_id: this.team_id,
        user_id: [
          member
        ]
      }
      
      this.teamService.removeMembers(data).subscribe(res => {        
        if (res.status) {
          this.arrayMembers =  this.arrayMembers.filter((item) => {
            return item.id  != res.user_id[0];
          })
          this.toast.success({ summary: "Xóa thành công", detail:"Thông báo" , duration: 2000 });
        }
      })
    }
  }

  displayedColumns: string[] = ['position', 'name', 'image', 'weight', 'bot', 'symbol'];

  closeDialog() {
    this.dialogRef.close();
  }
}
