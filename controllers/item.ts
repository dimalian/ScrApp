import Express from 'express';
import * as itemModel from '../models/item';
import Joi from 'joi';
import puppeteer, { Page } from 'puppeteer';
import { Action, ActionType, ScreenshotType } from '../types/Action.type';
import { Repeat } from '../types/Repeat.type';
import { environment } from '../config';

type Item = typeof itemModel;

const delay = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

let texts: String[] = [];

const mageScreenshot = async (page: Page, action: Action) => {
  let screenshot = null;
  switch (action.screenshot.type) {
    case ScreenshotType.VIEWPORT: {
      screenshot = await page?.screenshot();
      break;
    }
    case ScreenshotType.FULLSCREEN: {
      screenshot = await page?.screenshot({ fullPage: true });
      break;
    }
    case ScreenshotType.ELEMENT: {
      const el = await page.$(action.screenshot.selector);
      screenshot = await el?.screenshot();
      break;
    }
    default: {
      break;
    }
  }
};

const processElement = async (page: Page, action: Action) => {
  const element = await page.$(action.element.selector);
  switch (action.element.action) {
    case ActionType.CLICK: {
      await element?.click();
      break;
    }
    case ActionType.FOCUS: {
      await element?.focus();
      break;
    }
    case ActionType.TYPE: {
      await element?.type(action.element.text);
      break;
    }
    case ActionType.COPY: {
      const innerTexts = await page.$$eval(action.element.selector, (nodes) =>
        nodes.map((n) => (n as HTMLElement).innerText),
      );
      // const text = await (await element?.getProperty('textContent'))?.jsonValue();
      if (innerTexts.length) {
        texts = [...texts, ...innerTexts];
      }
      console.log('texts were copied: ', texts.length);
      break;
    }
    default: {
      break;
    }
  }
};

const runProcess = async (page: Page, times: number, actions: Array<Action & Repeat>) => {
  if (times <= 0) {
    return;
  }
  console.log(actions);
  for (let i = 0; i < actions.length; i++) {
    if (actions[i].element) {
      await processElement(page, actions[i]);
    }
    if (actions[i].wait) {
      await delay(actions[i].wait);
    }
    if (actions[i].url) {
      await page.goto(actions[i].url);
    }
    if (actions[i].repeat) {
      await runProcess(page, actions[i].repeat.times, actions[i].repeat.actions as Array<Action & Repeat>);
    }
    if (actions[i].screenshot) {
      await mageScreenshot(page, actions[i]);
    }
  }

  await runProcess(page, times - 1, actions);
};

export const create = (model: Item) => async (req: Express.Request, res: Express.Response) => {
  const browser = await puppeteer.launch(environment === 'development' ? { headless: false, slowMo: 250 } : undefined);

  const page = await browser.newPage();
  await page.goto(req.body.url); // URL is given by the "user" (your client-side application)
  await runProcess(page, 1, req.body.actions);

  // Respond with the image
  await res.writeHead(200, {
    // 'Content-Type': 'image/png',
    'Content-Type': 'application/json',
    // 'Content-Length': screenshotBuffer3.length,
  });
  console.log('texts were copied: ', texts.length);
  await browser.close();
  // return res.end(screenshotBuffer3);
  return res.end(JSON.stringify(texts));
};
