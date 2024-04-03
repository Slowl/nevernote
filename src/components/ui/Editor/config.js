import Header from '@editorjs/header'
import List from '@editorjs/list'
import CheckList from '@editorjs/checklist'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import Delimiter from '@editorjs/delimiter'
import Code from '@editorjs/code'
import InlineCode from '@editorjs/inline-code'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import SimpleImage from '@editorjs/simple-image'

export const EditorjsPlugins = {
	header: Header,
	list: {
		class: List,
		inlineToolbar: true,
		config: {
			defaultStyle: 'unordered'
		}
	},
	checklist: CheckList,
	linkTool: LinkTool,
	embed: Embed,
	marker: Marker,
	quote: Quote,
	delimiter: Delimiter,
	code: Code,
	inlineCode: InlineCode,
	raw: Raw,
	table: Table,
	warning: Warning,
	simpleImage: SimpleImage,
}
