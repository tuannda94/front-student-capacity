import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent implements OnInit {
  @Input() total!: number;
  @Input() currentPage = 1;
  @Input() pageSize!: number;
  @Output() changePageNumber = new EventEmitter<number>();

  totalPages!: number;
  paginationHtmlStr = "";

  constructor() {}

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.total / this.pageSize);
    this.createPagination(this.totalPages, this.currentPage);
  }

  createPagination(totalPages: number, currentPage: number) {
    let liElementStr = "";

    // prev button
    liElementStr += `
      <li title="Previous Page" class="pagination-list_box ${
        currentPage <= 1 && "pagination-list_box--disabled"
      } pagination-list_first">
        <i class="fa-solid fa-angle-left"></i>
      </li>
    `;

    for (let page = 1; page <= totalPages; page++) {
      liElementStr += `<li title="${page}" class="pagination-list_box pagination-item pagination-item__page ${
        page === currentPage && "active"
      }">${page}</li>`;
    }

    // next button
    liElementStr += `
        <li title="Next Page" class="pagination-list_box ${
          currentPage >= totalPages && "pagination-list_box--disabled"
        } pagination-list_last">
          <i class="fa-solid fa-angle-right"></i>
        </li>
      `;
    this.paginationHtmlStr = liElementStr;
  }

  handleChangePageNumber(page: number) {
    this.changePageNumber.emit(page);
  }

  ngAfterViewChecked() {
    const prevElement: HTMLElement = document.querySelector(".pagination-list_first")!;
    const nextElement: HTMLElement = document.querySelector(".pagination-list_last")!;
    const pageElements: NodeList = document.querySelectorAll(".pagination-item__page")!;

    // handle prev
    if (prevElement) {
      prevElement.onclick = () => {
        if (this.currentPage <= 1) return;
        this.createPagination(this.totalPages, --this.currentPage);
        this.handleChangePageNumber(this.currentPage);
      };
    }

    // handle next
    if (nextElement) {
      nextElement.onclick = () => {
        if (this.currentPage >= this.totalPages) return;

        this.createPagination(this.totalPages, ++this.currentPage);
        this.handleChangePageNumber(this.currentPage);
      };
    }

    // handle go to page
    if (pageElements) {
      pageElements.forEach((pageElement: any) => {
        pageElement.onclick = (e: Event) => {
          const page = (e.target as HTMLElement).innerText;
          this.currentPage = +page;
          this.createPagination(this.totalPages, this.currentPage);
          this.handleChangePageNumber(this.currentPage);
        };
      });
    }
  }
}
