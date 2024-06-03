import { createBrowserRouter, redirect } from 'react-router-dom'
import { TbList, TbUsers, TbEyeCheck, TbArchive } from 'react-icons/tb'
import { supabase } from '@/services/supabase'
import { NoteCategory } from '@/types/index'
import App from '@/pages/App'
import AuthView from '@/pages/Auth'
import PublicNote from '@/pages/Public'
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
		icon: TbEyeCheck,
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
				element: <NotesList category={NoteCategory.MY_NOTES} currentPageTitle={routes[NoteCategory.MY_NOTES].title} />,
			},
			{
				path: routes[NoteCategory.SHARED].path,
				element: <NotesList category={NoteCategory.SHARED} currentPageTitle={routes[NoteCategory.SHARED].title} />,
			},
			{
				path: routes[NoteCategory.PUBLIC].path,
				element: <NotesList category={NoteCategory.PUBLIC} currentPageTitle={routes[NoteCategory.PUBLIC].title} />,
			},
			{
				path: routes[NoteCategory.ARCHIVED].path,
				element: <NotesList category={NoteCategory.ARCHIVED} currentPageTitle={routes[NoteCategory.ARCHIVED].title} />,
			},
		],
	},
	{
		path: '/note/:publicNoteId',
		element: <PublicNote />,
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