import { SkillServiceService } from "src/app/services/skill-service.service";
import { ConfigFunctionService } from "src/app/services/config-function.service";
import { MajorService } from "src/app/services/major.service";
import { ListPostService } from "src/app/services/list-post.service";
import { CompanyService } from "src/app/services/company.service";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { Capacity } from "src/app/models/capacity";
import { TestCapacityService } from "src/app/services/test-capacity.service";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Major } from "src/app/models/major";
import { Skill } from "src/app/models/skill.models";
import { Post } from "src/app/models/post.model";
import { TransmitToPost } from "src/app/models/transmit-to-post.models";
import { PayingLinks } from "src/app/models/paying-links";
import { RecruitmentsService } from "src/app/services/recruitments.service";
import { Recruitments } from "src/app/models/recruitments.models";
import { Enterprise } from "src/app/models/enterprise.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-test-capacity",
  templateUrl: "./test-capacity.component.html",
  styleUrls: ["./test-capacity.component.css"],
})
export class TestCapacityComponent implements OnInit {
  keywordTrending: any;
  validateForm!: FormGroup;
  listCapacity: Array<Capacity>;
  valueSearch: string | null;
  skills: Array<Skill>;
  skill_id: number | string = "";
  companys: Array<Enterprise>;
  cinfigData: TransmitToPost;
  majors: Array<Major>;

  statusNotResultReturn: boolean = false;
  statusCapacity: boolean = false;
  statusKeywordTrending: boolean = false;
  statusSubmit: boolean = false;
  statusMajor: boolean = false;
  statusSkill: boolean = false;

  constructor(
    private testCapacityService: TestCapacityService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public companyService: CompanyService,
    public recruitmentService: RecruitmentsService,
    public listPostService: ListPostService,
    public majorService: MajorService,
    public configService: ConfigFunctionService,
    public skillService: SkillServiceService,
    private titleService: Title,
  ) {}

  formFilter = new FormGroup({
    filterSkill: new FormControl(""),
    filterName: new FormControl(""),
    filterMajor: new FormControl(""),
    filterStatus: new FormControl(""),
  });

  ngOnInit(): void {
    this.titleService.setTitle("Danh Sách Đánh Giá Năng Lực");
    if (
      this.formFilter.controls["filterSkill"].value ||
      this.formFilter.controls["filterName"].value ||
      this.formFilter.controls["filterMajor"].value
    ) {
      this.statusSubmit = true;
    } else {
      this.statusSubmit = false;
    }
    this.valueSearch = this.route.snapshot.queryParamMap.get("q");
    let major_id = this.route.snapshot.queryParamMap.get("major_id");
    let skill_id = this.route.snapshot.queryParamMap.get("skill_id");
    this.formFilter.controls["filterName"].setValue(this.valueSearch);
    if (this.valueSearch != null || major_id != null || skill_id != null) {
      this.listCapacity = [];
      this.statusCapacity = false;
      this.testCapacityService.filterCapacity(this.valueSearch, major_id, skill_id).subscribe((res) => {
        if (res.status) {
          if (res.payload.data.length <= 0) {
            this.statusCapacity = true;
            this.statusNotResultReturn = true;
          } else {
            this.listCapacity = res.payload.data;
            this.statusCapacity = true;
            this.scrollWin();
          }
        }
      });
    } else {
      this.getListTestCapacity();
    }

    this.getListKeywordTrending();
    this.getListMajor();
    this.getAllSkill();
  }

  resetFilterCapacity() {
    this.formFilter.controls["filterMajor"].setValue("");
    this.formFilter.controls["filterSkill"].setValue("");
    this.formFilter.controls["filterName"].setValue("");
    this.router.navigateByUrl(`danh-gia-nang-luc/list`);
    this.statusSubmit = false;
    this.statusMajor = false;
    this.statusSkill = false;
    this.listCapacity = [];
    this.statusNotResultReturn = false;
    this.statusCapacity = false;
    this.getListTestCapacity();
  }

  getListTestCapacity() {
    this.testCapacityService.getAllTestCapacity().subscribe((res) => {
      if (res.status) {
        this.listCapacity = res.payload.data;
        this.listCapacity ? (this.statusCapacity = true) : this.statusCapacity;
        this.scrollWin();
      }
    });
  }

