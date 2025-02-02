import { join, resolve } from 'path';
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import type SketchFormat from '@sketch-hq/sketch-file-format-ts';
import type { NodeToSymbolOptions, SymbolMaster } from 'html2sketch';

import defaultModal from './json/default-modal.json';
import inlineImage from './json/inline-image.json';
import pngURLImage from './json/png-url-image.json';
import svgButton from './json/svg-button.json';
import svgIcon from './json/svg-icon.json';
import textAlignment from './json/text-alignment.json';

export const defaultModalJSON = defaultModal;
export const inlineImageJSON = inlineImage;
export const pngURLImageJSON = pngURLImage;
export const svgButtonJSON = svgButton;
export const svgIconJSON = svgIcon;
export const textAlignmentJSON = textAlignment;

export type HandleSymbolFn = (symbol: SymbolMaster) => void;

interface Options {
  showWindows?: boolean;
  close?: boolean;
  noSandbox?: boolean;
  port?: number;
  debug?: boolean;
}

/**
 * 初始化解析方法
 * @param options
 */
export const initHtml2Sketch = async (
  {
    close = true,
    showWindows = false,
    port = 8000,
    noSandbox = true,
    debug = false,
  }: Options = {
    showWindows: false,
    close: true,
    noSandbox: true,
    port: 8000,
    debug: false,
  },
) => {
  const isOnline = process.env.ONLINE === '1';
  const httpURL = `http://localhost:${process.env.PORT || port}/e2e`;
  const fileURL = `file://${resolve(__dirname, '../dist')}`;
  const baseURL = isOnline ? fileURL : httpURL;

  const browser = await puppeteer.launch({
    headless: debug ? false : !showWindows,
    args: noSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined,
  });
  const page = await browser.newPage();

  const closeFn = async () => {
    // 如果没有 debug 的话
    if (!debug && close) {
      await browser.close();
    }
  };

  return {
    nodeToSymbol: async (
      url: string,
      selector: (dom: Document) => Element | Element[],
      options?: NodeToSymbolOptions,
    ): Promise<SketchFormat.SymbolMaster> => {
      await page.goto(`${baseURL}${url}${isOnline ? '.html' : ''}`);
      await page.waitForTimeout(1500);

      try {
        await page.evaluate(`window.IS_TEST_ENV=true`);

        const symbolOptionsArr = [];
        if (options) {
          if (options.handleSymbol) {
            symbolOptionsArr.push(`handleSymbol:${options.handleSymbol}`);
          }
          if (options.layerParams) {
            symbolOptionsArr.push(
              `layerParams:${JSON.stringify(options.layerParams)}`,
            );
          }
          if (options.symbolLayout) {
            symbolOptionsArr.push(`symbolLayout:${options.symbolLayout}`);
          }
        }
        const symbolOptions =
          symbolOptionsArr.length === 0
            ? ''
            : `,{${symbolOptionsArr.join(',')}}`;

        const sketchJSON = (await page.evaluate(
          `DUMI_HTML2SKETCH.nodeToSymbol(${selector}(document)${symbolOptions}).then(symbol => symbol.toSketchJSON())`,
        )) as SketchFormat.SymbolMaster;

        await closeFn();

        return sketchJSON;
      } catch (e) {
        await closeFn();
        throw e;
      }
    },
    nodeToGroup: async (
      url: string,
      selector: (dom: Document) => Element | Element[],
    ) => {
      await page.goto(baseURL + url);
      await page.addScriptTag({
        path: resolve(__dirname, './dist/html2sketch.js'),
      });
      await page.waitForTimeout(1500);

      try {
        const json = await page.evaluate(
          `html2sketch.nodeToGroup(${selector}(document))`,
        );
        await closeFn();

        return json;
      } catch (e) {
        await closeFn();
        throw e;
      }
    },
    browser,
    page,
  };
};

/**
 * 打印出 JSON 数据到路径中
 *
 * 如果出现不一致了,可以重新输出 JSON 对象
 * 类似 Enzyme 的快照功能
 *
 * @param json
 * @param name
 */
export const outputJSONData = (
  json:
    | SketchFormat.Group
    | SketchFormat.ShapeGroup
    | SketchFormat.SymbolMaster,
  name: string,
) => {
  writeFileSync(join(__dirname, `./json/${name}.json`), JSON.stringify(json));
};

export const isUpdate = process.env.UPDATE === '1';
