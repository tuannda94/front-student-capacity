import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { NgToastService } from "ng-angular-popup";
import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-profile-user",
  templateUrl: "./profile-user.component.html",
  styleUrls: ["./profile-user.component.css"],
})
export class ProfileUserComponent implements OnInit {
  imagePath: string;
  statusEditUser = false;
  userInfo: User;
  nameUser: string;
  imgURL: string | ArrayBuffer | null;

  constructor(private userService: UserService, 
    private toast: NgToastService,
    private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Thông tin tài khoản');
    this.userInfo = this.userService.getUserValue();
  }

  // preview image
  preview(files: any) {
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

  // update info
  handleUpdateInfo() {
    if (this.statusEditUser) return;
    this.statusEditUser = true;

    let formDataUser = new FormData();
    if (this.nameUser == undefined) {
      this.nameUser = this.userInfo.name;
    }

    formDataUser.append("name", this.nameUser);
    this.imgURL && formDataUser.append("avatar", this.imagePath);

    this.userService.editInfoUser(formDataUser).subscribe((res) => {
      if (res.status) {
        this.statusEditUser = false;
        this.toast.success({ summary: "Cập nhật thông tin thành công!", duration: 2000 });
        this.userService.setLocalStorageHasEdit(res.payload);
      } else {
        if (res.payload.name) {
          this.toast.warning({ summary: res.payload.name, duration: 2000 });
          this.statusEditUser = false;
        } else if (res.payload.avatar) {
          this.toast.warning({ summary: res.payload.avatar, duration: 2000 });
          this.statusEditUser = false;
        }
      }
    });
  }

  setNameUser(event: Event) {
    this.nameUser = (event.target as HTMLInputElement).value;

    if (this.nameUser == undefined) {
      this.nameUser = this.userInfo.name;
    }
    if (this.nameUser.length > 30) {
      this.toast.warning({ summary: "Tên không được vượt quá 30 ký tự!", duration: 3000 });
    }
  }
}
