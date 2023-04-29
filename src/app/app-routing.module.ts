import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {HomeLayoutComponent} from './layouts/home-layout/home-layout.component';
import {ProfileUserComponent} from './component/profile-user/profile-user.component';
import {CapacityDetailComponent} from './pages/capacity-detail/capacity-detail.component';
import {TestCapacityComponent} from './pages/test-capacity/test-capacity.component';
import {CapacityExamComponent} from "./pages/capacity-exam/capacity-exam.component";
import {InfoTeamComponent} from "./pages/info-team/info-team.component";

const routes: Routes = [
  {
    path: "",
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'thong-tin',
        component: InfoTeamComponent,
        children: [
          {
            path: 'ca-nhan',
            component: ProfileUserComponent,
          },
        ]
      },
      {
        path: "test-nang-luc/:capacity_id",
        component: CapacityDetailComponent,
      },
      {
        path: "test-nang-luc/vao-thi/:capacity_id/bai-thi/:round_id",
        component: CapacityExamComponent,
      },
      {
        path: "test-nang-luc",
        component: TestCapacityComponent,
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
