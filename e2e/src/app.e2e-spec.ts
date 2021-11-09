import { browser, logging, element, by } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    // page = new AppPage();
    browser.get('/')
  });

  it('title is Obkljukovalnica', () => {
    // page.navigateTo();
    // expect(element(by.xpath('//h1/span')).getText()).toContain('Obkljukovalnica');
    // expect<any>(await element(by.css('.check_naslov')).getText()).toEqual('blablabal');
    // expect(await page.getTitleText()).toEqual('Obkljukovalnica');

    var foo = element.all(by.css('h1')).getText()

    console.log(foo, "Obkljukovalnica")
    var bar = 'Obkljukovalnica'
    // expect(foo).toEqual(bar)
  });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
