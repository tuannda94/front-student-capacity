import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Post } from "src/app/models/post.model";
import { ListPostService } from "src/app/services/list-post.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-post-category",
  templateUrl: "./post-category.component.html",
  styleUrls: ["./post-category.component.css"],
})
export class PostCategoryComponent implements OnInit {
  ListPost: Post[] | null;
  statusListPost: boolean = false;
  categoryPost: string = "";
  currentPage: string | null;
  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
  last_page: string;
  links: any;

  constructor(
    private postService: ListPostService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Danh Mục Bài Viết");
    this.backTop();
    let typePost = this.route.snapshot.queryParamMap.get("cate");
    this.currentPage = this.route.snapshot.queryParamMap.get("page");
    if (typePost == "post-recruitment") {
      this.categoryPost = "post-recruitment";
      let listTab = document.querySelectorAll(".post__nav-item");
      let type = document.querySelector(".recruitment");

      listTab.forEach((item) => {
        item.classList.remove("active");
      });
      type?.classList.add("active");
      this.postService.getPostByCategory(typePost, this.currentPage).subscribe((res) => {
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusListPost = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.ListPost = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusListPost = true;
        }
      });
    } else if (typePost == "post-capacity") {
      this.categoryPost = "post-capacity";
      let listTab = document.querySelectorAll(".post__nav-item");
      let type = document.querySelector(".capacity");

      listTab.forEach((item) => {
        item.classList.remove("active");
      });
      type?.classList.add("active");
      this.postService.getPostByCategory(typePost, this.currentPage).subscribe((res) => {
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusListPost = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.ListPost = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusListPost = true;
        }
      });
    } else if (typePost == "post-contest") {
      this.categoryPost = "post-contest";
      let listTab = document.querySelectorAll(".post__nav-item");
      let type = document.querySelector(".contest");

      listTab.forEach((item) => {
        item.classList.remove("active");
      });
      type?.classList.add("active");
      this.postService.getPostByCategory(typePost, this.currentPage).subscribe((res) => {
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusListPost = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.ListPost = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusListPost = true;
        }
      });
    }
  }

  // Change screen back top
  backTop() {
    $("html , body").animate(
      {
        scrollTop: 0,
      },
      1000,
    );
  }

  getListPost() {
    this.postService.getPostByCategory("post-recruitment", this.currentPage).subscribe((res) => {
      if (res.payload.error || res.payload.data.length == 0) {
        this.statusListPost = true;
      } else {
        let totalItemPages = res.payload.links.length;
        this.ListPost = res.payload.data;
        this.first_page_url = res.payload.first_page_url;
        this.next_page_url = res.payload.next_page_url;
        this.prev_page_url = res.payload.prev_page_url;
        this.last_page_url = res.payload.last_page_url;
        this.last_page = res.payload.last_page;
        this.links = res.payload.links.slice(1, totalItemPages - 1);
        this.statusListPost = true;
      }
    });
  }

  onChangeDataPost(event: any, data: string) {
    const statusAll = document.querySelectorAll(".post__nav-item");
    for (let i = 0; i < statusAll.length; i++) {
      statusAll[i]?.classList.remove("active");
    }

    event.currentTarget.classList.add("active");

    this.router.navigateByUrl(`danh-muc-bai-viet?cate=${data}`);

    this.ListPost = null;
    this.postService.getPostByCategory(data, this.currentPage).subscribe((res) => {
      if (res.payload.error || res.payload.data.length == 0) {
        this.statusListPost = true;
      } else {
        let totalItemPages = res.payload.links.length;
        this.ListPost = res.payload.data;
        this.first_page_url = res.payload.first_page_url;
        this.next_page_url = res.payload.next_page_url;
        this.prev_page_url = res.payload.prev_page_url;
        this.last_page_url = res.payload.last_page_url;
        this.last_page = res.payload.last_page;
        this.links = res.payload.links.slice(1, totalItemPages - 1);
        this.statusListPost = true;
      }
    });
  }

  paginationPages(url: string, active: boolean, pageNumber: string, event: any) {
    if (pageNumber == "...") {
      // nếu người dùng bấm vào ... ở phân trang thì chả làm gì hết
    } else {
      this.ListPost = [];
      this.statusListPost = false;
      let listTab = document.querySelectorAll(".pagination-item");
      for (let i = 0; i < listTab.length; i++) {
        listTab[i]?.classList.remove("active");
      }
      event.currentTarget.classList.add("active");

      this.router.navigateByUrl(`danh-muc-bai-viet?cate=${this.categoryPost}&page=${pageNumber}`);

      this.postService.paginationPost(url).subscribe((res) => {
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusListPost = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.ListPost = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusListPost = true;
        }
      });
    }
  }
}
