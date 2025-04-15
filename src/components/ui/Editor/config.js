import Paragraph from '@editorjs/paragraph'
import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list'
// import List from '@editorjs/list'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import Table from '@editorjs/table'
import SimpleImage from '@editorjs/simple-image'
import Underline from '@editorjs/underline'
import Alert from 'editorjs-alert'
import CheckList from '@editorjs/checklist'

export const EditorjsPlugins = {
	paragraph: {
		class: Paragraph,
		inlineToolbar: true,
		config: {
			preserveBlank: true,
		},
	},
	header: Header,
	list: {
		class: EditorjsList,
		inlineToolbar: true,
		config: {
			defaultStyle: 'unordered'
		}
	},
	linkTool: LinkTool,
	embed: Embed,
	marker: Marker,
	delimiter: Delimiter,
	table: Table,
	underline: Underline,
	simpleImage: SimpleImage,
	alert: Alert,
	checklist: CheckList,
}
