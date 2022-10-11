import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-recruitment-position',
  templateUrl: './recruitment-position.component.html',
  styleUrls: ['./recruitment-position.component.css']
})
export class RecruitmentPositionComponent implements OnInit {
  @Input() item: Post;
  constructor() { }

  ngOnInit(): void {
  }

}
