import { User } from "./../../models/user";
import { UserService } from "./../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChallengeService } from "src/app/services/challenge.service";
import { Challenge, CurrentTestCase, SampleCode, TestCase } from "src/app/models/challenge.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "src/app/modal/dialog-confirm/dialog-confirm.component";

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

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private userService: UserService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
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

      this.challengeService.getChallenge(id).subscribe(({ status, payload }) => {
        if (status) {
          this.challenge = payload;
          this.samplesCode = payload.sample_code;
          this.testCases = payload.test_case;
          console.log(this.testCases);

          // code mẫu mặc định
          this.code = this.samplesCode[0].code_run;
          this.editorOptions.language = this.samplesCode[0].code_language.ex;
          this.codeLangId = this.samplesCode[0].code_language.id;

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
    const sampleCodeId = (event.target as HTMLInputElement).value;
    const sampleCodeExits = this.samplesCode.find((item) => item.id === +sampleCodeId);

    this.code = sampleCodeExits?.code_run!;
    this.editorOptions = {
      ...this.editorOptions,
      language: sampleCodeExits?.code_language.type!,
    };
    this.codeLangId = sampleCodeExits?.code_language.id!;
  }

  // chạy thử
  handleRunCode() {
    this.challengeService
      .runTestCase({
        type_id: this.codeLangId,
        content: this.code,
        challengeId: this.challengeId,
      })
      .subscribe((res) => {
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

        this.statusRunTestCase = {
          status: isPassAll,
          message: `${testCasePassed}/${totalTestCasePublic} test case đúng.`,
        };

        console.log(this.testCases);
      });
    console.log(this.code, this.codeLangId);
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

    console.log(this.currentTestCase);
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
}
