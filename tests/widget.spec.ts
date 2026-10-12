import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    // ждем DOM  чтобы сохранить время общего таймаута.
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // закрываем cookie баннер только если сайт его показал
    const cookieButton = page.getByText('ОК', { exact: true }).first();
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
      await expect(page.locator('._UCHI_COOKIE__wrap')).toHaveCount(0);
    }
  });

  test('opens', async ({page}) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    const articles = widgetPage.getPopularArticles();

    // ждем загрузки статьи до клик
    await expect(articles.first()).toBeVisible();
    await articles.first().click();

    await widgetPage.clickWriteToUs();

    expect(await widgetPage.getTitle()).toEqual('Связь с поддержкой');
  });
});
