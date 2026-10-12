import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget popular articles', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // закрываем cookie баннер только если сайт его показал
    const cookieButton = page.getByText('ОК', { exact: true }).first();
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
      await expect(page.locator('._UCHI_COOKIE__wrap')).toHaveCount(0);
    }
  });

  test('shows popular articles', async () => {
    await widgetPage.openWidget();

    // проверяем загрузку списка и появление панели.
    await expect(widgetPage.getPopularArticles().first()).toBeVisible();
  });
});
