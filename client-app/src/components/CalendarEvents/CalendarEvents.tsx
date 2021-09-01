import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { ApiInstance } from 'ApiInstance';
// 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
import {
    HttpResponse,
    Calendar,
    // CalendarEvent,
} from 'generated/swagger-typescript-api';
// 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
import {
    // useCalendarEventsQuery,
    // CalendarEvent,
} from 'generated/graphql-codegen-react-query-api';
import {
    useCalendarEventsQuery,
    CalendarEvent,
} from 'generated/graphql-codegen-react-apollo-api';
import { BaseCalendarEvent, Optional } from 'types';
import { Event } from './components/CalendarEvent';

export function CalendarEvents({ calendarId }: { calendarId: string }) {
    // 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
    const { data: events } = useQuery<HttpResponse<CalendarEvent[]>, Error, CalendarEvent[]>(
        ['calendarEvents', calendarId], () => ApiInstance.rest.eventsCtrlGetEvents(calendarId), {
            enabled: !!calendarId,
            staleTime: Infinity,
        });

    // 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
    // const { data: { calendarEvents: events } = {} } = useCalendarEventsQuery({ calendarId }, {
    //     enabled: !!calendarId,
    //     staleTime: Infinity,
    //     select: (data) => data,
    // });

    // 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
    // const { data: { calendarEvents: events } = {} } = useCalendarEventsQuery({
    //     variables: { calendarId },
    //     skip: !calendarId,
    // });
    
    if (!events?.length) {
        return null;
    }

    return (
        <section className="upcoming-events">
            <div className="container">
                <h3>
                    Calendar Events ({events.length})
                </h3>
                <div className="events-wrapper">
                    {events.map((event, index) => (
                        <Event<CalendarEvent> key={event.id} event={event} hot={index % 2 === 0} />
                    ))}
                </div>
            </div>
        </section>
    )
};
