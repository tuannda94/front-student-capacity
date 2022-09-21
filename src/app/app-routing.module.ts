import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContestComponent } from "./pages/contest/contest.component";
import { HomeLayoutComponent } from "./layouts/home-layout/home-layout.component";
import { ContestDeatailComponent } from "./pages/contest-detail/contest-deatail.component";
import { ProfileUserComponent } from "./component/profile-user/profile-user.component";
import { ContestUserJoinComponent } from "./component/contest-user-join/contest-user-join.component";
import { PostDetailComponent } from "./pages/post-detail/post-detail.component";
import { PostResultSearchComponent } from "./pages/post-result-search/post-result-search.component";
import { ProfileLayoutComponent } from "./layouts/profile-layout/profile-layout.component";
import { MyCapacityTestComponent } from "./pages/my-capacity-test/my-capacity-test.component";
import { AuthGuard } from "./guard/auth.guard";
import { RoundDetailComponent } from "./component/round-detail/round-detail.component";
import { RoundComponent } from "./component/round/round.component";
import { IntoExamComponent } from "./pages/into-exam/into-exam.component";
import { RoundContestDetailComponent } from "./pages/round-contest-detail/round-contest-detail.component";
import { RecruitmentComponent } from "./pages/recruitment/recruitment.component";
import { CapacityDetailComponent } from "./pages/capacity-detail/capacity-detail.component";
import { CapacityExamComponent } from "./pages/capacity-exam/capacity-exam.component";
import { PostsComponent } from "./pages/posts/posts.component";
import { RecruitmentDetailComponent } from "./pages/recruitment-detail/recruitment-detail.component";
import { TestCapacityComponent } from "./pages/test-capacity/test-capacity.component";

import { PostCategoryComponent } from "./pages/post-category/post-category.component";
import { JoinCapacityComponent } from "./pages/join-capacity/join-capacity.component";
import { CapacityPlayComponent } from "./pages/capacity-play/capacity-play.component";
const routes: Routes = [
  {
    path: "",
    component: HomeLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "cuoc-thi",
        component: ContestComponent,
      },
      {
        path: "bai-viet",
        component: PostsComponent,
      },
      {
        path: "bai-viet/:slug",
        component: PostDetailComponent,
      },
      {
        path: "danh-muc-bai-viet",
        component: PostCategoryComponent,
      },
      {
        path: "tim-kiem/bai-viet",
        component: PostResultSearchComponent,
      },
      {
        path: "vao-thi/:contest_id/vong/:round_id",
        component: IntoExamComponent,
      },
      {
        path: "tai-khoan",
        component: ProfileLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            component: ProfileUserComponent,
          },
          {
            path: "cuoc-thi-da-tham-gia",
            component: ContestUserJoinComponent,
          },
          {
            path: "bai-test-da-lam",
            component: MyCapacityTestComponent,
          },
        ],
      },
      {
        path: "cuoc-thi/chuyen-nganh/:slug",
        component: ContestComponent,
      },
      {
        path: "cuoc-thi/trang-thai/:status",
        component: ContestComponent,
      },
      {
        path: "cuoc-thi/:contest_id",
        component: ContestDeatailComponent,
      },
      {
        path: "cuoc-thi/:contest_id/vong/:round_id",
        component: RoundContestDetailComponent,
      },
      {
        path: "tuyen-dung",
        component: RecruitmentComponent,
      },
      {
        path: "test-nang-luc",
        component: TestCapacityComponent,
      },
      {
        path: "tuyen-dung/chi-tiet/:id",
        component: RecruitmentDetailComponent,
      },
      {
        path: "cuoc-thi/:contest_id/vong/:round_id",
        component: RoundContestDetailComponent,
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
        path: "capacity-join",
        component: JoinCapacityComponent,
      },
      {
        path: "capacity-play",
        component: CapacityPlayComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
