import { NgToastService } from "ng-angular-popup";
import { User } from "./../../models/user";
import { UserService } from "./../../services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChallengeService } from "src/app/services/challenge.service";
import {
  Challenge,
  CurrentTestCase,
  RankChallenge,
  ResultChallenge,
  SampleCode,
  TestCase,
} from "src/app/models/challenge.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "src/app/modal/dialog-confirm/dialog-confirm.component";
import { ModalSubmitChallengeSuccessComponent } from "src/app/modal/modal-submit-challenge-success/modal-submit-challenge-success.component";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-challenge-exam",
  templateUrl: "./challenge-exam.component.html",
  styleUrls: ["./challenge-exam.component.css"],
})
export class ChallengeExamComponent implements OnInit, OnDestroy {
  challenge!: Challenge;
  isLogged = false;
  userLogged!: User;
  isFullScreen = false;
  isFetchingChallenge = false;
  isRunningCode!: boolean;
  isActiveOverlayLeft!: boolean;

  // ds code mẫu
  samplesCode!: SampleCode[];

  editorOptions = {
    theme: "vs-dark",
    language: "",
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
    renderWhitespace: false,
  };
  code!: string;
  // id ngôn ngữ code
  codeLangId!: number;
  challengeId!: number;
  testCases!: TestCase[];
  currentTestCase!: CurrentTestCase;

  // message chạy test case
  statusRunTestCase!: {
    status: boolean;
    message: string;
  };

  // trạng thái làm thử thách
  statusTakeChallenge!: number; // 0 - chưa làm, 1 - đã làm

  // kết quả nộp bài
  resultChallenge!: ResultChallenge;

  // kích hoạt button nộp bài
  isActiveSubmitCode = false;

  tabActive = "issue";

  sidebarList = [
    {
      name: "issue",
      title: "Vấn đề",
      icon: "fa-solid fa-book-open",
    },
    {
      name: "rank",
      title: "Bảng xếp hạng",
      icon: "fa-solid fa-list",
    },
    {
      name: "history",
      title: "Lịch sử nộp",
      icon: "fa-solid fa-clock-rotate-left",
    },
    {
      name: "comment",
      title: "Bình luận",
      icon: "fa-regular fa-message",
    },
    {
      name: "question",
      title: "Câu hỏi",
      icon: "fa-regular fa-circle-question",
    },
  ];

  ranks!: RankChallenge[];

  paginateRank = {
    page: 1,
    limit: 10,
    total: 0,
  };

  isFetchingRank!: boolean;
  codeLanguageIdRank!: number;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private userService: UserService,
    public dialog: MatDialog,
    private toastService: NgToastService,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    // initital title
    this.titleService.setTitle("THỬ THÁCH");

