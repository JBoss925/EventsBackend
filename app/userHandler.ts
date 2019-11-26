// This file contains the firebase implementations of the endpoints.


import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, OrgUser, StudentUser, JSONResponse } from "./types"
import { EventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "./requestTypes";
import * as commonOps from "./util/commonOps";
import { v4 as uuid } from 'uuid';

export async function createUser(db: firestore.Firestore, body: any): Promise<JSONResponse> {
  let request = body as CreateUserRequest;
  let retVal: JSONResponse = { status: 400, output: "No response given! createUser" };
  if (request.isOrgUser) {
    let orgUser: OrgUser = {
      name: request.name,
      uuid: uuid(),
      email: request.email.toLowerCase()
    }
    let orgUserRef: firestore.DocumentReference = db.collection('orgUsers').doc(`${orgUser.email}`)
    await orgUserRef.get().then(
      async doc => {
        let orgUserDoc = doc;
        if (orgUserDoc.exists) {
          retVal = { status: 400, output: { error: "OrgUser already exists!" } } as JSONResponse;
        } else {
          await orgUserRef.set(orgUser);
          retVal = { status: 200, output: orgUser } as JSONResponse;
        }
      }
    );
  } else {
    let studentUser: StudentUser = {
      name: request.name,
      uuid: uuid(),
      email: request.email.toLowerCase()
    }
    let studentUserRef: firestore.DocumentReference = db.collection('studentUsers').doc(`${studentUser.email}`)
    await studentUserRef.get().then(
      async doc => {
        let studentUserDoc = doc;
        if (studentUserDoc.exists) {
          retVal = { status: 400, output: { error: "StudentUser already exists!" } } as JSONResponse;
        } else {
          await studentUserRef.set(studentUser);
          retVal = { status: 200, output: studentUser } as JSONResponse;
        }
      }
    );
  }
  return retVal;
}

export async function getUser(db: firestore.Firestore, body: any) {
  let request = body as GetUserRequest;
  let retVal: JSONResponse = { status: 400, output: "No response given! getUser" };
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    await orgUserDocRef.get().then(doc => {
      if (doc.exists) {
        retVal = { status: 200, output: doc.data() } as JSONResponse;
      } else {
        retVal = { status: 404, output: { error: "OrgUser with email: " + `${request.email.toLowerCase()}` + " not found!" } } as JSONResponse;
      }
    });
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    await studentUserDocRef.get().then(doc => {
      if (doc.exists) {
        retVal = { status: 200, output: doc.data() } as JSONResponse;
      } else {
        retVal = { status: 404, output: { error: "StudentUser with email: " + `${request.email.toLowerCase()}` + " not found!" } } as JSONResponse;
      }
    });
  }
  return retVal;
}

export async function deleteUser(db: firestore.Firestore, body: any) {
  let request = body as DeleteUserRequest;
  let retVal: JSONResponse;
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    await orgUserDocRef.delete();
    retVal = { status: 200, output: { deleted: true } } as JSONResponse;
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    await studentUserDocRef.delete();
    retVal = { status: 200, output: { deleted: true } } as JSONResponse;
  }
  return retVal;
}