import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$ = this.store.select(getAllBooks);

  searchForm = this.fb.group({
    term: ''
  });

  unsubscribeSubject$ = new Subject();

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.searchForm
      .get('term')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribeSubject$)
      ).subscribe(() => this.searchBooks());
  }

  /**
   * OnDestroy is used to destroy any subscriptions that has been subscribed
   * HostListener is added to handle window unload scenario.
   * ngOnDestroy is not triggered when the window gets unloaded.
   */
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.unsubscribeSubject$.next();
    this.unsubscribeSubject$.complete();
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
  }

  searchBooks(): void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