    document.body.style.overflow = "hidden";
    this.checkUserLogged();
    this.getChallenge();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = "auto";
  }

  getChallenge() {
    this.route.params.subscribe((params) => {
      const { id } = params;
      this.challengeId = id;
      this.isFetchingChallenge = true;

      this.challengeService.getChallenge(id).subscribe(({ status, payload }) => {
        this.isFetchingChallenge = false;

        if (status) {
          // update title
          this.titleService.setTitle(`THỬ THÁCH #${payload.id}: ${payload.name}`);

          this.challenge = payload;
          this.samplesCode = payload.sample_code;
          this.testCases = payload.test_case;

          // code mẫu mặc định
          this.handleSetDataEditor(
            this.samplesCode[0].code_run,
            this.samplesCode[0].code_language.language,
            this.samplesCode[0].code_language.id,
          );

          // test case mặc định
          this.currentTestCase = {
            id: this.testCases[0].id,
            panel: {
              input: this.testCases[0].input,
              output: this.testCases[0].output,
              result: "",
              time: "0",
            },
            isPrivate: !this.testCases[0].status,
          };

          if (this.isLogged) {
            // kiểm tra trạng thái làm thử thách
            const result = payload.result.find((item: ResultChallenge) => item.user_id === this.userLogged.id);
            if (result) {
              this.statusTakeChallenge = 1;
              this.resultChallenge = result;
              this.code = result.code_result;

              // data code lang
              const codeLang = this.samplesCode.find((item) => item.code_language_id === result.code_language_id);
              this.editorOptions = {
                ...this.editorOptions,
                language: codeLang?.code_language.language!,
              };
              this.codeLangId = codeLang?.code_language.id!;
              this.codeLanguageIdRank = codeLang?.code_language.id!;
            } else {
              this.statusTakeChallenge = 0;
            }
          }
        }
      });
    });
  }

  checkUserLogged() {
    const user = this.userService.getUserValue();
    const jwtToken = this.userService.getJwtToken();
    const isLoggedin = user && jwtToken;

    this.isLogged = !!isLoggedin;
    this.userLogged = user;
  }

  // đóng mở full màn hình editor
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  // get loại bài thử thách
  getTypeChallenge(type: number) {
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

  // bắt sự kiện thay đổi ngôn ngữ
  handleChangeLanguage(event: Event) {
    this.isActiveSubmitCode = false;

    const sampleCodeId = (event.target as HTMLInputElement).value;
    const sampleCodeExits = this.samplesCode.find((item) => item.id === +sampleCodeId);

    this.editorOptions = {
      ...this.editorOptions,
      language: sampleCodeExits?.code_language.language!,
    };
    this.codeLangId = sampleCodeExits?.code_language.id!;

    // nếu chọn ngôn ngữ đã nộp trước đó => hiển thị code đã nộp trước đó
    if (this.statusTakeChallenge === 1 && sampleCodeExits?.code_language_id === this.resultChallenge.code_language_id) {
      this.code = this.resultChallenge.code_result;
    } else {
      this.code = sampleCodeExits?.code_run!;
    }
  }

  // chạy thử
  handleRunCode() {
    if (this.isRunningCode) return;

    // show loading
    this.isRunningCode = true;
    this.challengeService
      .runTestCase({
        type_id: this.codeLangId,
        content: this.code,
        challengeId: this.challengeId,
      })
      .subscribe(
        (res) => {
          // hide loading
          this.isRunningCode = false;

          this.testCases = this.testCases.map((testCase) => {
            const testCaseExits = res.find((item) => item.id === testCase.id);

            // đổ dữ liệu test case đang active
            if (testCaseExits?.id === this.currentTestCase.id) {
              this.currentTestCase = {
                ...this.currentTestCase,
                panel: {
                  ...this.currentTestCase.panel,
                  result: testCaseExits.result,
                  time: testCaseExits.time,
                },
              };
            }

            if (testCaseExits) {
              return {
                ...testCase,
                passed: testCaseExits?.flag!,
                result: testCaseExits?.result!,
                statusRunCode: true,
                time: testCaseExits?.time!,
              };
            }

            return {
              ...testCase,
              statusRunCode: false,
            };
          });

          // message chạy test case
          const totalTestCasePublic = this.testCases.filter((item) => item.status).length;
          const testCasePassed = res.filter((item) => item.flag).length;
          const isPassAll = totalTestCasePublic === testCasePassed;

          const messageTestCase = !isPassAll
            ? `${testCasePassed}/${totalTestCasePublic} test case đúng.`
            : "<b>Vượt qua kiểm thử mẫu</b><p>Ấn Nộp bài để chạy toàn bộ test case và lưu kết quả của bạn.</p>";

          this.statusRunTestCase = {
            status: isPassAll,
            message: messageTestCase,
          };

          // nếu vượt qua tất cả test case => nộp bài
          this.isActiveSubmitCode = isPassAll;
        },
        () => {
          this.isRunningCode = false;
        },
      );
  }

  // nộp bài
  handleSubmitCode() {
    if (!this.isActiveSubmitCode || this.isRunningCode) return;
    this.isRunningCode = true;

    this.challengeService
      .submitCode({
        type_id: this.codeLangId,
        content: this.code,
        challengeId: this.challengeId,
      })
      .subscribe(
        ({ status, data, data_result }) => {
          this.isRunningCode = false;
          this.testCases = this.testCases.map((testCase) => {
            const testCaseExits = data.find((item) => item.id === testCase.id);

            // đổ dữ liệu test case đang active
            if (testCaseExits?.id === this.currentTestCase.id) {
              this.currentTestCase = {
                ...this.currentTestCase,
                panel: {
                  ...this.currentTestCase.panel,
                  result: testCaseExits.result,
                  time: testCaseExits.time,
                },
              };
            }

            if (testCaseExits) {
              return {
                ...testCase,
                passed: testCaseExits?.flag!,
                result: testCaseExits?.result!,
                statusRunCode: true,
                time: testCaseExits?.time!,
              };
            }

            return {
              ...testCase,
              statusRunCode: false,
            };
          });

          // message chạy test case
          const totalTestCase = this.testCases.length;
          const testCasePassed = data.filter((item) => item.flag).length;
          const totalTestCasePrivate = data.filter((item) => !item.flag && item.status === 0).length;
          const isPassAll = totalTestCase === testCasePassed;

          const messageTestCase = !isPassAll
            ? `${testCasePassed}/${totalTestCase} test case đúng. (${totalTestCasePrivate} test case ẩn sai).`
            : "Bạn đã vượt qua tất cả các test case.";

          this.statusRunTestCase = {
            status: isPassAll,
            message: messageTestCase,
          };

          // modal thông báo hoàn thành bài thi
          if (isPassAll) {
            const modalRef = this.dialog.open(ModalSubmitChallengeSuccessComponent, {
              width: "600px",
              data: {
                name: this.userLogged.name,
              },
            });
            modalRef.afterClosed().subscribe((res) => {
              if (res === "true") {
                this.router.navigate(["/challenge"]);
              }
            });
          }

          // show lịch sử nộp bài
          this.statusTakeChallenge = 0;
          this.isActiveOverlayLeft = true;
          this.tabActive = "history";
          setTimeout(() => {
            // update lịch sử nộp bài
            this.resultChallenge = data_result;
            this.statusTakeChallenge = 1;
            this.isActiveOverlayLeft = false;
          }, 2000);
        },
        () => {
          this.isRunningCode = false;
          this.toastService.info({ detail: "Đã có lỗi xảy ra", summary: "Vui lòng thử lại!" });
        },
      );
  }

  // xử lý click tab test case
  handleChangeTestCase(id: number) {
    const testCaseExits = this.testCases.find((item) => item.id === id);

    this.currentTestCase = {
      id,
      panel: {
        input: testCaseExits?.input!,
        output: testCaseExits?.output!,
        result: testCaseExits?.result!,
        time: testCaseExits?.time! || "0",
      },
      isPrivate: !testCaseExits?.status,
    };
  }

  // xử lý reset code
  handleResetCode() {
    const confirmRef = this.dialog.open(DialogConfirmComponent, {
      width: "450px",
      data: {
        title: "Xác nhận",
        description: "Bạn có chắc muốn reset code của mình?",
        textCancel: "Hủy",
        textOk: "Có",
      },
    });

    confirmRef.afterClosed().subscribe((result) => {
      if (result === "true") {
        const sampleCodeExits = this.samplesCode.find((item) => item.code_language_id === this.codeLangId);

        this.code = sampleCodeExits?.code_run!;
      }
    });
  }

  // xử lý click tab sidebar
  handleChangeTab(tabName: string) {
    this.tabActive = tabName;

    if (tabName === "rank") {
      const { total, page, ...rest } = this.paginateRank;
      this.getRank({
        challengeId: this.challengeId,
        languageId: this.codeLanguageIdRank,
        ...rest,
      });
    } else {
      this.isActiveOverlayLeft = false;
    }
  }

  // xếp hạng
  getRank({ challengeId, languageId, ...rest }: any) {
    this.isActiveOverlayLeft = true;

    if (this.isFetchingRank) return;
    this.isFetchingRank = true;

    this.challengeService.getRankChallenge({ challengeId, languageId, ...rest }).subscribe(
      ({ status, payload }) => {
        if (status) {
          this.isActiveOverlayLeft = false;
          this.isFetchingRank = false;
          this.paginateRank = {
            ...this.paginateRank,
            total: payload.total,
            page: payload.current_page,
          };
          this.ranks = payload.data;
        }
      },
      () => {
        this.isFetchingRank = false;
        this.toastService.warning({ summary: "Có lỗi xảy ra, vui lòng thử lại", detail: "Thông báo" });
      },
    );
  }

  // set code, code language to editor
  handleSetDataEditor(code: string, language: string, codeLangId: number) {
    this.code = code;
    this.editorOptions = {
      ...this.editorOptions,
      language,
    };
    this.codeLangId = codeLangId;
  }

  // xử lý chuyển trang
  handleChangePageNum(page: number) {
    this.paginateRank = {
      ...this.paginateRank,
      page,
    };

    const { total, ...rest } = this.paginateRank;
    this.getRank({
      challengeId: this.challengeId,
      languageId: this.codeLanguageIdRank,
      ...rest,
    });
  }

  // xử lý change code languge rank
  handleChangeCodeLanguageRank(e: Event) {
    const codeLangId = (e.target as HTMLInputElement).value;
    this.codeLanguageIdRank = +codeLangId;
    const { page, total, ...rest } = this.paginateRank;

    this.getRank({
      challengeId: this.challengeId,
      languageId: this.codeLanguageIdRank,
      ...rest,
    });
  }

  // lắng nghe code thay đổi
  handleChangeCode() {
    if (this.isActiveSubmitCode) this.isActiveSubmitCode = false;
  }
}
