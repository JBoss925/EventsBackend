// Models

import { firestore } from "firebase";

export type Event = {

  uuid: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  organizer: firestore.DocumentReference;
  location: firestore.DocumentReference;
  tags: firestore.DocumentReference[];
  media: firestore.DocumentReference[];

}

export type Org = {

  uuid: string;
  name: string;
  bio: string;
  website: string;
  email: string;
  orgUser: firestore.DocumentReference;

}

export type Location = {
  room: string;
  place_id: string;
  building: string;
}

export type Tag = {
  uuid: string;
  name: string;
}

export type Media = {
  link: string;
  uploader: firestore.DocumentReference;
}

export type OrgUser = {
  uuid: string;
  name: string;
  email: string;
}

export type StudentUser = {
  uuid: string;
  name: string;
  email: string;
}