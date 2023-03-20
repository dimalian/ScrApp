export enum ActionType {
  FOCUS = 'focus',
  CLICK = 'click',
  TYPE = 'type',
  COPY = 'copy',
}

export enum ScreenshotType {
  FULLSCREEN = 'fullscreen',
  ELEMENT = 'element',
  VIEWPORT = 'viewport',
}

export type Action = {
  url: string;
  element: {
    selector: string;
    action: ActionType;
    text: string;
  };
  screenshot: {
    type: ScreenshotType;
    selector: string;
  };
  wait: number;
};
