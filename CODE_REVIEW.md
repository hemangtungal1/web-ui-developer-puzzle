# Code Review
## Code Smells

1. `this.store.select(getAllBooks)` value is never unsubscribed in `book-search.component.ts` file. If a subscription is not closed the function callback attached to it will be continuously called and this may pose a huge memory leak and performance issue. To avoid such issues - added `async` pipe in the book-search component template instead of using the subscribe method on the selector/observable.

2. `clearSearch` action doesn't clear `searchTerm` field in the state. For example if we search for `JavaScript` and clear the search-term in the search-bar, the state will still contain `searchTerm` as `JavaScript`.

3. Action naming should be consistent - action performing an event should use a past tense verb (like 'eventSucceeded').

4. `formatDate()` method in `book-search.component.ts` should be replaced with Angular's built-in date pipe. This is required as a step for performance improvement wherein having a pipe would evaluate the expression only once & will fetch the value from last result unlike the method which would invoke every time a change is detected.

5. Properties, variables and methods should be given meaningful names. Updated book-search component and reading-list component templates to fix the same.

6. To help structure the code and make it more readable and easier to maintain - section tag can be used instead of div for grouping.

7. Added `ngSubmit` to ensures that the form doesn't submit when the handler code throws (which is the default behavior of submit) and causes an actual http post request. HTML `submit` event tries to POST the form to the current URL. `ngSubmit` prevents default submit event by returning false.

8. Removed unwanted properties from `removeFromReadingListSucceeded` and `addToReadingListSucceeded` actions.

## Accessibility issues

- Detected in automated scan:
    1. Buttons do not have an accessible name - **FIXED**
    2. Background and foreground colors do not have a sufficient contrast ratio - **FIXED**
- Manually checked:
    1. images don't have `alt` text - **FIXED**
    2. Screen-reader reads the `search icon` on page as _"button"_. Added `aria-label` to make this more meaningful. - **FIXED**
    3. Elements not redirecting should not be wrapped in `<a>` tag. - **FIXED by replacing with `<button>`**
    4. The book content in search result tile is not readable. Focus directly moves to "Want to Read" button after search icon. Enabled to enhance the keyboard navigation to read book details. **FIXED**

## Improvements

1. Search result can be cached in order to avoid hitting same endpoint multiple times. Since reading the data from cache is extremely fast, this improves overall performance of the application.

2. We can reduce number of clicks by opening the reading list simultaneously with book search. Currently user has to switch back & forth between search results and reading list.

4. Loading spinner should be added while API responds to give better UX.

3. Error message can be displayed to let user know when something goes wrong with network or API.

4. The website is not responsive for mobile and tablet view. Added media queries in `book-search.component.scss` to fix this.