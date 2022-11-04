import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { GetValueLocalService } from 'src/app/services/get-value-local.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ContestService } from 'src/app/services/contest.service';
import { Contest } from 'src/app/models/contest';
import { ListPostService } from 'src/app/services/list-post.service';
import { Post } from 'src/app/models/post.model';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: User;
  statusWindow: boolean = false;
  contests: Array<Contest> = [];
  posts: Array<Post> = [];
  statusPage: boolean = false;
  typeTab: number = 0;
  @Input() countContest : number ;
  @Input() countPost : number;
  totalSave: number = 0;
  constructor(
    private userInfo: GetValueLocalService,
    private userService: UserService,
    private wishlist: WishlistService
  ) {}

  ngOnInit(): void {
    this.userService.user.subscribe((data) => {
      this.user = data!;
    });
    
    this.user = this.userInfo.getValueLocalUser('user');
    this.saveUrlCurrent();
  }


  getCountAll(){
    let result;
    if(this.countContest &&  this.countPost){
      result = this.countContest + this.countPost;
    }else{
      result = 0
    }
    return result;
  }


  getContest() {
    this.wishlist.getlistWish('contest').subscribe((res) => {
      if (res.status) {
        this.contests = res.payload;
        this.statusPage = true;
      }
    });
  }

  getPost() {
    this.statusPage = false;
    this.wishlist.getlistWish('post').subscribe((res) => {
      if (res.status) {
        this.posts = res.payload;
        this.statusPage = true;
      }
    });
  }

  getContestStatus(event: any) {
    if (this.posts) {
      document.querySelector('.post')?.classList.remove('active');
  
      event.currentTarget.classList.add('active');
      this.getContest();
      this.typeTab = 0;
    }
  }

  filterContest(item: Contest) {
    this.statusPage = false;
    setTimeout(() => {
      this.statusPage = true;
      if (item.user_wishlist) {
        this.contests = this.contests.filter((res: Contest) => {
          return res.id !== item.id;
        });
      }
    }, 3000);
  }

  filterPost(item: Post) {
    this.statusPage = false;
    setTimeout(() => {
      this.statusPage = true;
      if (item.user_wishlist) {
        this.posts = this.posts.filter((res: Post) => {
          return res.id !== item.id;
        });
      } 
    }, 3000);
  }

  getPostStatus(event: any) {
    if (this.statusPage) {
      this.statusPage = false;
      this.getPost();
      document.querySelector('.contest')?.classList.remove('active');
      event.currentTarget.classList.add('active');
      this.typeTab = 1;
    }
  }

  closeMenuRes(element: HTMLElement) {
    element.removeAttribute('checked');
  }

  openSaveInfo() {
    this.statusPage = false;
    this.getContest();
    document.querySelector('.sidepanel')?.classList.add('save-info-acive');
    document.querySelector('.overlay')?.classList.remove('d-none');    
  }

  closeSaveInfo(status : boolean) {
    if(status){
      document.querySelector('.sidepanel')?.classList.remove('save-info-acive');
      document.querySelector('.overlay')?.classList.add('d-none');
    }
  }

  // LogOut
  logOut() {
    localStorage.clear();
    this.ngOnInit();
    this.userService.logout();
    // window.location.reload();
  }

  // Save url login
  saveUrlCurrent() {
    const urlCurrent = window.location.pathname;
    localStorage.setItem('url-current', urlCurrent);
  }
}
