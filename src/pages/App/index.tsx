import { themeDark } from '../../styles'
import { useEffect, useState } from 'react'
import { Navigate, useLoaderData } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { styled } from '@linaria/react'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'
import Navbar from '@/components/blocks/Navbar'

//#region STYLE
const AppContainer = styled.div`
	width: 100%; height: 100svh;
	display: flex;
`

const MainContainer = styled.div`
	width: 100%;
`
const EditorContainer = styled.div`
	border: 1px solid white;
	width: 100%;
	display: flex;

	.notes {
		width: 30%;
	}
	.inputs {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
`
//#endregion

const App = () => {

	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	const [noteId, setNoteId] = useState('')
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [notes, setNotes] = useState<any>(null)

	const handleCreateNote = async () => {
		try {
			const { error } = await supabase
			.from('notes')
			.insert({ title: title, content: body, created_by: currentSession?.user.id })

			if (error) { return console.log('error: ', error) }

			return console.log('success')
		} catch (error) {
			console.log('error: ', error)
		}
	}

	const handleSelectNote = (note: any) => {
		setTitle(note.title)
		setBody(note.content)
		setNoteId(note.id)
	}

	const handleUpdateNote = async () => {
		try {
			const { error } = await supabase
			.from('notes')
			.update({
					title,
					content: body,
					updated_at: new Date(),
					updated_by: currentSession?.user.id
				})
			.eq('id', noteId)

			if (error) { return console.log('error: ', error) }

			return console.log('success')
		} catch (error) {
			console.log('error: ', error)
		}
	}

	useEffect(
		() => {
			supabase
			.from('notes')
			.select()
			.then((notes) => setNotes(notes.data))
		},
		[],
	)

	if (!(currentSession)) {
		return <Navigate to='/login'/>
	}

	return (
		<AppContainer className={themeDark}>
			<Navbar />
			<MainContainer>
				<EditorContainer>
					<div className='notes'>
						notes
						{console.log(notes)}
						{notes?.map((note: any) => <div onClick={() => handleSelectNote(note)}>{note.title}</div>)}
					</div>
					<div className='inputs'>
						<input type='text' onChange={(event => setTitle(event.target.value))} value={title} />
						<textarea onChange={(event => setBody(event.target.value))} value={body}></textarea>
					</div>
				</EditorContainer>
				<div
					style={{ display: 'inline-block', border: '1px solid white', padding: '.5rem' }}
					onClick={() => noteId ? handleUpdateNote() : handleCreateNote()}
				>
					send
				</div>
			</MainContainer>
		</AppContainer>
	)
}

export default App