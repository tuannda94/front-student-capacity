import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ContestMember } from 'src/app/models/contest-member';
import { TeamService } from 'src/app/services/team.service';
import { NgToastService } from 'ng-angular-popup';
import { ContestService } from 'src/app/services/contest.service';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { ModalInfoTeamComponent } from '../modal-info-team/modal-info-team.component';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-modal-list-member',
  templateUrl: './modal-list-member.component.html',
  styleUrls: ['./modal-list-member.component.css'],
})
export class ModalListMemberComponent implements OnInit {
  keyWord: string;
  contestId: number;
  teamId: number;
  countMemberJoinTeam: any;
  statusResultMembers: boolean = false;
  max_user: number;
  arrayMembers: Array<ContestMember>;
  statusArrayMember: boolean = false;
  listUserJoinTeam: Array<any> = [];
  statusAddMember: boolean;
  statusSubmit : boolean = false;
  arrIdMember : Array<any> = [];

  constructor(
    public configFunctionService: ConfigFunctionService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalListMemberComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      keyWord: string;
      contest_id: number;
      team_id: number;
      max_user: number;
      array_members: number;
    },
    private teamService: TeamService,
    private toast: NgToastService,
    private contestService: ContestService
  ) {
    this.keyWord = data.keyWord;
    this.contestId = data.contest_id;
    this.teamId = data.team_id;
    this.countMemberJoinTeam = data.array_members;
  }

  ngOnInit(): void {
    this.searchMembers();
    this.countMemberJoinTeam.forEach((item :ContestMember) => {
      this.arrIdMember.push(item.id);
    })    
    
  }

  // Set keyword seachMembers
  setValueSearchMember(event: any) {
    this.keyWord = event.target.value;
  }

  // Close List Member
  closeListMember() {
    this.dialogRef.close();
    this.openInfoTeam(this.teamId, this.contestId.toString());
  }

  // Tìm kiếm thành viên
  searchMembers() {
    this.statusArrayMember = false;
    this.statusResultMembers = false;
    const data = {
      key: this.keyWord,
    };
    this.teamService.searchMembers(this.contestId, data).subscribe((res) => {
      if (res.status == true) {
        this.arrayMembers = res.payload.filter((item : ContestMember) => {
          return !this.arrIdMember.includes(item.id);
        });

        if (this.arrayMembers) {
          this.statusArrayMember = true;
          if (this.arrayMembers.length == 0) {
            this.statusResultMembers = true;
          }
        }
      }
    });
  }

  //Them id của từng thành viên vao mảng
  addItemUser(user_id: any) {
    let index = this.listUserJoinTeam.indexOf(user_id);
    console.log(index);
    
    if(index != -1){
      this.listUserJoinTeam.splice(index, 1);
    }else{
      this.listUserJoinTeam.push(user_id);
    }
   
    if(this.listUserJoinTeam.length > 0){
      this.statusSubmit = true;
    }


    
  }

  // thêm thành viên vào mảng
  addUserTeam() {
    this.statusAddMember = false;
    this.statusSubmit = false;
    let countMemberPresent = this.countMemberJoinTeam.length + this.listUserJoinTeam.length;
    console.log(this.data.max_user);
    
    console.log(countMemberPresent);
    
    if (this.data.max_user < countMemberPresent) {
      this.toast.warning({
        summary: 'Đã quá giới hạn thành viên cho phép !!!',
        duration: 2000,
      });
      this.statusSubmit = true;
      this.statusAddMember = true;
    } else {
      let data = {
        user_id: this.listUserJoinTeam,
      };
        this.teamService
        .addMemberJoinTeam(this.contestId, this.teamId, data)
        .subscribe((res) => {
          if (res.status) {
            this.toast.success({
              summary: 'Thêm thành công !!!',
              duration: 2000,
            });
            this.dialogRef.close(res.user_pass);
            this.openInfoTeam(this.teamId, this.contestId.toString());
          } else {
            this.toast.error({ summary: res.payload, detail:"Lỗi" , duration: 2000 });
          }
        });
    }
  }




  // Thông tin đội
  openInfoTeam(team_new_id: number, contest_id: string) {
    this.dialog.open(ModalInfoTeamComponent, {
      width: '900px',
      data: {
        contest_id: contest_id,
        team_id: team_new_id,
        max_user : this.data.max_user, 
      },
    });
  }

  displayedColumns: string[] = ['index', 'name', 'img', 'email', 'check-box'];
}
