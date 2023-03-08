import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { map, switchMap } from "rxjs";
import { Post } from "src/app/models/post.model";
import { ResponsePayload } from "src/app/models/response-payload";
import { ListPostService } from "src/app/services/list-post.service";

@Component({
  selector: "app-modal-upload-cv",
  templateUrl: "./modal-upload-cv.component.html",
  styleUrls: ["./modal-upload-cv.component.css"],
})
export class ModalUploadCvComponent implements OnInit {
  postDetail: Post;
  validateForm!: FormGroup;
  statusRegister: boolean = true;
  statusLinkCv: boolean = false;
  fileUpload: any;

  // set up form control
  formUploadCv = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    studentCode: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9]{7}")]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]),
    file_link: new FormControl(""),
  });

  get name() {
    return this.formUploadCv.get("name");
  }

  get studentCode() {
    return this.formUploadCv.get("studentCode");
  }
  get email() {
    return this.formUploadCv.get("email");
  }
  get phone() {
    return this.formUploadCv.get("phone");
  }
  get file_link() {
    return this.formUploadCv.get("file_link");
  }

  constructor(
    public dialogRef: MatDialogRef<ModalUploadCvComponent>,
    private postService: ListPostService,
    private toast: NgToastService,
    @Inject(MAT_DIALOG_DATA)
    public dataPostDetail: { postDetail: Post },
  ) {}

  ngOnInit(): void {}
  closeDialog() {
    this.dialogRef.close("Pizza!");
  }

  // review file upload
  preview(files: any) {
    var errorLink = document.querySelector("#error-link");
    let countTrue: number = 0;
    const validFileExtensions = ["docx", "pdf", "doc", "xls"];
    validFileExtensions.forEach((ext) => {
      if (files[0].name.endsWith(ext)) {
        countTrue++;
      }
    });

    if (countTrue !== 0) {
      this.statusLinkCv = true;
      if (files.length === 0) return;
      this.fileUpload = files[0];
      errorLink?.classList.add("d-none");
    } else {
      errorLink?.classList.remove("d-none");
    }
  }

  //Send information Upload cv
  onSubmit() {
    this.statusRegister = false;
    let dataInput = { ...this.formUploadCv.value };
    var formDataInput = new FormData();

    formDataInput.append("name", dataInput.name);
    formDataInput.append("student_code", dataInput.studentCode);
    formDataInput.append("email", dataInput.email);
    formDataInput.append("phone", dataInput.phone);
    formDataInput.append("file_link", this.fileUpload);
    if (this.dataPostDetail.postDetail) formDataInput.append("post_id", this.dataPostDetail.postDetail.id);

    setTimeout(() => {
      this.postService.uploadCV(formDataInput).subscribe((res: any) => {
        console.log(res);
        if (res.status == false) {
          this.toast.warning({ summary: res.message.file_link[0], duration: 2000, detail: "Cảnh báo" });
        } else {
          this.statusRegister = true;
          this.toast.success({ summary: "Upload CV thành công", duration: 2000, detail: "Thông báo" });
          this.dialogRef.close();
        }
        return "Ok";
      });
    }, 1000);
  }

  confirmClose() {
    const confirm = window.confirm("Bạn có muốn hủy không?");
    if (confirm) {
      this.dialogRef.close();
    }
  }
}
