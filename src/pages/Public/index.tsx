import { themeDark } from '../../styles'
import { styled } from '@linaria/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { OutputData } from '@editorjs/editorjs'
import { supabase } from '@/services/supabase'
import Loader from '@/components/ui/Loader'
import Editor from '@/components/ui/Editor'

//#region STYLES
const AppContainer = styled.div`
	width: 100%; height: 100svh;
	display: flex;
`
const FormNoteContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem .2rem;
	z-index: 0;
	@media screen and (max-width: 650px) {
		height: calc(100svh - 48px);
	}
`
const FormInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
	gap: .5rem 0;
	overflow-y: auto;
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
	scrollbar-width: thin;

	@media screen and (max-width: 650px) {
		overflow-x: hidden;
	}
`
const FormHead = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	width: calc(100% - 110px);
	margin: auto;
	> input[type='text'] {
		flex-grow: 1;
		padding: .4rem 0;
		font-size: 1.3rem;
		font-weight: bold;
		border: 0;
		color: var(--color-grey-0);
		background-color: var(--color-black-0);

		&:focus-visible {
			outline: 0;
		}
	}
	@media screen and (max-width: 650px) {
		width: calc(100% - 35px);
	}
`
const FormBody = styled.div`
	display: flex;
	flex-grow: 1;
	height: 85svh; min-height: 20vh;
`
//#endregion

const PublicNote = () => {

	//#region SETUP
	const { publicNoteId } = useParams()
	const [isLoading, setIsLoading] = useState(false)
	const [content, setContent] = useState<OutputData>()
	const [title, setTitle] = useState('')
	//#endregion

	//#region CORE
	useEffect(
		() => {
			setIsLoading(true)
			Promise.allSettled([
				supabase.rpc('getPublicNoteTitle', { note_id: publicNoteId ?? '' })
					.then((response) => response.data),
				supabase.rpc('getPublicNoteContent', { note_id: publicNoteId ?? '' })
					.then((response) => response.data),
			])
			.then(([title, content]) => {
				//@ts-expect-error
				setTitle(title.value)
				//@ts-expect-error
				setContent(content.value)
				setIsLoading(false)
			})
		},
		[publicNoteId]
	)
	//#endregion

	//#region RENDER
	return (
		<AppContainer className={themeDark}>
			<FormNoteContainer>
				<FormInputContainer>
					{(isLoading)  
						? <Loader />
						: (
							<>
								<FormHead>
									<input
										type='text'
										onChange={(event => setTitle(event.target.value))}
										value={title}
										disabled
									/>
								</FormHead>
								<FormBody>
									<Editor
										configuration={{
											holder: 'public-note-editor',
											data: content as OutputData,
											autofocus: false,
											readOnly: true,
										}}
									/>
								</FormBody>
							</>
						)
					}
				</FormInputContainer>
			</FormNoteContainer>
		</AppContainer>
	)
	//#endregion
}

export default PublicNote