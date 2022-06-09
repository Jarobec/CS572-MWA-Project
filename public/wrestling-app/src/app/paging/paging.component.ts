import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css'],
})
export class PagingComponent implements OnInit {
  pageNumbers!: number[];
  activePageIndex: number = 0;
  totalPage!: number;
  @Output()
  pageEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  @Input()
  set createPages(totalPage: number) {
    this.totalPage = totalPage;
    this.pageNumbers = new Array<number>(totalPage);
  }

  selectPage(pageIndex: number) {
    this.activePageIndex = pageIndex;
    this.pageEvent.emit(pageIndex);
  }

  onPrevious(): void {
    this.selectPage(this.activePageIndex - 1);
  }

  onNext(): void {
    this.selectPage(this.activePageIndex + 1);
  }
}
