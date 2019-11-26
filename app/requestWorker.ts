const { workerData } = require('worker_threads');
import * as app from './app';
import { parentPort } from 'worker_threads';
import { JSONResponse } from './types';
import * as userHandler from './userHandler';

const { funcName, body, requireStr } = workerData;

(async () => {
  let x = require(requireStr);
  x[funcName](app.db, body).then((val: JSONResponse) => {
    if (parentPort != null) {
      parentPort.postMessage(val);
    } else {
      console.log("parentPort is null!");
    }
  })
})();