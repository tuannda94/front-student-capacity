import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MentorService } from 'src/app/services/mentor.service';

@Component({
  selector: 'app-mentorship',
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css']
})
export class MentorshipComponent implements OnInit {
  page: string = 'mentor';
  mentors: Array<any> = [];
  constructor(
    private titleService: Title,
    private mService: MentorService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mentorship');

    this.getMentors();
  }

  getMentors() {
    this.mService.getListMentor().subscribe(res => {
      if (res.status) {
        this.mentors = res.payload;
      }
    })
  }
}
