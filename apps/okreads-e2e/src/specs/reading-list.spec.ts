import { $, $$, browser, By, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
  });

  it('Then: I should see my reading list', async () => {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should be able to mark a book as finished', async () => {
    /* search book */
    await $('input[type="search"]').sendKeys('Algorithm');
    await $('form').submit();

    /* add book to reading list */
    await $$('[data-testing="book-add-button"][ng-reflect-disabled="false"]')
      .first()
      .click();

    /* open reading list */
    await $('[data-testing="toggle-reading-list"]').click();

    /* mark book as finished */
    let recentlyFinishedBook = $$('.reading-list-item').last();
    await recentlyFinishedBook.element(By.className('mark-finish-circle')).click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        recentlyFinishedBook.all(By.className('finished-text')).first(),
        'Finished on:'
      )
    );

    /* remove book from reading list */
    await $$('[data-testing="book-remove-button"]').last().click();

    /* close reading list */
    await $('[data-testing="close-reading-list"]').click();

    /* adding same book again*/
    await $$('[data-testing="book-add-button"][ng-reflect-disabled="false"]')
      .first()
      .click();

    /* open reading list */
    await $('[data-testing="toggle-reading-list"]').click();

    recentlyFinishedBook = $$('.reading-list-item').last();

    /* finish button should be present again for the same book */
    expect(
      await recentlyFinishedBook.all(By.className('mark-finish-circle')).count()
    ).toEqual(1);
  });
});
