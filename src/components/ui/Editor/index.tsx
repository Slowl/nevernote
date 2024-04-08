import { memo, useEffect, useRef } from 'react'
import { styled } from '@linaria/react'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs'
// @ts-expect-error
import DragDrop from 'editorjs-drag-drop'
// @ts-expect-error
import Undo from 'editorjs-undo';
import { useNoteStore } from '@/store/index'
import { EditorjsPlugins } from './config'

//#region STYLES
const EditorContainer = styled.div`
	width: 100%; height: 100%;
	::selection {
		background: var(--color-grey-1);
		color: var(--color-black-2);
		border-radius: 4px;
	}

	.cdx-block {
		max-width: 100% !important;
		font-size: .93rem;
		padding-bottom: 1rem;

		a {
			color: #0083db;
		}
	}
	.ce-block__content, .ce-toolbar__content {
		max-width:calc(100% - 120px) !important;
		@media screen and (max-width: 650px) {
			max-width:calc(100% - 45px) !important;
		}
	}
	.ce-block--selected > .ce-block__content {
		color: var(--color-grey-0);
		background: var(--color-black-5) !important;
		border-radius: 4px;
	}
	.codex-editor {
		height: 100%;
	}
	.codex-editor__redactor {
		height: 100% !important;
		padding: 0 !important;
	}
	.ce-toolbar__plus, .ce-toolbar__settings-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 25px; height: 25px;
		font-size: 1rem;
		background-color: var(--color-black-3);
		color: var(--color-grey-0);
		border-radius: 50%;
		transition: all .2s;

		:hover {
			width: 25px; height: 25px;
			font-size: 1rem;
			background-color: var(--color-black-5);
			border-radius: 50%;
		}

		@media screen and (max-width: 650px) {
			margin: 0 3px;
		}
	}

	.ce-inline-toolbar {
		background-color: var(--color-black-2);
		border: 1px solid var(--color-black-4);
	}
	.ce-inline-tool {
		background-color: var(--color-black-2);
		:hover {
			background-color: var(--color-black-5);
		}
	}
	.ce-inline-toolbar__dropdown {
		background-color: var(--color-black-2);
	}
	.ce-conversion-toolbar {
		color: var(--color-grey-0);
		background-color: var(--color-black-2);
		border: 1px solid var(--color-black-4);

		.ce-conversion-tool__icon {
			background-color: var(--color-black-1);
			border: 1px solid var(--color-black-1);
			border-radius: 50%;
		}
	}
	.ce-conversion-tool {
		transition: .2s;
		&:hover {
			background: var(--color-black-3) !important;
		}
	}
	.ce-popover {
		color: var(--color-grey-0);
		background-color: var(--color-black-2);
		border: 1px solid var(--color-black-4);
		.ce-popover-item__icon {
			color: var(--color-grey-0);
			background-color: var(--color-black-1);
			border-radius: 50%;
			transition: .2s;
		}
		.ce-popover-item__title {
			color: var(--color-grey-0);
		}
		@media screen and (max-width: 650px) {
			bottom: 70px;
		}
	}
	.ce-popover-item:hover:not(.ce-popover-item--no-hover) {
		background-color: var(--color-black-3) !important;
	}
	.cdx-search-field {
		background-color: var(--color-black-0);
		> input {
			color: var(--color-grey-0);
		}
	}

	.cdx-checklist__item {
		.cdx-checklist__item-checkbox-check {
			width: 18px; height: 18px;
			border: 0;
			border-radius: 2px;
			background-color: var(--color-grey-0);
			> svg {
				left: 0;
			}
			&:before {
				background: var(--color-grey-3);
			}
		}
	}
	.cdx-checklist__item--checked {
		.cdx-checklist__item-checkbox-check {
			background: var(--color-grey-3);
		}
	}
	.cdx-checklist__item--checked .cdx-checklist__item-checkbox:not(.cdx-checklist__item--checked .cdx-checklist__item-checkbox--no-hover):hover .cdx-checklist__item-checkbox-check {
    background: var(--color-grey-2);
    border-color: var(--color-grey-2);
  }
`
//#endregion

const Editor = memo(({ configuration, onChange }: {
	configuration: EditorConfig;
	onChange: (note: OutputData) => void;
}) => {

	//#region SETUP
	const editorRef = useRef<EditorJS>()
	const setContent = useNoteStore((state) => state.setContent)
	//#endregion

	//#region CORE
	useEffect(
		() => {
			if (!editorRef.current) {
				const editor = new EditorJS({
					tools: EditorjsPlugins,
					onReady: () => {
						const undo = new Undo({ editor, config: { debounceTimer: 300 } })
						undo.initialize(configuration.data)
						new DragDrop(editor)
					},
					onChange(api) {
						requestAnimationFrame(async () => {

							const updatedBlockIndex = api.blocks.getCurrentBlockIndex()
							const noteContent = await api.saver.save()
							setContent(noteContent)

							if (noteContent.blocks[updatedBlockIndex].type === 'checklist') {
								console.log(updatedBlockIndex)
								onChange(noteContent)
							}
						})
					},
					...configuration,
				})
				editorRef.current = editor
			}
		},
		[configuration.holder]
	)
	//#endregion
	
	//#region RENDER
	if (typeof configuration.holder === 'string') {
		return <EditorContainer id={configuration.holder} />
	}

	return <>{configuration.holder}</>
	//#endregion
})

export default Editor