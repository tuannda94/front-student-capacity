import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-info-team',
  templateUrl: './info-team.component.html',
  styleUrls: ['./info-team.component.css']
})
export class InfoTeamComponent implements OnInit {
  user: User;
  constructor(private userLocal: UserService) { }

  ngOnInit(): void {
    $('html , body').animate({
      scrollTop: 0
    }, 1000);

    this.user = this.userLocal.getUserValue();
  }

}
