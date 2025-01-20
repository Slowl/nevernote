import { ReactNode } from 'react'
import { IconType } from  'react-icons'

export enum NoteCategory {
	MY_NOTES = 'MY_NOTES',
	BOOKMARKS = 'BOOKMARKS',
	SHARED = 'SHARED',
	PUBLIC = 'PUBLIC',
	ARCHIVED = 'ARCHIVED'
}

export enum ToastType {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	WARNING = 'WARNING'
}

export type Toast = {
	isVisible: boolean;
	content: ReactNode | 'string';
	type?: ToastType;
	icon?: IconType;
	duration?: number;
}