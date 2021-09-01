import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { AddNewEventForm } from './components/AddNewEventForm';
import { CalendarEvents } from './components/CalendarEvents';
import './styles.scss';
import { ApiInstance } from 'ApiInstance';
import { HttpResponse, Calendar, CalendarEvent } from 'generated/swagger-typescript-api';
import { useCalendarsQuery, useCalendarEventsQuery, CalendarEventsQuery, CalendarEvent as GqlCalendarEvent } from 'generated/graphql-codegen-react-query-api';
import { useCalendarsQuery as useApolloCalendarsQuery } from 'generated/graphql-codegen-react-apollo-api';

function App() {
    const date = new Date();
    const todayFormattedDate = date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });

    // 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
    // const {
    //     data,
    //     isLoading: isLoadingCalendar,
    //     isLoadingError: isLoadingCalendarError
    // } = useQuery<HttpResponse<Calendar[]>, Error, Calendar[]>(
    //     'calendars',
    //     () => ApiInstance.rest.calendarsCtrlGetAllCalendars(),
    //     { staleTime: Infinity }
    // );

    // 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
    // const {
    //     data,
    //     isLoading: isLoadingCalendar,
    //     isLoadingError: isLoadingCalendarError,
    // } = useCalendarsQuery({}, { staleTime: Infinity, select: (data) => data });

    // 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
    const {
        data,
        loading: isLoadingCalendar,
        error: isLoadingCalendarError,
    } = useApolloCalendarsQuery();

    const randomCalendar = useMemo(() => {
        if (!data?.calendars) {
            return;
        }

        return data?.calendars[Math.floor(Math.random()*data?.calendars.length)];
    }, [
        // 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
        // data
        // 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
        // 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
        data?.calendars
    ]);

    const randomCalendarId = randomCalendar?.id || '';

  return (
      <div className="wrapper">
          <div className="mobile-wrapper">
              <header className="header">
                  <div className="container">
                      <span>Add new event</span>
                      <h1>For {todayFormattedDate}</h1>
                  </div>
              </header>
              <div className="container">
                <AddNewEventForm calendarId={randomCalendarId} />
              </div>
          </div>
          <div className="mobile-wrapper">
              <header className="header">
                  <div className="container">
                      <span>Welcome Back!</span>
                      <h1>Calendar Plan for {randomCalendar?.name || ''}</h1>
                      <div className="menu-toggle">
                          <div>
                              <span />
                              <span />
                              <span />
                          </div>
                      </div>
                  </div>
              </header>
              <section className="today-box" id="today-box">
                  <span className="breadcrumb">Today</span>
                  <h3 className="date-title">{todayFormattedDate}</h3>
                  <div className="plus-icon">
                      <i className="ion ion-ios-calendar-outline" />
                  </div>
              </section>
              <CalendarEvents calendarId={randomCalendarId} />
              <div className="container center">
                  {isLoadingCalendar && 'Loading calendar data...'}
                  {isLoadingCalendarError && 'Loading calendar error'}
              </div>
          </div>
      </div>
  );
}

export default App;
