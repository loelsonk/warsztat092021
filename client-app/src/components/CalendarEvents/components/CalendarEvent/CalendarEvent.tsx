import React, { FC } from 'react';
// import { CalendarEvent } from 'generated/swagger-typescript-api';
import { BaseCalendarEvent, Optional } from 'types';
import { isEventNow, getRemainingTimeInfo } from './CalendarEvent.helpers';



interface EventProps<T> {
    event: Optional<T>;
    hot: boolean;
}

export const Event = <T extends BaseCalendarEvent>({ event, hot }: EventProps<T>) => {
    if (!event) {
        return null;
    }

    if (isEventNow(event.dateStart, event.dateEnd)) {
        return (
            <div className="event active">
                <i className="ion ion-ios-radio-button-on icon-in-active-mode" />
                <h4 className="event__point">{event.name}</h4>
                <p className="event__description">
                    {event.description}
                </p>
            </div>
        )
    }

    return (
        <div className="event">
            <i className={`ion ${hot ? 'ion-ios-flame hot' : 'ion-ios-flame-outline upcoming'}`} />
            <h4 className="event__point">{event.name}</h4>
            <span className="event__duration">{getRemainingTimeInfo(event)}</span>
            <p className="event__description">
                {event.description}
            </p>
        </div>
    )
}
