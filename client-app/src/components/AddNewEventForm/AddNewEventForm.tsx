import React, { FC, useRef } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { ApiInstance } from 'ApiInstance';
// 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
import { CalendarEvent } from 'generated/swagger-typescript-api';
// 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
// import { AddCalendarEventMutationVariables, useAddCalendarEventMutation } from 'generated/graphql-codegen-react-query-api';
// 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
// import { AddCalendarEventMutationVariables, useAddCalendarEventMutation } from 'generated/graphql-codegen-react-apollo-api';
import './AddNewEventFrom.styles.scss';

const initialFormValues = new Map([
    ['name', ''],
    ['time', ''],
    ['duration', '00:30'],
    ['description', ''],
]);

const getRequestDates = (entries: { [key: string]: string; }) => {
    const today = new Date();
    const [hours, minutes] = entries.time.split(':');
    const [durHours, durMinutes] = entries.duration.split(':');

    const dateStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours, +minutes, 0);
    const dateEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours + +durHours, +minutes + +durMinutes, 0);

    return {
        dateStart: dateStart.toISOString(),
        dateEnd: dateEnd.toISOString(),
    }
}

// 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
const requestMapper = (calendarId: string, entries: { [key: string]: string; }): CalendarEvent => {
    return  {
        calendarId,
        name: entries.name,
        description: entries.description,
        ...getRequestDates(entries),
    };
}
// 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
// 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
// const requestMapper = (calendarId: string, entries: { [key: string]: string; }): AddCalendarEventMutationVariables => {
//     return  {
//         calendarId,
//         calendarEventInput: {
//             calendarId,
//             name: entries.name,
//             description: entries.name,
//             ...getRequestDates(entries),
//         },
//     }
// }

export const AddNewEventForm: FC<{ calendarId: string }> = ({ calendarId }) => {
    const formValuesRef = useRef(new Map([
        ['name', ''],
        ['time', ''],
        ['duration', '00:30'],
        ['description', ''],
    ]));

    const queryClient = useQueryClient();

    // 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
    const { mutate } = useMutation((values: CalendarEvent) => {
        return ApiInstance.rest.eventsCtrlSave(calendarId, values)
    }, {
        onSuccess: () => {
            // Invalidate and refetch
            void queryClient.invalidateQueries('calendarEvents');
        },
    })
    // 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
    // const { mutate } = useAddCalendarEventMutation({
    //     onSuccess: () => {
    //         // Invalidate and refetch
    //         void queryClient.invalidateQueries('calendarEvents');
    //     },
    // });

    // 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
    // const [mutate] = useAddCalendarEventMutation();

    const set = (key: string) => (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        formValuesRef.current.set(key, e.currentTarget.value);
    };

    return (
        <form className="add-new-event-form" onSubmit={(e) => {
            e.preventDefault();
            // 🟢🟢🟢 React-Query Swagger API 🟢🟢🟢
            // 🔴🔴🔴 React-Query GraphQL API graphql 🔴🔴🔴
            mutate(requestMapper(calendarId, Object.fromEntries(formValuesRef.current)));
            // 🟣🟣🟣 React-Apollo GraphQL API 🟣🟣🟣
            // mutate({
            //     variables: requestMapper(calendarId, Object.fromEntries(formValuesRef.current)),
            // });
        }}>
            <label htmlFor="name">
                <div>Name</div>
                <input placeholder="Enter event name..." className="input-text" required name="name" type="text" onChange={set('name')} />
            </label>
            <label htmlFor="time">
                <div>Start time</div>
                <input className="input-text" required name="time" type="time" min="08:00" max="23:00" placeholder="time" onChange={set('time')} />
            </label>
            <label htmlFor="duration">
                <div>Duration</div>
                <select className="input-select" required name="duration" onChange={set('duration')}>
                    <option value="00:30" selected>00:30</option>
                    <option value="01:00">01:00</option>
                    <option value="01:30">01:30</option>
                    <option value="02:00">02:00</option>
                </select>
            </label>
            <label htmlFor="description">
                <div>Description</div>
                <textarea className="input-textarea" placeholder="Enter event description..." required name="description" cols={30} rows={4} onChange={set('description')} />
            </label>
                <button type="submit" className="add-event-button">
                    <span className="add-event-button__title">Add Event</span>
                    <span className="add-event-button__icon">
                    <i className="ion ion-ios-add-outline" />
                </span>
                </button>
        </form>
    )
}