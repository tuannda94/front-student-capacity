import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Post } from "src/app/models/post.model";
import { ListPostService } from "src/app/services/list-post.service";

@Component({
  selector: "app-aside-post",
  templateUrl: "./aside-post.component.html",
  styleUrls: ["./aside-post.component.css"],
})
export class AsidePostComponent implements OnInit {
  validateForm!: FormGroup;
  inputKeyword: string;
  listHotPost: Post[];
  statusPost: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private postService: ListPostService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      keyword: [null, [Validators.required]],
    });
    this.hotPosts();
  }

  // tìm kiếm
  searchPost() {
    if (this.validateForm.valid) {
      this.router.navigateByUrl(`/tim-kiem/bai-viet?keyword=${this.inputKeyword}`);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // hot post
  hotPosts() {
    this.postService.getHotPost().subscribe((res) => {
      if (res.status) {
        this.listHotPost = res.payload.data.filter((item: any, index: number) => {
          return index < 10;
        });
        this.statusPost = true;
      }
    });
  }
}
