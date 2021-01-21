import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSucceeded({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('addToReadingListFailed should undo book addition to the state', () => {
      const action = ReadingListActions.addToReadingListFailed({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('removeFromReadingListFailed should undo book removal from the state', () => {
      const action = ReadingListActions.removeFromReadingListFailed({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('markBookAsFinished should mark book as finished in state', () => {
      const finishedDate = new Date().toISOString();
      const item = createReadingListItem('B');
      const action = ReadingListActions.markBookAsFinished({
        bookId: item.bookId,
        finishedDate
      });

      const result: State = reducer(state, action);

      expect(result.entities[item.bookId].finishedDate).toEqual(finishedDate);
      expect(result.entities[item.bookId].finished).toBe(true);
    });

    it('markBookAsFinishedFailed should undo book marked as finished in state', () => {
      const item = createReadingListItem('B');
      const action = ReadingListActions.markBookAsFinishedFailed({
        bookId: item.bookId
      });

      const result: State = reducer(state, action);

      expect(result.entities[item.bookId].finishedDate).toEqual('');
      expect(result.entities[item.bookId].finished).toBe(false);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
