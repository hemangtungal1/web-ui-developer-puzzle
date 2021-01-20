import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  createBook,
  createReadingListItem,
  SharedTestingModule
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { BOOKS_DATA_ACCESS_CONSTANTS as CONSTANTS } from '../books-data-access.module.constants';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Book, ReadingListItem } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let item: ReadingListItem;
  let book: Book;

  beforeAll(() => {
    item = createReadingListItem('A');
    book = createBook('A');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    actions = new ReplaySubject();
  });

  describe('loadReadingList$', () => {
    it('should fetch reading list successfully', done => {
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSucceeded({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add a book to the reading list successfully', done => {
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.addToReadingListSucceeded({ book, isUndo: false })
        );
        done();
      });

      httpMock.expectOne(`${CONSTANTS.READING_LIST_API}`).flush({});
    });

    it('should undo the added book when API returns error', done => {
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.addToReadingListFailed({ book })
        );
        done();
      });

      httpMock
        .expectOne(`${CONSTANTS.READING_LIST_API}`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('addToReadingListSucceeded$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openSnackBar');
    });

    it('should open snackbar when a book is added successfully to reading list', () => {
      actions.next(
        ReadingListActions.addToReadingListSucceeded({ book, isUndo: false })
      );

      effects.addToReadingListSucceeded$.subscribe(() => {
        expect(effects.openSnackBar).toHaveBeenCalledWith(
          `${book.title} ${CONSTANTS.SNACK_BAR.ADD_MESSAGE}`,
          CONSTANTS.SNACK_BAR.ACTION_TEXT,
          ReadingListActions.removeFromReadingList({
            item,
            isUndo: true
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after removing a book', () => {
      actions.next(
        ReadingListActions.addToReadingListSucceeded({ book, isUndo: true })
      );

      effects.addToReadingListSucceeded$.subscribe(() => {
        expect(effects.openSnackBar).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeBook$', () => {
    it('should remove book successfully from reading list', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.removeFromReadingListSucceeded({
            item,
            isUndo: false
          })
        );
        done();
      });

      httpMock
        .expectOne(`${CONSTANTS.READING_LIST_API}/${item.bookId}`)
        .flush({});
    });

    it('should undo removed book when API returns error', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.removeFromReadingListFailed({
            item
          })
        );
        done();
      });

      httpMock
        .expectOne(`${CONSTANTS.READING_LIST_API}/${item.bookId}`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('removeFromReadingListSucceeded$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openSnackBar');
    });

    it('should open snackbar when book is removed successfully from reading list', () => {
      actions.next(ReadingListActions.removeFromReadingListSucceeded({ item, isUndo: false }));

      effects.removeFromReadingListSucceeded$.subscribe(() => {
        expect(effects.openSnackBar).toHaveBeenCalledWith(
          `${item.title} ${CONSTANTS.SNACK_BAR.DELETE_MESSAGE}`,
          CONSTANTS.SNACK_BAR.ACTION_TEXT,
          ReadingListActions.addToReadingList({
            book,
            isUndo: true
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after adding a book', () => {
      actions.next(ReadingListActions.removeFromReadingListSucceeded({ item, isUndo: true }));

      effects.removeFromReadingListSucceeded$.subscribe(() => {
        expect(effects.openSnackBar).not.toHaveBeenCalled();
      });
    });
  });
});
