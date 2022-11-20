import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Capacity } from "src/app/models/capacity";
import { Major } from "src/app/models/major";
import { ConfigFunctionService } from "src/app/services/config-function.service";
import { MajorService } from "src/app/services/major.service";
import { TestCapacityService } from "src/app/services/test-capacity.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-rank-capacity",
  templateUrl: "./rank-capacity.component.html",
  styleUrls: ["./rank-capacity.component.css"],
})
export class RankCapacityComponent implements OnInit {
  slugMajor: string;
  majors: Array<Major>;
  listRanking: any = [];
  urlBanner: any = "";
  statusNotResultReturn: boolean = false;
  majorsDataTable: string;
  listCapacity: Array<Capacity>;
  currentPage: string | null;

  statusSubmit: boolean = false;
  statusMajor: boolean = false;
  statusRanking: boolean = false;
  statusCapacity: boolean = false;

  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
  last_page: string;
  links: any;

  constructor(
    private testCapacityService: TestCapacityService,
    private router: Router,
    private route: ActivatedRoute,
    public majorService: MajorService,
    public configService: ConfigFunctionService,
    private titleService: Title,
  ) {}

  formFilter = new FormGroup({
    filterName: new FormControl(""),
    filterMajor: new FormControl(""),
  });

  ngOnInit(): void {
    this.titleService.setTitle("Xếp Hạng Test Năng Lực");
    this.getUrlBannerCapacity();
    // khi không có param trên web thì sẽ lấy chuyên ngành lập trình web
    this.slugMajor = this.route.snapshot.queryParamMap.get("major")!;
    this.slugMajor == null ? (this.slugMajor = "lap-trinh-web") : this.slugMajor;
    this.getListMajor();

    if (this.slugMajor != null) {
      this.currentPage = this.route.snapshot.queryParamMap.get("page");
      this.testCapacityService.getRankingByMajor(this.slugMajor, this.currentPage).subscribe((res) => {
        if (res.status) {
          this.statusSubmit = true;
          if (res.payload.error || res.payload.data.length == 0) {
            this.statusRanking = true;
            this.statusNotResultReturn = true;
          } else {
            let totalItemPages = res.payload.links.length;
            this.listRanking = res.payload.data;
            this.first_page_url = res.payload.first_page_url;
            this.next_page_url = res.payload.next_page_url;
            this.prev_page_url = res.payload.prev_page_url;
            this.last_page_url = res.payload.last_page_url;
            this.last_page = res.payload.last_page;
            this.links = res.payload.links.slice(1, totalItemPages - 1);
            this.statusRanking = true;
            this.statusNotResultReturn = false;
          }
        }
      });

      this.getListTestCapacity();
    }
  }

  getUrlBannerCapacity() {
    this.testCapacityService.getBannerCapacity().subscribe((res) => {
      this.urlBanner = res.payload[0].image_url;
    });
  }

  // lấy danh sách test năng lực trả về 8 bài bài test mới nhất
  getListTestCapacity() {
    this.testCapacityService.getAllTestCapacity().subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload.data;
        this.listCapacity = arrResult.filter((res: any, index: number) => {
          return index <= 7;
        });
        this.listCapacity.length > 0 ? (this.statusCapacity = true) : this.statusCapacity;
      }
    });
  }

  // set lại giá trị cho form Chuyên ngành và lấy data render lại page
  setValueFilterMajor(item: Major) {
    this.formFilter.controls["filterMajor"].setValue(item.name);
    this.statusSubmit = true;
    this.statusMajor = true;

    this.listRanking = [];
    this.statusNotResultReturn = false;
    this.statusRanking = false;

    if (this.formFilter.controls["filterMajor"].value) {
      this.slugMajor = this.majors.filter(
        (item) => item.name === this.formFilter.controls["filterMajor"].value,
      )[0].slug;

      this.majorsDataTable = this.majors.filter(
        (item) => item.name === this.formFilter.controls["filterMajor"].value,
      )[0].name;
    }

    this.router.navigateByUrl(`test-nang-luc?major=${this.slugMajor}`);

    this.testCapacityService.getRankingByMajor(this.slugMajor, this.currentPage).subscribe((res) => {
      if (res.status) {
        this.statusSubmit = true;
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusRanking = true;
          this.statusNotResultReturn = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.listRanking = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusRanking = true;
          this.statusNotResultReturn = false;
        }
      }
    });
  }

  filterSelect(arr: Array<any>, value: string, input: string) {
    switch (input) {
      case "major":
        if (!value) {
          this.getListMajor();
          this.statusSubmit = false;
        } else {
          this.majors = arr.filter((item) => {
            return this.configService.changeString(item.name).includes(this.configService.changeString(value));
          });
        }
        break;

      default:
        break;
    }
  }

  getListMajor() {
    this.majorService.getAll().subscribe((res) => {
      if (res.status) {
        this.majors = res.payload;
        let major_query: any;
        for (let index = 0; index < this.majors.length; index++) {
          if (this.slugMajor == this.majors[index].slug) {
            major_query = this.majors[index].name;
          }
        }

        this.majorsDataTable = major_query!;

        this.formFilter.controls["filterMajor"].setValue(major_query);
      }
    });
  }

  getRankByMajor(slugMajor: string) {
    this.listRanking = [];
    this.statusNotResultReturn = false;
    this.statusRanking = false;
    this.testCapacityService.getRankingByMajor(slugMajor, this.currentPage).subscribe((res) => {
      if (res.payload.error || res.payload.data.length == 0) {
        this.statusRanking = true;
        this.statusNotResultReturn = true;
      } else {
        let totalItemPages = res.payload.links.length;
        this.listRanking = res.payload.data;
        this.first_page_url = res.payload.first_page_url;
        this.next_page_url = res.payload.next_page_url;
        this.prev_page_url = res.payload.prev_page_url;
        this.last_page_url = res.payload.last_page_url;
        this.last_page = res.payload.last_page;
        this.links = res.payload.links.slice(1, totalItemPages - 1);
        this.statusRanking = true;
        this.statusNotResultReturn = false;
      }
    });
  }

  paginationPages(url: string, active: boolean, pageNumber: string, event: any) {
    if (pageNumber == "...") {
      // nếu người dùng bấm vào ... ở phân trang thì chả làm gì hết
    } else {
      this.listRanking = [];
      this.statusNotResultReturn = false;
      this.statusRanking = false;
      let listTab = document.querySelectorAll(".pagination-item");
      for (let i = 0; i < listTab.length; i++) {
        listTab[i]?.classList.remove("active");
      }
      event.currentTarget.classList.add("active");

      this.router.navigateByUrl(`test-nang-luc?major=${this.slugMajor}&page=${pageNumber}`);

      this.testCapacityService.paginationCapacity(url).subscribe((res) => {
        if (res.payload.error || res.payload.data.length == 0) {
          this.statusRanking = true;
          this.statusNotResultReturn = true;
        } else {
          let totalItemPages = res.payload.links.length;
          this.listRanking = res.payload.data;
          this.first_page_url = res.payload.first_page_url;
          this.next_page_url = res.payload.next_page_url;
          this.prev_page_url = res.payload.prev_page_url;
          this.last_page_url = res.payload.last_page_url;
          this.last_page = res.payload.last_page;
          this.links = res.payload.links.slice(1, totalItemPages - 1);
          this.statusRanking = true;
          this.statusNotResultReturn = false;
        }
      });
    }
  }
}
