// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as userHandler from "./userHandler";
import { JSONResponse } from "./types";

// Express ---------------------------------------------------------------------
const express = require('express');
const app: Express = express()
const port = 3000;
// -----------------------------------------------------------------------------

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
let serviceAccount = require('../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventsbackenddatabase.firebaseio.com"
});

export let db = admin.firestore();
// -----------------------------------------------------------------------------

// Worker Logic ----------------------------------------------------------------
const { Worker } = require('worker_threads');
const max_threads = 10;

if (typeof require !== 'undefined' && require.main === module) {
  main();
}

export function delegateThread(requireStr: string, func: Function, req: Request, res: Response) {
  let worker = new Worker(require.resolve('./requestWorker.js'), {
    workerData: {
      requireStr: requireStr,
      funcName: func.name,
      body: req.body
    }
  });
  worker.on('message', (data: JSONResponse) => handleMessage(data, req, res));
  worker.on('error', (e: any) => console.log(e));

}

function handleMessage(data: JSONResponse, req: Request, res: Response) {
  res.status(data.status).send(data.output);
}

// -----------------------------------------------------------------------------

function main() {
  app.use(express.json())
  app.post('/createUser/', (req: Request, res: Response) => delegateThread('./userHandler', userHandler.createUser, req, res))
  app.get('/getUser/', (req: Request, res: Response) => delegateThread('./userHandler', userHandler.getUser, req, res))
  app.delete('/deleteUser/', (req: Request, res: Response) => delegateThread('./userHandler', userHandler.deleteUser, req, res))

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
