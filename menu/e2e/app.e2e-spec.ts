import { MenuPage } from './app.po';

describe('menu App', function() {
  let page: MenuPage;

  beforeEach(() => {
    page = new MenuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
