import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { ConfigViewService } from 'src/app/services/config-view.service';
import { GetValueLocalService } from 'src/app/services/get-value-local.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit {
  user: User;
  statusWindow: boolean = false;
  statusLogin: boolean = false;
  constructor(
    private userInfo: GetValueLocalService,
    private configView: ConfigViewService
  ) {}

  ngOnInit(): void {
    this.backTop();
    this.winBackTop();
    window.addEventListener('scroll', () => {
      this.winBackTop();
      this.headerBlockScroll();
    });
  }

  winBackTop() {
    let windowScroll = window.scrollY;
    if (windowScroll > 0) {
      this.statusWindow = true;
    } else {
      this.statusWindow = false;
    }
  }

  headerBlockScroll() {
    let header = document.querySelector('.header');
    if (window.scrollY > 400) {
      header?.classList.add('fixed');
    } else {
      header?.classList.remove('fixed');
      // document.getElementById = "-50px";
    }
  }

  // Change screen back top
  backTop() {
    $('html , body').animate(
      {
        scrollTop: 0,
      },
      1000
    );
  }
}