  getListKeywordTrending() {
    this.testCapacityService.getAllKeywordTrendingCapacity().subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload;
        // Chỉ lấy ra 5 phần tử đầu tiên trong mảng
        this.keywordTrending = arrResult.filter((res: any, index: number) => {
          return index <= 4;
        });
        this.keywordTrending ? (this.statusKeywordTrending = true) : this.statusKeywordTrending;
      }
    });
  }

  // Set filter value
  setValueFilterMajor(item: Major) {
    this.formFilter.controls["filterMajor"].setValue(item.name);
    this.statusSubmit = true;
    this.statusMajor = true;
  }

  // Set filter status
  setValueSkill(skill: Skill) {
    this.formFilter.controls["filterSkill"].setValue(skill.name);
    this.statusSubmit = true;
    this.statusSkill = true;
  }

  // Set keyword
  setValueKeyword(event: any) {
    if (event.target.value == "") {
      this.statusSubmit = false;
      if (this.statusSkill || this.statusMajor) {
        this.statusSubmit = true;
      }
    } else {
      this.formFilter.controls["filterName"].setValue(event.target.value);
      this.statusSubmit = true;
    }
  }

  // Set keywordTrending to input search when click
  setValueKeywordTrending(keyword: string) {
    let major_id = 0;
    let skill_id = 0;
    this.formFilter.controls["filterName"].setValue(keyword);
    this.router.navigateByUrl(`danh-gia-nang-luc/list?q=${keyword}`);
    this.testCapacityService.filterCapacity(keyword, major_id, skill_id).subscribe((res) => {
      if (res.status) {
        if (res.payload.data.length <= 0) {
          this.statusCapacity = true;
          this.statusNotResultReturn = true;
          this.listCapacity = [];
        } else {
          this.listCapacity = res.payload.data;
          this.statusCapacity = true;
          this.scrollWin();
        }
      }
    });
  }

  // Fillter
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
      case "skill":
        if (!value) {
          this.getAllSkill();
          this.statusSubmit = false;
        } else {
          this.skills = arr.filter((item) => {
            return this.configService.changeString(item.name).includes(this.configService.changeString(value));
          });
        }
        break;

      default:
        break;
    }
  }

  // ScrollWin
  scrollWin() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Filter Capacity
  filterCapacity() {
    this.listCapacity = [];
    this.statusNotResultReturn = false;
    this.statusCapacity = false;
    let major_id: number | string = "";
    let keyword = "";

    if (this.formFilter.controls["filterName"].value) {
      keyword = this.formFilter.controls["filterName"].value;
    }

    if (this.formFilter.controls["filterMajor"].value) {
      major_id = this.majors.filter((item) => item.name === this.formFilter.controls["filterMajor"].value)[0].id;
    }

    if (this.formFilter.controls["filterSkill"].value) {
      this.skill_id = this.skills.filter((item) => item.name === this.formFilter.controls["filterSkill"].value)[0].id;
    }

    // đẩy param search lên URL
    this.router.navigateByUrl(`danh-gia-nang-luc/list?q=${keyword}&major_id=${major_id}&skill_id=${this.skill_id}`);

    this.testCapacityService.filterCapacity(keyword, major_id, this.skill_id).subscribe((res) => {
      if (res.status) {
        this.statusSubmit = true;
        if (res.payload.data.length <= 0) {
          this.statusCapacity = true;
          this.statusNotResultReturn = true;
        } else {
          this.listCapacity = res.payload.data;
          this.statusCapacity = true;
          this.statusNotResultReturn = false;
          this.scrollWin();
        }
      }
    });
  }

  // // Get all skill và lấy param set lại value cho input
  getAllSkill() {
    let skill_id: any = this.route.snapshot.queryParamMap.get("skill_id");
    this.skillService.getAll().subscribe((res) => {
      if (res.status) {
        this.skills = res.payload;
        let skills_query;
        for (let index = 0; index < this.skills.length; index++) {
          if (skill_id == this.skills[index].id) {
            skills_query = this.skills[index].name;
          }
        }
        this.formFilter.controls["filterSkill"].setValue(skills_query);
      }
    });
  }

  // Get all Chuyên ngành và lấy param set lại value cho input
  getListMajor() {
    let major_id: any = this.route.snapshot.queryParamMap.get("major_id");
    this.majorService.getAll().subscribe((res) => {
      if (res.status) {
        this.majors = res.payload;
        let major_query;
        for (let index = 0; index < this.majors.length; index++) {
          if (major_id == this.majors[index].id) {
            major_query = this.majors[index].name;
          }
        }
        this.formFilter.controls["filterMajor"].setValue(major_query);
      }
    });
  }
}
