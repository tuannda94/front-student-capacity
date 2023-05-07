import { Component, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/models/sponsor';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

import { Contest } from 'src/app/models/contest';
import { ContestService } from 'src/app/services/contest.service';
import { ConfigViewService } from 'src/app/services/config-view.service';
import { Major } from 'src/app/models/major';
import { ResultMajor } from 'src/app/models/result-major.model';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    item: Contest;

    sliderStudentPointHight = { "slidesToShow": 3, prevArrow: '.prev-student-arrow', autoplay: true, nextArrow: '.next-student-arrow', slidesToScroll: 1, fadeSpeed: 3000, centerMode: true };

    sliderAssessCompacity = {
        "slidesToShow": 1, autoplay: true, prevArrow: '.prev-compacity-arrow', nextArrow: '.next-compacity-arrow', slidesToScroll: 1, fadeSpeed: 3000, centerMode: true, fade: true,
        cssEase: 'linear'
    };

    constructor(
        private configView: ConfigViewService,
        private UserService: UserService,
        private http: HttpClient) { }


    ngOnInit(): void {
        let elToShow = document.querySelectorAll('.show-on-scroll')


        // Config giao dien
        let studentStatistic = document.querySelector('.section_plan-student');
        let yearStatistic = document.querySelector('.section_plan-year');
        let passStatistic = document.querySelector('.section_plan-pass');

        this.configView.activityStrollView(elToShow);

        this.configView.runStatisticHome(studentStatistic, 10);
        this.configView.runStatisticHome(yearStatistic, 4000);
        this.configView.runStatisticHome(passStatistic, 2000);

    }

}
