import {App} from './application';
import {ApplicationConfig} from '@loopback/core';

export {App};

export async function main(options: ApplicationConfig = {rest: {port: 3001}}) {
  const app = new App(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(
    `View the homescreen to look at the documentation or OpenAPI spec at ${url}/`,
  );

  return app;
}
