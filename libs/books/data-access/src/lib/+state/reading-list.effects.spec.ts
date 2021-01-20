import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  createReadingListItem,
  SharedTestingModule
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
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
    it('should work', done => {
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

  describe('markBookAsFinished$', () => {
    let item: ReadingListItem;
    let finishedDate: string;

    beforeAll(() => {
      item = createReadingListItem('A');
      finishedDate = new Date().toISOString();
    });

    it('should add a book to the reading list successfully', (done) => {
      actions.next(ReadingListActions.markBookAsFinished({ bookId: item.bookId, finishedDate }));

      effects.markBookAsFinished$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.markBookAsFinishedSucceeded()
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${item.bookId}/finished`)
        .flush([item]);
    });

    it('should undo the added book when API returns error', (done) => {
      actions.next(ReadingListActions.markBookAsFinished({ bookId: item.bookId, finishedDate }));

      effects.markBookAsFinished$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.markBookAsFinishedFailed({ bookId: item.bookId })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${item.bookId}/finished`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });
});
