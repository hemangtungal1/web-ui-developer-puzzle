import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, take, tap } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { Store } from '@ngrx/store';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { BOOKS_DATA_ACCESS_CONSTANTS as CONSTANTS } from '../books-data-access.module.constants';
import { TypedAction } from '@ngrx/store/src/models';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(CONSTANTS.READING_LIST_API).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSucceeded({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListFailed({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, isUndo }) =>
        this.http.post(CONSTANTS.READING_LIST_API, book).pipe(
          map(() =>
            ReadingListActions.addToReadingListSucceeded({
              book,
              isUndo: !!isUndo
            })
          ),
          catchError(() =>
            of(ReadingListActions.addToReadingListFailed({ book }))
          )
        )
      )
    )
  );

  addToReadingListSucceeded$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.addToReadingListSucceeded),
        tap(({ book, isUndo }) => {
          if (!isUndo) {
            const { id, ...rest } = book;
            const item: ReadingListItem = {
              bookId: book.id,
              ...rest
            };

            this.openSnackBar(
              `${book.title} ${CONSTANTS.SNACK_BAR.ADD_MESSAGE}`,
              CONSTANTS.SNACK_BAR.ACTION_TEXT,
              ReadingListActions.removeFromReadingList({
                item,
                isUndo: true
              })
            );
          }
        })
      ),
    {
      dispatch: false
    }
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, isUndo }) =>
        this.http.delete(`${CONSTANTS.READING_LIST_API}/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.removeFromReadingListSucceeded({
              item,
              isUndo: !!isUndo
            })
          ),
          catchError(() =>
            of(ReadingListActions.removeFromReadingListFailed({ item }))
          )
        )
      )
    )
  );

  removeFromReadingListSucceeded$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.removeFromReadingListSucceeded),
        tap(({ item, isUndo }) => {
          if (!isUndo) {
            const { bookId, ...rest } = item;
            const book: Book = {
              id: item.bookId,
              ...rest
            };

            this.openSnackBar(
              `${item.title} ${CONSTANTS.SNACK_BAR.DELETE_MESSAGE}`,
              CONSTANTS.SNACK_BAR.ACTION_TEXT,
              ReadingListActions.addToReadingList({
                book,
                isUndo: true
              })
            );
          }
        })
      ),
    {
      dispatch: false
    }
  );

  openSnackBar = (
    message: string,
    actionText: string,
    action: TypedAction<string>
  ) => {
    this.snackBar
      .open(message, actionText, {
        duration: CONSTANTS.SNACK_BAR.DURATION,
        horizontalPosition: <MatSnackBarHorizontalPosition>(
          CONSTANTS.SNACK_BAR.HORIZONTAL_POSITION
        ),
        verticalPosition: <MatSnackBarVerticalPosition>(
          CONSTANTS.SNACK_BAR.VERTICAL_POSITION
        )
      })
      .onAction()
      .subscribe(() => {
        this.store.dispatch(action);
      });
  };

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
