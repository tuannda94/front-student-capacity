import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Challenge } from "src/app/models/challenge.model";
import { Slider } from "src/app/models/slider.model";
import { ChallengeService } from "src/app/services/challenge.service";
import { SliderService } from "src/app/services/slider.service";

@Component({
  selector: "app-challenge",
  templateUrl: "./challenge.component.html",
  styleUrls: ["./challenge.component.css"],
})
export class ChallengeComponent implements OnInit {
  challenges!: Challenge[];
  totalChallenge!: number;
  limitLangs = 4;
  // limit challenge
  limit = 10;
  isFetchingChallenge!: boolean;
  params: { page: number; limit: number; q?: string; type?: number; language_id?: number } = {
    page: 1,
    limit: this.limit,
  };
  isFetchingCodeLang!: boolean;
  isFetchingSlider!: boolean;

  queryParams!: { page: number; limit?: number; q?: string; type?: number; language_id?: number };

  formSearch!: FormGroup;

  challengeType = [
    {
      type: undefined,
      name: "Tất cả",
    },
    {
      type: 0,
      name: "Dễ",
    },
    {
      type: 1,
      name: "Trung bình",
    },
    {
      type: 2,
      name: "Khó",
    },
  ];

  challengeLangs: { id: number; name: string }[] = [
    {
      id: 0,
      name: "Tất cả",
    },
  ];

  slider!: Slider;

  constructor(
    private challengeService: ChallengeService,
    private sliderService: SliderService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.formSearch = new FormGroup({
      keyword: new FormControl(""),
      typeName: new FormControl(""),
      languageName: new FormControl(""),
      type: new FormControl(),
      language: new FormControl(),
    });

    this.titleService.setTitle("Thử thách");
    this.handleScrollTop();

    // get slider
    this.getSlider();

    // get ds ngôn ngữ code
    this.isFetchingCodeLang = true;
    this.isFetchingChallenge = true;
    this.challengeService.getCodeLanguage().subscribe(
      ({ status, payload }) => {
        this.isFetchingCodeLang = false;

        if (status) {
          this.challengeLangs = [...this.challengeLangs, ...payload];
          this.setDefaultValueFormSearch();
          this.getChallenges();
        }
      },
      () => {
        this.isFetchingCodeLang = false;
      },
    );
  }

  getSlider() {
    this.isFetchingSlider = true;

    this.sliderService
      .getSliderByParams({
        code: 1,
      })
      .subscribe(({ status, payload }) => {
        if (status) {
          this.isFetchingSlider = false;

          this.slider = payload[0];
        }
      });
  }

  getChallenges() {
    !this.isFetchingChallenge && (this.isFetchingChallenge = true);

    this.challengeService.getChallenges(this.params).subscribe((res) => {
      this.isFetchingChallenge = false;

      if (res.status) {
        this.totalChallenge = res.payload.total;
        this.challenges = res.payload.data.map((item: Challenge) => {
          // ds ngôn ngữ code
          const codeLangs = item.sample_code.map((sampleItem) => sampleItem.code_language);

          // số user vượt qua thử thách
          const userPass = item.result.filter((resultItem) => resultItem.status === 1);

          // tooltip khi vượt quá limit
          let tooltipLang = "";
          if (codeLangs.length > this.limitLangs) {
            tooltipLang = codeLangs
              .slice(this.limitLangs)
              .map((x) => x.ex.toUpperCase())
              .join(", ");
          }

          return {
            ...item,
            tooltipLang,
            codeLangs,
            userPassed: userPass.length,
          };
        });
      }
    });
  }

  setDefaultValueFormSearch() {
    this.queryParams = this.params;

    // set query str from url to params varible
    const queryParams = this.route.snapshot.queryParamMap;
    const keyword = queryParams.get("q");
    const type = queryParams.get("type");
    const language = queryParams.get("language_id");
    const page = queryParams.get("page");

    if (keyword && keyword.trim()) {
      this.formSearch.patchValue({
        keyword,
      });

      this.params.q = keyword.trim();
    }
    if ((type || +type! === 0) && type !== null) {
      const typeExits = this.challengeType.find((item) => item.type === +type);

      this.formSearch.patchValue({
        type,
        typeName: typeExits?.name,
      });

      this.params.type = +type!;
    }

    if (+language!) {
      const languageExits = this.challengeLangs.find((item) => item.id === +language!);

      this.formSearch.patchValue({
        language,
        languageName: languageExits?.name,
      });

      this.params.language_id = +language!;
    }

    if (+page!) this.params.page = +page!;
  }

  // get mức độ thử thách
  getTypeChallenge(type: number): string {
    switch (type) {
      case 0:
        return "Mức độ dễ";
      case 1:
        return "Mức độ trung bình";
      case 2:
        return "Mức độ khó";
      default:
        return "Lỗi";
    }
  }

  // xử lý chuyển trang
  handleChangePageNum(page: number) {
    this.handleScrollTop();
    this.params.page = page;
    this.getChallenges();

    // add query to url
    const { limit, ...queryParams } = this.params;
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });
  }

  // scroll to top
  handleScrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // set value to form search
  handleSetFieldValue(formControlName: string, value: string, id?: number) {
    const formSearch = this.formSearch;

    formSearch.patchValue({
      [formControlName]: value,
      [formControlName.slice(0, -4)]: id,
    });
  }

  // search
  handleSearch() {
    if (this.isFetchingChallenge) return;
    this.handleScrollTop();

    this.params.page = 1;
    let { limit, ...queryParams } = { ...this.params };
    this.queryParams = queryParams;

    const formSearch = this.formSearch;
    const keyword = formSearch.get("keyword")?.value;
    const type = formSearch.get("type")?.value;
    const language = formSearch.get("language")?.value;

    if (keyword && keyword.trim()) {
      this.params.q = keyword.trim();
      this.queryParams.q = keyword.trim();
    } else {
      delete this.params.q;
      this.queryParams.q = null!;
    }
    if (type || type === 0) {
      this.params.type = type;
      this.queryParams.type = type;
    } else {
      delete this.params.type;
      this.queryParams.type = null!;
    }
    if (language) {
      this.params.language_id = language;
      this.queryParams.language_id = language;
    } else {
      delete this.params.language_id;
      this.queryParams.language_id = null!;
    }

    this.getChallenges();

    // add param to url
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });
  }

  // reset form search
  handleResetFormSearch() {
    this.formSearch.reset();
    this.handleScrollTop();

    // remove query str
    for (let key in this.queryParams) {
      this.queryParams = {
        ...this.queryParams,
        [key]: null,
      };
    }
    this.router.navigate([], {
      queryParams: this.queryParams,
      queryParamsHandling: "merge",
    });

    this.params = {
      page: 1,
      limit: this.limit,
    };
    this.getChallenges();
  }

  // handle click to language and type for search
  handleSearchByField(field: string, value: number) {
    this.params.page = 1;

    // search by language
    if (field === "language") {
      const language = this.challengeLangs.find((item) => item.id === value);
      this.formSearch.patchValue({
        languageName: language?.name,
        language: value,
      });
    }

    if (field === "type") {
      const type = this.challengeType.find((item) => item.type === value);
      this.formSearch.patchValue({
        typeName: type?.name,
        type: value,
      });
    }

    this.handleSearch();
  }
}
