import { Skill } from "./../../models/skill.models";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Capacity } from "src/app/models/capacity";
import { UserService } from "src/app/services/user.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-my-capacity-test",
  templateUrl: "./my-capacity-test.component.html",
  styleUrls: ["./my-capacity-test.component.css"],
})
export class MyCapacityTestComponent implements OnInit {
  formSearch: FormGroup;
  isFetchingCapacity = false;
  params: { page: number; q: string; limit: number } = {
    page: 1,
    q: "",
    limit: 9,
  };
  listCapacity: Capacity[];
  totalCapacity: number;

  constructor(private userService: UserService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle("Danh sách bài test năng lực đã làm");

    this.formSearch = new FormGroup({
      name: new FormControl("", Validators.required),
    });

    this.handleGetListCapacity();
  }

  handleGetListCapacity() {
    this.isFetchingCapacity = true;

    this.userService.getListCapacityUserHasDone(this.params).subscribe(({ status, payload }) => {
      if (status) {
        this.isFetchingCapacity = false;
        this.listCapacity = payload.data;
        this.totalCapacity = payload.total;
      }
    });
  }

  handleChangePageNum(page: number) {
    this.handleScrollTop();
    this.params.page = page;
    this.handleGetListCapacity();
  }

  handleSearch() {
    this.params = {
      ...this.params,
      q: this.formSearch.get("name")?.value.trim(),
      page: 1,
    };
    this.handleGetListCapacity();
  }

  // scroll to top
  handleScrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  getListSkillName(skills: Skill[]) {
    const listSkill = skills.map((skill) => skill.short_name);
    if (!listSkill.length) {
      return "Không có kỹ năng nào!";
    }

    return listSkill.join(", ");
  }
}
