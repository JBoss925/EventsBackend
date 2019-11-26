import * as userHandler from '../../userHandler';
import { firestore } from 'firebase';
import { expect } from '../testExtensions';
import * as runTests from '../runTests';
import * as app from '../../app';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');


// Begin Tests -----------------------------------------------------------------

export async function runDeleteTest(db: firestore.Firestore) {

  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/deleteUser/',
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await app.delegateThread('./userHandler', userHandler.deleteUser, mockRequest, mockRespsonse);
  let docExists;
  await db.collection('orgUsers').doc(mockRequest.body.email).get().then(doc => {
    docExists = doc.exists;
  });
  expect(mockRespsonse._getJSON().deleted).toBe.equalTo(true);
  expect(docExists).toBe.equalTo(false);
}

export async function runCreateTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/createUser/',
      body: {
        name: "Jagger",
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await app.delegateThread('./userHandler', userHandler.createUser, mockRequest, mockRespsonse);
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      orgUserResp = doc.data();
    });
  expect(orgUserResp.name).toBe.equalTo("Jagger");
  expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}

export async function runGetTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'GET',
      url: '/getUser/',
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await app.delegateThread('./userHandler', userHandler.getUser, mockRequest, mockRespsonse);
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      expect(doc.exists).toBe.equalTo(true);
      orgUserResp = doc.data();
    });
  expect(orgUserResp.name).is.defined();
  expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}