import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { GetValueLocalService } from 'src/app/services/get-value-local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from 'src/app/models/team';
import { ModalInfoTeamComponent } from 'src/app/modal/modal-info-team/modal-info-team.component';
@Component({
  selector: 'app-modal-add-team',
  templateUrl: './modal-add-team.component.html',
  styleUrls: ['./modal-add-team.component.css'],
})
export class ModalAddTeamComponent implements OnInit {
  selectedImage: any;
  statusRegister: boolean = true;
  statusFormEdit: boolean = true;
  titleModel: string = 'THÊM ĐỘI THAM GIA';
  public imagePath: string;
  buttonName: string = 'Đăng ký';
  teamDetail: Team;
  user: User;
  imgURL: any =
    'https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png';
  public message: string;
  user_id: any = 4;
  formEdit: boolean = false;
  isEditData : boolean = false;

  // set up form control
  formRegister = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    image: new FormControl(),
    id: new FormControl(),
    user_id: new FormControl(),
  });

  constructor(
    private teamService: TeamService,
    public dialogRef: MatDialogRef<ModalAddTeamComponent>,
    private getUserLocal: GetValueLocalService,
    private toast: NgToastService,
    public dialog: MatDialog,

    config: NgbModalConfig,
    @Inject(MAT_DIALOG_DATA)
    public data: { contest_id: string; team_id: number; teams: Team }
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.user = this.getUserLocal.getValueLocalUser('user');
    if (this.data.teams) {
      this.formEdit = true;
      this.titleModel = 'SỬA THÔNG TIN ĐỘI';
      this.buttonName = 'Sửa đội';
      this.teamDetail = this.data.teams;
      this.imgURL = this.teamDetail.image
        ? this.teamDetail.image
        : 'https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png';
      this.formRegister.controls['name'].setValue(this.teamDetail.name);
    } else {
      this.statusFormEdit = true;
    }
  }

  // Check status submit
  checkStatusForm() {
    if (this.data.team_id) {
      this.editTeam();
    } else {
      this.addTeam();
    }
  }

  // Render image after add
  preview(files: any) {
    this.isEditData = true;
    if (files.length === 0) return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.imagePath = files[0];

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  // Add team
  addTeam() {
    this.statusRegister = false;
    let dataTeam = { ...this.formRegister.value };
    var formDataTeam = new FormData();
    formDataTeam.append('name', dataTeam.name);
    if (this.imagePath != undefined) {
      formDataTeam.append('image', this.imagePath);
    }
    formDataTeam.append('contest_id', this.data.contest_id);
    formDataTeam.append('user_id', this.user_id);
    this.teamService.addTeam(formDataTeam).subscribe((res) => {
      if (!res.status) {
        this.toast.warning({ summary: res.payload, duration: 2000 });
        this.dialogRef.close();
      } else {
        this.statusRegister = true;
        this.onNoClick();
        this.openInfoTeam(res.id_team, this.data.contest_id);
        this.toast.success({ summary: 'Thêm thành công', duration: 2000 });
      }
    });
  }

  editTeam() {
    this.statusRegister = false;
    let dataTeam = { ...this.formRegister.value };

    var formDataTeam = new FormData();

    if( dataTeam.name === this.teamDetail.name &&  !this.isEditData){
      this.toast.warning({ summary: 'Bạn chưa chỉnh sửa gì ?', duration: 2000 });
      this.statusRegister = true;
    }else{
      formDataTeam.append('name', dataTeam.name);
      if (this.imagePath != undefined) {
        formDataTeam.append('image', this.imagePath);
      }
      formDataTeam.append('contest_id', this.data.contest_id);
      formDataTeam.append('user_id', this.user_id);
      this.teamService
        .editTeam(formDataTeam, this.teamDetail.id)
        .subscribe((res) => {
          if (!res.status) {
            this.toast.warning({ summary: res.payload, duration: 2000 });
            this.dialogRef.close();
          } else {
            this.statusRegister = true;
            this.onNoClick();
            this.openInfoTeam(this.teamDetail.id, this.data.contest_id);
            this.toast.success({ summary: 'Sửa thành công', duration: 2000 });
          }
        });
    }
  }

  onNoClick(): void {
    if (this.data.teams) {
      this.dialogRef.close();
      this.openInfoTeam(this.teamDetail.id, this.data.contest_id);
    } else {
      this.dialogRef.close();
    }
  }

  // Thông tin đội
  openInfoTeam(team_new_id: number, contest_id: string) {
    this.dialog.open(ModalInfoTeamComponent, {
      width: '900px',
      data: {
        contest_id: contest_id,
        team_id: team_new_id,
      },
    });
  }
}
