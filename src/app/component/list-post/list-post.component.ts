import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit {
  @Input() countColumn: number;
  @Input() listPost : Array<Post>;
  constructor() { }
  
  ngOnInit(): void {
  }

}
