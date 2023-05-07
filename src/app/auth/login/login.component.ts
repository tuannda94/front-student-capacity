import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {ConfigViewService} from 'src/app/services/config-view.service';
import {UserService} from 'src/app/services/user.service';
import {CampusService} from 'src/app/services/campus.service';
import {NgToastService} from 'ng-angular-popup';
import {Campus} from 'src/app/models/campus.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socialUser!: SocialUser;
  c?: boolean = true;
  listCampus: Campus[];
  loginForm: FormGroup;
  statusLogin: boolean = false;
  alert = {
    type: 'danger',
    message: "",
  }

  constructor(
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private campusService: CampusService,
    private router: Router,
    private configView: ConfigViewService,
    private toast: NgToastService,
    private formBuilder: FormBuilder,
  ) {
    this.getListCampus();
    this.loginForm = this.formBuilder.group({
      campus_code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.toast.error({summary: 'Không thể đăng nhập !', duration: 5000});
  }

  getListCampus() {
    this.campusService.getListCampus().subscribe(data => {
      this.listCampus = data.payload;
    });
  }

  loginWithGoogle(): void {
    if (!this.loginForm.value.campus_code) {
      this.toast.error({summary: 'Không thể đăng nhập', duration: 5000});
      this.statusLogin = false;
      return;
    }
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(data => {
        let dataSignIn = {
          token: data.authToken,
          campus_code: this.loginForm.value.campus_code,
        }
        this.statusLogin = true;
        this.toast.warning({summary: 'Đang tiến hành đăng nhập', duration: 10000});
        this.userService.login(dataSignIn)
          .subscribe(status => {
            this.statusLogin = false;
            if (status == true) {
              setTimeout(() => {
                this.toast.success({summary: 'Đăng nhập thành công', duration: 5000});
                this.router.navigate(['/']);
              }, 1000)
            } else {
              this.toast.error({summary: 'Không thể đăng nhập', duration: 5000});
            }
          })
      });
  }


  logOut(): void {
    this.socialAuthService.signOut();
  }


}
