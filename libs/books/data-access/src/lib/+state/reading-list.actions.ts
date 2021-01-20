import { createAction, props } from '@ngrx/store';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { BOOKS_DATA_ACCESS_CONSTANTS as ACTION_CONSTANTS } from '../books-data-access.module.constants';

export const init = createAction('[Reading List] Initialize');

export const loadReadingListSucceeded = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.LOAD_READINGLIST_SUCCEEDED,
  props<{ list: ReadingListItem[] }>()
);
export const loadReadingListFailed = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.LOAD_READINGLIST_FAILED,
  props<{ error: string }>()
);

export const addToReadingList = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.ADD_TO_READINGLIST,
  props<{ book: Book, isUndo?: Boolean }>()
);

export const addToReadingListFailed = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.ADD_TO_READINGLIST_FAILED,
  props<{ book: Book }>()
);

export const addToReadingListSucceeded = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.ADD_TO_READINGLIST_SUCCEEDED,
  props<{ book: Book, isUndo: Boolean }>()
);

export const removeFromReadingList = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.REMOVE_FROM_READINGLIST,
  props<{ item: ReadingListItem, isUndo?: Boolean }>()
);

export const removeFromReadingListFailed = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.REMOVE_FROM_READINGLIST_FAILED,
  props<{ item: ReadingListItem }>()
);

export const removeFromReadingListSucceeded = createAction(
  ACTION_CONSTANTS.ACTION_TYPE.REMOVE_FROM_READINGLIST_SUCCEEDED,
  props<{ item: ReadingListItem, isUndo: Boolean }>()
);
