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

  it('Then: I should be able to add an item to the list and then undo', async () => {
    /* search form */
    await $('input[type="search"]').sendKeys('Blockchain');
    await $('form').submit();

    /**
     * adding book to reading list
     * required to cover the edge case scenario when reading list is empty
     */
    await $$('[data-testing="book-add-button"][ng-reflect-disabled="false"]').first().click();

    /* initial count of reading list item */
    const readingListItem = $('tmo-total-count [ng-reflect-content]');
    const initialItemCount = await readingListItem.getAttribute('ng-reflect-content');

    /* adding another book to reading list */
    await $$('[data-testing="book-add-button"][ng-reflect-disabled="false"]').first().click();

    /* undo action */
    await browser.driver.findElement(By.className('mat-simple-snackbar-action')).click();

    /* final count of reading list */
    const finalItemCount = await readingListItem.getAttribute('ng-reflect-content');

    expect(finalItemCount).toEqual(initialItemCount);
  });

  it('Then: I should be able to remove an item from the list and then undo', async () => {
    /* search form */
    await $('input[type="search"]').sendKeys('Big Data');
    await $('form').submit();

    /* add book to reading list */
    await $$('[data-testing="book-add-button"][ng-reflect-disabled="false"]').first().click();

    /* open reading list */
    await $('[data-testing="toggle-reading-list"]').click();

    /* initial count of reading list item */
    const readingListItem = $('tmo-total-count [ng-reflect-content]');
    const initialItemCount = await readingListItem.getAttribute('ng-reflect-content');

    /* remove book from reading list */
    await $$('[data-testing="book-remove-button"]').last().click();

    /* undo action */
    await browser.driver.findElement(By.className('mat-simple-snackbar-action')).click();

    /* final count of reading list item */
    const finalItemCount = await readingListItem.getAttribute('ng-reflect-content');

    expect(finalItemCount).toEqual(initialItemCount);
  });
});
