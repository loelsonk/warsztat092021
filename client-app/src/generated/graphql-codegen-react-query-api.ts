import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://g9n41.sse.codesandbox.io/graphql", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ query, variables }),
    });
    
    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
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

export type CalendarsQueryVariables = Exact<{ [key: string]: never; }>;


export type CalendarsQuery = { __typename?: 'Query', calendars?: Maybe<Array<{ __typename?: 'Calendar', id?: Maybe<string>, name: string, owner?: Maybe<string> }>> };

export type CalendarQueryVariables = Exact<{
  calendarId: Scalars['String'];
}>;


export type CalendarQuery = { __typename?: 'Query', calendar?: Maybe<{ __typename?: 'Calendar', id?: Maybe<string>, name: string, owner?: Maybe<string> }> };

export type CalendarEventQueryVariables = Exact<{
  calendarEventId: Scalars['String'];
}>;


export type CalendarEventQuery = { __typename?: 'Query', calendarEvent?: Maybe<{ __typename?: 'CalendarEvent', id?: Maybe<string>, calendarId?: Maybe<string>, dateCreate?: Maybe<string>, dateEnd: string, dateStart?: Maybe<string>, name?: Maybe<string>, description?: Maybe<string> }> };

export type CalendarEventsQueryVariables = Exact<{
  calendarId: Scalars['String'];
}>;


export type CalendarEventsQuery = { __typename?: 'Query', calendarEvents?: Maybe<Array<{ __typename?: 'CalendarEvent', id?: Maybe<string>, calendarId?: Maybe<string>, dateCreate?: Maybe<string>, dateEnd: string, dateStart?: Maybe<string>, name?: Maybe<string>, description?: Maybe<string> }>> };

export type AddCalendarMutationVariables = Exact<{
  calendarInput: CalendarInput;
}>;


export type AddCalendarMutation = { __typename?: 'Mutation', addCalendar: { __typename?: 'Calendar', id?: Maybe<string>, name: string, owner?: Maybe<string> } };

export type AddCalendarEventMutationVariables = Exact<{
  calendarId: Scalars['String'];
  calendarEventInput: CalendarEventInput;
}>;


export type AddCalendarEventMutation = { __typename?: 'Mutation', addCalendarEvent: { __typename?: 'CalendarEvent', id?: Maybe<string>, calendarId?: Maybe<string>, dateCreate?: Maybe<string>, dateEnd: string, dateStart?: Maybe<string>, name?: Maybe<string>, description?: Maybe<string> } };

export type CalendarFieldsFragment = { __typename?: 'Calendar', id?: Maybe<string>, name: string, owner?: Maybe<string> };

export type CalendarEventFieldsFragment = { __typename?: 'CalendarEvent', id?: Maybe<string>, calendarId?: Maybe<string>, dateCreate?: Maybe<string>, dateEnd: string, dateStart?: Maybe<string>, name?: Maybe<string>, description?: Maybe<string> };

export const CalendarFieldsFragmentDoc = `
    fragment CalendarFields on Calendar {
  id
  name
  owner
}
    `;
export const CalendarEventFieldsFragmentDoc = `
    fragment CalendarEventFields on CalendarEvent {
  id
  calendarId
  dateCreate
  dateEnd
  dateStart
  name
  description
}
    `;
export const CalendarsDocument = `
    query calendars {
  calendars {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;
export const useCalendarsQuery = <
      TData = CalendarsQuery,
      TError = unknown
    >(
      variables?: CalendarsQueryVariables, 
      options?: UseQueryOptions<CalendarsQuery, TError, TData>
    ) => 
    useQuery<CalendarsQuery, TError, TData>(
      ['calendars', variables],
      fetcher<CalendarsQuery, CalendarsQueryVariables>(CalendarsDocument, variables),
      options
    );
export const CalendarDocument = `
    query calendar($calendarId: String!) {
  calendar(id: $calendarId) {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;
export const useCalendarQuery = <
      TData = CalendarQuery,
      TError = unknown
    >(
      variables: CalendarQueryVariables, 
      options?: UseQueryOptions<CalendarQuery, TError, TData>
    ) => 
    useQuery<CalendarQuery, TError, TData>(
      ['calendar', variables],
      fetcher<CalendarQuery, CalendarQueryVariables>(CalendarDocument, variables),
      options
    );
export const CalendarEventDocument = `
    query calendarEvent($calendarEventId: String!) {
  calendarEvent(id: $calendarEventId) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;
export const useCalendarEventQuery = <
      TData = CalendarEventQuery,
      TError = unknown
    >(
      variables: CalendarEventQueryVariables, 
      options?: UseQueryOptions<CalendarEventQuery, TError, TData>
    ) => 
    useQuery<CalendarEventQuery, TError, TData>(
      ['calendarEvent', variables],
      fetcher<CalendarEventQuery, CalendarEventQueryVariables>(CalendarEventDocument, variables),
      options
    );
export const CalendarEventsDocument = `
    query calendarEvents($calendarId: String!) {
  calendarEvents(calendarId: $calendarId) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;
export const useCalendarEventsQuery = <
      TData = CalendarEventsQuery,
      TError = unknown
    >(
      variables: CalendarEventsQueryVariables, 
      options?: UseQueryOptions<CalendarEventsQuery, TError, TData>
    ) => 
    useQuery<CalendarEventsQuery, TError, TData>(
      ['calendarEvents', variables],
      fetcher<CalendarEventsQuery, CalendarEventsQueryVariables>(CalendarEventsDocument, variables),
      options
    );
export const AddCalendarDocument = `
    mutation addCalendar($calendarInput: CalendarInput!) {
  addCalendar(calendarInput: $calendarInput) {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;
export const useAddCalendarMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddCalendarMutation, TError, AddCalendarMutationVariables, TContext>) => 
    useMutation<AddCalendarMutation, TError, AddCalendarMutationVariables, TContext>(
      (variables?: AddCalendarMutationVariables) => fetcher<AddCalendarMutation, AddCalendarMutationVariables>(AddCalendarDocument, variables)(),
      options
    );
export const AddCalendarEventDocument = `
    mutation addCalendarEvent($calendarId: String!, $calendarEventInput: CalendarEventInput!) {
  addCalendarEvent(
    calendarId: $calendarId
    calendarEventInput: $calendarEventInput
  ) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;
export const useAddCalendarEventMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddCalendarEventMutation, TError, AddCalendarEventMutationVariables, TContext>) => 
    useMutation<AddCalendarEventMutation, TError, AddCalendarEventMutationVariables, TContext>(
      (variables?: AddCalendarEventMutationVariables) => fetcher<AddCalendarEventMutation, AddCalendarEventMutationVariables>(AddCalendarEventDocument, variables)(),
      options
    );