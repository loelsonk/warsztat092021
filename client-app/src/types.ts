export type Optional<T = string> = T | undefined | null;

export interface BaseCalendarEvent {
    id?: Optional;
    name?: Optional;
    description?: Optional;
    dateStart?: Optional;
    dateEnd?: Optional;
}