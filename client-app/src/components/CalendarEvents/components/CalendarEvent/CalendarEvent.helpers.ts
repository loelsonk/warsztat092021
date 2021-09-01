import { CalendarEvent } from 'generated/swagger-typescript-api';
import { BaseCalendarEvent, Optional } from 'types';

export const isEventNow = (start: Optional, end: Optional) => {
    if (!start || !end) {
        return false;
    }

    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    const now = new Date();
    return now >= dateStart && now <= dateEnd;
}

export const getRemainingTimeInfo = (event: BaseCalendarEvent) => {
    if (!event.dateStart) {
        return;
    }

    const startDate = new Date(event.dateStart).getTime();
    const now = new Date().getTime();
    const timeLeft = startDate - now;

    const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));

    const remainingTime =  `${days ? `${days} day(s)` : ''}${hours ? ` ${hours} hour(s)` : ''}${minutes ? ` ${minutes} minute(s)` : ''}`;

    if (remainingTime) {
        return `in ${remainingTime}`;
    }

    return 'past';
}
