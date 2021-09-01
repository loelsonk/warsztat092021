import * as TypeGraphQL from 'type-graphql';
export { TypeGraphQL };
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type FixDecorator<T> = T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

@TypeGraphQL.ObjectType()
export class Calendar {
  __typename?: 'Calendar';

  @TypeGraphQL.Field(type => String, { description: 'Mongoose ObjectId', nullable: true })
  id!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String)
  name!: Scalars['String'];

  @TypeGraphQL.Field(type => String, { nullable: true })
  owner!: Maybe<Scalars['String']>;
};

@TypeGraphQL.ObjectType()
export class CalendarEvent {
  __typename?: 'CalendarEvent';

  @TypeGraphQL.Field(type => String, { description: 'Mongoose Ref ObjectId', nullable: true })
  calendarId!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Creation\'s date', nullable: true })
  dateCreate!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Ending date of the event' })
  dateEnd!: Scalars['String'];

  @TypeGraphQL.Field(type => String, { description: 'Beginning date of the event', nullable: true })
  dateStart!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Last modification date', nullable: true })
  dateUpdate!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Description the event', nullable: true })
  description!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  id!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'The name of the event', nullable: true })
  name!: Maybe<Scalars['String']>;
};

@TypeGraphQL.InputType()
export class CalendarEventInput {

  @TypeGraphQL.Field(type => String, { description: 'Mongoose Ref ObjectId', nullable: true })
  calendarId!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Creation\'s date', nullable: true })
  dateCreate!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Ending date of the event' })
  dateEnd!: Scalars['String'];

  @TypeGraphQL.Field(type => String, { description: 'Beginning date of the event', nullable: true })
  dateStart!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Last modification date', nullable: true })
  dateUpdate!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'Description the event', nullable: true })
  description!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  id!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { description: 'The name of the event', nullable: true })
  name!: Maybe<Scalars['String']>;
};

@TypeGraphQL.InputType()
export class CalendarInput {

  @TypeGraphQL.Field(type => String, { description: 'Mongoose ObjectId', nullable: true })
  id!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String)
  name!: Scalars['String'];

  @TypeGraphQL.Field(type => String, { nullable: true })
  owner!: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCalendar: Calendar;
  addCalendarEvent: CalendarEvent;
};


@TypeGraphQL.ArgsType()
export class MutationAddCalendarArgs {

  @TypeGraphQL.Field(type => CalendarInput)
  calendarInput!: FixDecorator<CalendarInput>;
};


@TypeGraphQL.ArgsType()
export class MutationAddCalendarEventArgs {

  @TypeGraphQL.Field(type => CalendarEventInput, { nullable: true })
  calendarEventInput!: Maybe<CalendarEventInput>;

  @TypeGraphQL.Field(type => String, { description: '[object Object]' })
  calendarId!: Scalars['String'];
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


@TypeGraphQL.ArgsType()
export class QueryCalendarArgs {

  @TypeGraphQL.Field(type => String, { description: '[object Object]' })
  id!: Scalars['String'];
};


@TypeGraphQL.ArgsType()
export class QueryCalendarEventArgs {

  @TypeGraphQL.Field(type => String, { description: '[object Object]' })
  id!: Scalars['String'];
};


@TypeGraphQL.ArgsType()
export class QueryCalendarEventsArgs {

  @TypeGraphQL.Field(type => String, { description: '[object Object]' })
  calendarId!: Scalars['String'];
};
