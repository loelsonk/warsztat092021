import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export const CalendarFieldsFragmentDoc = gql`
    fragment CalendarFields on Calendar {
  id
  name
  owner
}
    `;
export const CalendarEventFieldsFragmentDoc = gql`
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
export const CalendarsDocument = gql`
    query calendars {
  calendars {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;

/**
 * __useCalendarsQuery__
 *
 * To run a query within a React component, call `useCalendarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCalendarsQuery(baseOptions?: Apollo.QueryHookOptions<CalendarsQuery, CalendarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarsQuery, CalendarsQueryVariables>(CalendarsDocument, options);
      }
export function useCalendarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarsQuery, CalendarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarsQuery, CalendarsQueryVariables>(CalendarsDocument, options);
        }
export type CalendarsQueryHookResult = ReturnType<typeof useCalendarsQuery>;
export type CalendarsLazyQueryHookResult = ReturnType<typeof useCalendarsLazyQuery>;
export type CalendarsQueryResult = Apollo.QueryResult<CalendarsQuery, CalendarsQueryVariables>;
export const CalendarDocument = gql`
    query calendar($calendarId: String!) {
  calendar(id: $calendarId) {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;

/**
 * __useCalendarQuery__
 *
 * To run a query within a React component, call `useCalendarQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarQuery({
 *   variables: {
 *      calendarId: // value for 'calendarId'
 *   },
 * });
 */
export function useCalendarQuery(baseOptions: Apollo.QueryHookOptions<CalendarQuery, CalendarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarQuery, CalendarQueryVariables>(CalendarDocument, options);
      }
export function useCalendarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarQuery, CalendarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarQuery, CalendarQueryVariables>(CalendarDocument, options);
        }
export type CalendarQueryHookResult = ReturnType<typeof useCalendarQuery>;
export type CalendarLazyQueryHookResult = ReturnType<typeof useCalendarLazyQuery>;
export type CalendarQueryResult = Apollo.QueryResult<CalendarQuery, CalendarQueryVariables>;
export const CalendarEventDocument = gql`
    query calendarEvent($calendarEventId: String!) {
  calendarEvent(id: $calendarEventId) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;

/**
 * __useCalendarEventQuery__
 *
 * To run a query within a React component, call `useCalendarEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarEventQuery({
 *   variables: {
 *      calendarEventId: // value for 'calendarEventId'
 *   },
 * });
 */
export function useCalendarEventQuery(baseOptions: Apollo.QueryHookOptions<CalendarEventQuery, CalendarEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarEventQuery, CalendarEventQueryVariables>(CalendarEventDocument, options);
      }
export function useCalendarEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarEventQuery, CalendarEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarEventQuery, CalendarEventQueryVariables>(CalendarEventDocument, options);
        }
export type CalendarEventQueryHookResult = ReturnType<typeof useCalendarEventQuery>;
export type CalendarEventLazyQueryHookResult = ReturnType<typeof useCalendarEventLazyQuery>;
export type CalendarEventQueryResult = Apollo.QueryResult<CalendarEventQuery, CalendarEventQueryVariables>;
export const CalendarEventsDocument = gql`
    query calendarEvents($calendarId: String!) {
  calendarEvents(calendarId: $calendarId) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;

/**
 * __useCalendarEventsQuery__
 *
 * To run a query within a React component, call `useCalendarEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarEventsQuery({
 *   variables: {
 *      calendarId: // value for 'calendarId'
 *   },
 * });
 */
export function useCalendarEventsQuery(baseOptions: Apollo.QueryHookOptions<CalendarEventsQuery, CalendarEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarEventsQuery, CalendarEventsQueryVariables>(CalendarEventsDocument, options);
      }
export function useCalendarEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarEventsQuery, CalendarEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarEventsQuery, CalendarEventsQueryVariables>(CalendarEventsDocument, options);
        }
export type CalendarEventsQueryHookResult = ReturnType<typeof useCalendarEventsQuery>;
export type CalendarEventsLazyQueryHookResult = ReturnType<typeof useCalendarEventsLazyQuery>;
export type CalendarEventsQueryResult = Apollo.QueryResult<CalendarEventsQuery, CalendarEventsQueryVariables>;
export const AddCalendarDocument = gql`
    mutation addCalendar($calendarInput: CalendarInput!) {
  addCalendar(calendarInput: $calendarInput) {
    ...CalendarFields
  }
}
    ${CalendarFieldsFragmentDoc}`;
export type AddCalendarMutationFn = Apollo.MutationFunction<AddCalendarMutation, AddCalendarMutationVariables>;

/**
 * __useAddCalendarMutation__
 *
 * To run a mutation, you first call `useAddCalendarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCalendarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCalendarMutation, { data, loading, error }] = useAddCalendarMutation({
 *   variables: {
 *      calendarInput: // value for 'calendarInput'
 *   },
 * });
 */
export function useAddCalendarMutation(baseOptions?: Apollo.MutationHookOptions<AddCalendarMutation, AddCalendarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCalendarMutation, AddCalendarMutationVariables>(AddCalendarDocument, options);
      }
export type AddCalendarMutationHookResult = ReturnType<typeof useAddCalendarMutation>;
export type AddCalendarMutationResult = Apollo.MutationResult<AddCalendarMutation>;
export type AddCalendarMutationOptions = Apollo.BaseMutationOptions<AddCalendarMutation, AddCalendarMutationVariables>;
export const AddCalendarEventDocument = gql`
    mutation addCalendarEvent($calendarId: String!, $calendarEventInput: CalendarEventInput!) {
  addCalendarEvent(
    calendarId: $calendarId
    calendarEventInput: $calendarEventInput
  ) {
    ...CalendarEventFields
  }
}
    ${CalendarEventFieldsFragmentDoc}`;
export type AddCalendarEventMutationFn = Apollo.MutationFunction<AddCalendarEventMutation, AddCalendarEventMutationVariables>;

/**
 * __useAddCalendarEventMutation__
 *
 * To run a mutation, you first call `useAddCalendarEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCalendarEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCalendarEventMutation, { data, loading, error }] = useAddCalendarEventMutation({
 *   variables: {
 *      calendarId: // value for 'calendarId'
 *      calendarEventInput: // value for 'calendarEventInput'
 *   },
 * });
 */
export function useAddCalendarEventMutation(baseOptions?: Apollo.MutationHookOptions<AddCalendarEventMutation, AddCalendarEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCalendarEventMutation, AddCalendarEventMutationVariables>(AddCalendarEventDocument, options);
      }
export type AddCalendarEventMutationHookResult = ReturnType<typeof useAddCalendarEventMutation>;
export type AddCalendarEventMutationResult = Apollo.MutationResult<AddCalendarEventMutation>;
export type AddCalendarEventMutationOptions = Apollo.BaseMutationOptions<AddCalendarEventMutation, AddCalendarEventMutationVariables>;