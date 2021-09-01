import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type CalendarKeySpecifier = ('id' | 'name' | 'owner' | CalendarKeySpecifier)[];
export type CalendarFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CalendarEventKeySpecifier = ('calendarId' | 'dateCreate' | 'dateEnd' | 'dateStart' | 'dateUpdate' | 'description' | 'id' | 'name' | CalendarEventKeySpecifier)[];
export type CalendarEventFieldPolicy = {
	calendarId?: FieldPolicy<any> | FieldReadFunction<any>,
	dateCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	dateEnd?: FieldPolicy<any> | FieldReadFunction<any>,
	dateStart?: FieldPolicy<any> | FieldReadFunction<any>,
	dateUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addCalendar' | 'addCalendarEvent' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addCalendar?: FieldPolicy<any> | FieldReadFunction<any>,
	addCalendarEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('calendar' | 'calendars' | 'calendarEvent' | 'calendarEvents' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	calendar?: FieldPolicy<any> | FieldReadFunction<any>,
	calendars?: FieldPolicy<any> | FieldReadFunction<any>,
	calendarEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	calendarEvents?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Calendar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CalendarKeySpecifier | (() => undefined | CalendarKeySpecifier),
		fields?: CalendarFieldPolicy,
	},
	CalendarEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CalendarEventKeySpecifier | (() => undefined | CalendarEventKeySpecifier),
		fields?: CalendarEventFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;