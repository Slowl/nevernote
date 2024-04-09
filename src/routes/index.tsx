import { createBrowserRouter, redirect } from 'react-router-dom'
import { TbList, TbUsers, TbEyeShare, TbArchive } from 'react-icons/tb'
import { supabase } from '@/services/supabase'
import { NoteCategory } from '@/types/index'
import { getNotesByCategory } from '@/utils/api'
import App from '@/pages/App'
import AuthView from '@/pages/Auth'
import { NotesList } from '@/components/blocks/NotesList'

export const routes = {
	[NoteCategory.MY_NOTES]: {
		path: '/my-notes',
		icon: TbList,
		title: 'My notes', 
	},
	[NoteCategory.SHARED]: {
		path: '/shared-with-me',
		icon: TbUsers,
		title: 'Shared with me', 
	},
	[NoteCategory.PUBLIC]: {
		path: '/public',
		icon: TbEyeShare,
		title: 'Public', 
	},
	[NoteCategory.ARCHIVED]: {
		path: '/archived',
		icon: TbArchive,
		title: 'Archived', 
	},
}

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (!(session)) { return redirect('/login') }

			return session
		},
		children: [
			{
				path: routes[NoteCategory.MY_NOTES].path,
				element: <NotesList currentPageTitle={routes[NoteCategory.MY_NOTES].title} />,
				loader: async () => getNotesByCategory(NoteCategory.MY_NOTES)
			},
			{
				path: routes[NoteCategory.SHARED].path,
				element: <NotesList currentPageTitle={routes[NoteCategory.SHARED].title} />,
				loader: async () => getNotesByCategory(NoteCategory.SHARED)
			},
			{
				path: routes[NoteCategory.PUBLIC].path,
				element: <NotesList currentPageTitle={routes[NoteCategory.PUBLIC].title} />,
				loader: async () => getNotesByCategory(NoteCategory.PUBLIC)
			},
			{
				path: routes[NoteCategory.ARCHIVED].path,
				element: <NotesList currentPageTitle={routes[NoteCategory.ARCHIVED].title} />,
				loader: async () => getNotesByCategory(NoteCategory.ARCHIVED)
			},
		],
	},
	{
		path: '/login',
		element: <AuthView />,
		loader: async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (session) { return redirect(routes[NoteCategory.MY_NOTES].path) }

			return null
		},
	},
])