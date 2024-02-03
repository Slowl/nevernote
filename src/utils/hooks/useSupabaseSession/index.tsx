import { useEffect, useState } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'

const useSupabaseSession = (supabase: SupabaseClient<any, 'public', any>, existingSession: Session | null) => {
	const [currentSession, setCurrentSession] = useState(existingSession)

	useEffect(
		() => {
			if (!(currentSession)) {
				supabase.auth.getSession().then(({ data: { session } }) => setCurrentSession(session))
			}

			const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
				setCurrentSession(session)
			})
			
			return () => subscription.unsubscribe()
		},
		[existingSession],
	)

	return currentSession
}

export default useSupabaseSession