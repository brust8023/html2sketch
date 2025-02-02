import SketchFormat from '@sketch-hq/sketch-file-format-ts';
import { Bitmap } from 'html2sketch';

describe('Bitmap 类', () => {
  describe('创建', () => {
    it('不传入 url 直接报错', () => {
      expect(
        () =>
          new Bitmap({
            url: '',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          }),
      ).toThrow('没有传入 URL 请检查参数');
    });

    it('传入 base64 URL 后 可正常生成 Sketch JSON', () => {
      const base64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==';
      const bitmap = new Bitmap({
        url: `data:image/png;base64,${base64}`,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });

      expect(
        (bitmap.toSketchJSON().image as SketchFormat.DataRef).data._data,
      ).toEqual(base64);

      expect(bitmap.toSketchJSON()).toMatchSnapshot();
      expect(bitmap.toSketchJSON()).toStrictEqual({
        _class: 'bitmap',
        booleanOperation: -1,
        clippingMaskMode: 0,
        do_objectID: 'UUID',
        clippingMask: '',
        exportOptions: {
          _class: 'exportOptions',
          exportFormats: [],
          includedLayerIds: [],
          layerOptions: 0,
          shouldTrim: false,
        },
        fillReplacesImage: false,
        frame: {
          _class: 'rect',
          constrainProportions: false,
          height: 100,
          width: 100,
          x: 0,
          y: 0,
        },
        hasClippingMask: false,
        image: {
          _class: 'MSJSONOriginalDataReference',
          _ref: 'images/UUID',
          _ref_class: 'MSImageData',
          data: {
            _data:
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==',
          },
          sha1: {
            _data: '',
          },
        },
        intendedDPI: 32,
        isFixedToViewport: false,
        isFlippedHorizontal: false,
        isFlippedVertical: false,
        isLocked: false,
        isVisible: true,
        layerListExpandedType: 0,
        name: 'bitmap',
        nameIsFixed: false,
        resizingConstraint: 27,
        resizingType: 0,
        rotation: 0,
        shouldBreakMaskChain: false,
        style: {
          _class: 'style',
          borderOptions: {
            _class: 'borderOptions',
            dashPattern: [],
            isEnabled: true,
            lineCapStyle: 0,
            lineJoinStyle: 0,
          },
          borders: [],
          colorControls: {
            _class: 'colorControls',
            brightness: 0,
            contrast: 1,
            hue: 0,
            isEnabled: false,
            saturation: 1,
          },
          contextSettings: {
            _class: 'graphicsContextSettings',
            blendMode: 0,
            opacity: 1,
          },
          do_objectID: 'UUID',
          endMarkerType: 0,
          fills: [],
          innerShadows: [],
          miterLimit: 10,
          shadows: [],
          startMarkerType: 0,
          windingRule: 1,
        },
      });
    });
    it('传入 错误 URL 后 无法初始化', () => {
      expect(
        () =>
          new Bitmap({
            url: `sjo.png`,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          }),
      ).toThrow('不正确的图像网址:sjo.png');
    });
  });

  describe('初始化', () => {
    it('传入 URL 后未初始化,显示错误图片 ', () => {
      const bitmap = new Bitmap({
        url: `http://sjo.png`,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
      expect(bitmap.base64).toBe(
        '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',
      );
    });
    it('传入 URL 后初始化,由于 URL 不正确, 显示错误图片 ', async () => {
      const bitmap = new Bitmap({
        url: `https://sjo.png`,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
      await bitmap.init();
      expect(bitmap.base64).toBe(
        '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',
      );
    }, 15000);
    it('传入 URL 后初始化,URL 正确, 显示正确图片 ', async () => {
      const bitmap = new Bitmap({
        url: `https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg`,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
      await bitmap.init();
      expect(bitmap.base64).toBe(
        'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDcuMSAoNDU0MjIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkdyb3VwIDI4IENvcHkgNTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNjIuMTAyMzI3MyUiIHkxPSIwJSIgeDI9IjEwOC4xOTcxOCUiIHkyPSIzNy44NjM1NzY0JSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNDI4NUVCIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyRUM3RkYiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI2OS42NDQxMTYlIiB5MT0iMCUiIHgyPSI1NC4wNDI4OTc1JSIgeTI9IjEwOC40NTY3MTQlIiBpZD0ibGluZWFyR3JhZGllbnQtMiI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyOUNERkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzE0OEVGRiIgb2Zmc2V0PSIzNy44NjAwNjg3JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMEE2MEZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNjkuNjkwODE2NSUiIHkxPSItMTIuOTc0MzU4NyUiIHgyPSIxNi43MjI4OTgxJSIgeTI9IjExNy4zOTEyNDglIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGQTgxNkUiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y3NEE1QyIgb2Zmc2V0PSI0MS40NzI2MDYlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNTFEMkMiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI2OC4xMjc5ODcyJSIgeTE9Ii0zNS42OTA1NzM3JSIgeDI9IjMwLjQ0MDA5MTQlIiB5Mj0iMTE0Ljk0MjY3OSUiIGlkPSJsaW5lYXJHcmFkaWVudC00Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZBOEU3RCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjc0QTVDIiBvZmZzZXQ9IjUxLjI2MzUxOTElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNTFEMkMiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ibG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjAwMDAwMCwgLTIwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMjgtQ29weS01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDIwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTI3LUNvcHktMyI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTI1IiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iMiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTEuNTg4MDg2Myw0LjE3NjUyODIzIEw0LjE3OTk2NTQ0LDkxLjUxMjc3MjggQy0wLjUxOTI0MDYwNSw5Ni4yMDgxMTQ2IC0wLjUxOTI0MDYwNSwxMDMuNzkxODg1IDQuMTc5OTY1NDQsMTA4LjQ4NzIyNyBMOTEuNTg4MDg2MywxOTUuODIzNDcyIEM5Ni4yODcyOTIzLDIwMC41MTg4MTQgMTAzLjg3NzMwNCwyMDAuNTE4ODE0IDEwOC41NzY1MSwxOTUuODIzNDcyIEwxNDUuMjI1NDg3LDE1OS4yMDQ2MzIgQzE0OS40MzM5NjksMTU0Ljk5OTYxMSAxNDkuNDMzOTY5LDE0OC4xODE5MjQgMTQ1LjIyNTQ4NywxNDMuOTc2OTAzIEMxNDEuMDE3MDA1LDEzOS43NzE4ODEgMTM0LjE5MzcwNywxMzkuNzcxODgxIDEyOS45ODUyMjUsMTQzLjk3NjkwMyBMMTAyLjIwMTkzLDE3MS43MzczNTIgQzEwMS4wMzIzMDUsMTcyLjkwNjAxNSA5OS4yNTcxNjA5LDE3Mi45MDYwMTUgOTguMDg3NTM1OSwxNzEuNzM3MzUyIEwyOC4yODU5MDgsMTAxLjk5MzEyMiBDMjcuMTE2MjgzMSwxMDAuODI0NDU5IDI3LjExNjI4MzEsOTkuMDUwNzc1IDI4LjI4NTkwOCw5Ny44ODIxMTE4IEw5OC4wODc1MzU5LDI4LjEzNzg4MjMgQzk5LjI1NzE2MDksMjYuOTY5MjE5MSAxMDEuMDMyMzA1LDI2Ljk2OTIxOTEgMTAyLjIwMTkzLDI4LjEzNzg4MjMgTDEyOS45ODUyMjUsNTUuODk4MzMxNCBDMTM0LjE5MzcwNyw2MC4xMDMzNTI4IDE0MS4wMTcwMDUsNjAuMTAzMzUyOCAxNDUuMjI1NDg3LDU1Ljg5ODMzMTQgQzE0OS40MzM5NjksNTEuNjkzMzEgMTQ5LjQzMzk2OSw0NC44NzU2MjMyIDE0NS4yMjU0ODcsNDAuNjcwNjAxOCBMMTA4LjU4MDU1LDQuMDU1NzQ1OTIgQzEwMy44NjIwNDksLTAuNTM3OTg2ODQ2IDk2LjI2OTI2MTgsLTAuNTAwNzk3OTA2IDkxLjU4ODA4NjMsNC4xNzY1MjgyMyBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05MS41ODgwODYzLDQuMTc2NTI4MjMgTDQuMTc5OTY1NDQsOTEuNTEyNzcyOCBDLTAuNTE5MjQwNjA1LDk2LjIwODExNDYgLTAuNTE5MjQwNjA1LDEwMy43OTE4ODUgNC4xNzk5NjU0NCwxMDguNDg3MjI3IEw5MS41ODgwODYzLDE5NS44MjM0NzIgQzk2LjI4NzI5MjMsMjAwLjUxODgxNCAxMDMuODc3MzA0LDIwMC41MTg4MTQgMTA4LjU3NjUxLDE5NS44MjM0NzIgTDE0NS4yMjU0ODcsMTU5LjIwNDYzMiBDMTQ5LjQzMzk2OSwxNTQuOTk5NjExIDE0OS40MzM5NjksMTQ4LjE4MTkyNCAxNDUuMjI1NDg3LDE0My45NzY5MDMgQzE0MS4wMTcwMDUsMTM5Ljc3MTg4MSAxMzQuMTkzNzA3LDEzOS43NzE4ODEgMTI5Ljk4NTIyNSwxNDMuOTc2OTAzIEwxMDIuMjAxOTMsMTcxLjczNzM1MiBDMTAxLjAzMjMwNSwxNzIuOTA2MDE1IDk5LjI1NzE2MDksMTcyLjkwNjAxNSA5OC4wODc1MzU5LDE3MS43MzczNTIgTDI4LjI4NTkwOCwxMDEuOTkzMTIyIEMyNy4xMTYyODMxLDEwMC44MjQ0NTkgMjcuMTE2MjgzMSw5OS4wNTA3NzUgMjguMjg1OTA4LDk3Ljg4MjExMTggTDk4LjA4NzUzNTksMjguMTM3ODgyMyBDMTAwLjk5OTg2NCwyNS42MjcxODM2IDEwNS43NTE2NDIsMjAuNTQxODI0IDExMi43Mjk2NTIsMTkuMzUyNDQ4NyBDMTE3LjkxNTU4NSwxOC40Njg1MjYxIDEyMy41ODUyMTksMjAuNDE0MDIzOSAxMjkuNzM4NTU0LDI1LjE4ODk0MjQgQzEyNS42MjQ2NjMsMjEuMDc4NDI5MiAxMTguNTcxOTk1LDE0LjAzNDAzMDQgMTA4LjU4MDU1LDQuMDU1NzQ1OTIgQzEwMy44NjIwNDksLTAuNTM3OTg2ODQ2IDk2LjI2OTI2MTgsLTAuNTAwNzk3OTA2IDkxLjU4ODA4NjMsNC4xNzY1MjgyMyBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMikiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUzLjY4NTYzMywxMzUuODU0NTc5IEMxNTcuODk0MTE1LDE0MC4wNTk2IDE2NC43MTc0MTIsMTQwLjA1OTYgMTY4LjkyNTg5NCwxMzUuODU0NTc5IEwxOTUuOTU5OTc3LDEwOC44NDI3MjYgQzIwMC42NTkxODMsMTA0LjE0NzM4NCAyMDAuNjU5MTgzLDk2LjU2MzYxMzMgMTk1Ljk2MDUyNyw5MS44Njg4MTk0IEwxNjguNjkwNzc3LDY0LjcxODExNTkgQzE2NC40NzIzMzIsNjAuNTE4MDg1OCAxNTcuNjQ2ODY4LDYwLjUyNDE0MjUgMTUzLjQzNTg5NSw2NC43MzE2NTI2IEMxNDkuMjI3NDEzLDY4LjkzNjY3NCAxNDkuMjI3NDEzLDc1Ljc1NDM2MDcgMTUzLjQzNTg5NSw3OS45NTkzODIxIEwxNzEuODU0MDM1LDk4LjM2MjM3NjUgQzE3My4wMjM2Niw5OS41MzEwMzk2IDE3My4wMjM2NiwxMDEuMzA0NzI0IDE3MS44NTQwMzUsMTAyLjQ3MzM4NyBMMTUzLjY4NTYzMywxMjAuNjI2ODQ5IEMxNDkuNDc3MTUsMTI0LjgzMTg3IDE0OS40NzcxNSwxMzEuNjQ5NTU3IDE1My42ODU2MzMsMTM1Ljg1NDU3OSBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTQpIiBjeD0iMTAwLjUxOTMzOSIgY3k9IjEwMC40MzY2ODEiIHJ4PSIyMy42MDAxOTI2IiByeT0iMjMuNTgwNzg2Ij48L2VsbGlwc2U+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==',
      );
    });
  });
});
