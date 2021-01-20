import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  it('Then: I should see search results as I am typing', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const input = $('input[type="search"]');

    await input.sendKeys('javascript');

    const bookItems = await $$('[data-testing="book-item"]');
    expect(bookItems.length).toBeGreaterThan(1);
  });
});
