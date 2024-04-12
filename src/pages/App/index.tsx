import { useEffect } from 'react'
import { Navigate, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@linaria/react'
import { Session } from '@supabase/supabase-js'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'
import { getUser } from '@/utils/queries'
import { useUserStore } from '@/store/index'
import { routes } from '@/routes/index'
import Toast from '@/components/ui/Toast'
import Navbar from '@/components/blocks/Navbar'
import { NotesListLayout } from '@/components/blocks/NotesList'
import FormNote from '@/components/blocks/Form/Note'
import { themeDark } from '../../styles'

//#region STYLES
const AppContainer = styled.div`
	width: 100%; height: 100svh;
	display: flex;
`
//#endregion

const App = () => {

	//#region SETUP
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	const setCurrentUserId = useUserStore((state) => state.setCurrentUserId)
	const resetCurrentUser = useUserStore((state) => state.resetCurrentUser)
	//#endregion

	//#region CORE
	useQuery(
		getUser({ userId: currentSession?.user.id ?? '' }),
		{ enabled: !!(currentSession?.user.id) }
	)

	useEffect(
		() => {
			if (currentSession?.user.id) {
				setCurrentUserId(currentSession.user.id)
			}
			if (pathname === '/') {
				navigate(routes.MY_NOTES.path)
			}

			return () => { resetCurrentUser() }
		},
		[currentSession?.user.id],
	)
	//#endregion

	//#region RENDER
	if (!(currentSession)) {
		return <Navigate to='/login'/>
	}

	return (
		<AppContainer className={themeDark}>
			<Toast />
			<Navbar />
			<NotesListLayout />
			<FormNote />
		</AppContainer>
	)
	//#endregion
}

export default App