import { Application, response } from 'express';
import { Response } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  export interface Response {
    silentStatus(code: number): this;

    silentRedirect(location: string): this;
  }

  export interface Application {
    baseUrl?: string;
    parent?: Application;
  }
}

const emptyBuff = Buffer.from('');

response.silentStatus = function (code: number) {
  return this.status(code).send(emptyBuff);
};

response.silentRedirect = function (location: string) {
  let baseUrl = '';
  let app: Application | undefined = this.app;
  while (typeof app !== 'undefined') {
    if (typeof app.baseUrl !== 'undefined') {
      baseUrl = app.baseUrl + baseUrl;
      break;
    } else {
      baseUrl = app.mountpath + baseUrl;
    }

    app = app.parent;
  }
  return this.location(baseUrl + location).silentStatus(301);
};
