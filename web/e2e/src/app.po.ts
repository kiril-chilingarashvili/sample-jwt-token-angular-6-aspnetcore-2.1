import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  async getParagraphText() {
    let e = element(by.css('refactorx-app h3'));
    let text = await e.getText();
    return text;
  }
}
