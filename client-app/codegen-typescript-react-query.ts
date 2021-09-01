export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Calendar = {
  __typename?: 'Calendar';
  /** Mongoose ObjectId */
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  /** Mongoose Ref ObjectId */
  calendarId?: Maybe<Scalars['String']>;
  /** Creation's date */
  dateCreate?: Maybe<Scalars['String']>;
  /** Ending date of the event */
  dateEnd: Scalars['String'];
  /** Beginning date of the event */
  dateStart?: Maybe<Scalars['String']>;
  /** Last modification date */
  dateUpdate?: Maybe<Scalars['String']>;
  /** Description the event */
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** The name of the event */
  name?: Maybe<Scalars['String']>;
};

export type CalendarEventInput = {
  /** Mongoose Ref ObjectId */
  calendarId?: Maybe<Scalars['String']>;
  /** Creation's date */
  dateCreate?: Maybe<Scalars['String']>;
  /** Ending date of the event */
  dateEnd: Scalars['String'];
  /** Beginning date of the event */
  dateStart?: Maybe<Scalars['String']>;
  /** Last modification date */
  dateUpdate?: Maybe<Scalars['String']>;
  /** Description the event */
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** The name of the event */
  name?: Maybe<Scalars['String']>;
};

export type CalendarInput = {
  /** Mongoose ObjectId */
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCalendar: Calendar;
  addCalendarEvent: CalendarEvent;
};


export type MutationAddCalendarArgs = {
  calendarInput: CalendarInput;
};


export type MutationAddCalendarEventArgs = {
  calendarEventInput?: Maybe<CalendarEventInput>;
  calendarId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  calendar?: Maybe<Calendar>;
  /** Get all calendars */
  calendars?: Maybe<Array<Calendar>>;
  calendarEvent?: Maybe<CalendarEvent>;
  /** Get all calendar events */
  calendarEvents?: Maybe<Array<CalendarEvent>>;
};


export type QueryCalendarArgs = {
  id: Scalars['String'];
};


export type QueryCalendarEventArgs = {
  id: Scalars['String'];
};


export type QueryCalendarEventsArgs = {
  calendarId: Scalars['String'];
};
