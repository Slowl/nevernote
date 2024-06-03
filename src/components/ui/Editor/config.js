import Header from '@editorjs/header'
import List from '@editorjs/list'
import CheckList from '@editorjs/checklist'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import Table from '@editorjs/table'
import SimpleImage from '@editorjs/simple-image'
// import Quote from '@editorjs/quote'
// import Code from '@editorjs/code'
// import InlineCode from '@editorjs/inline-code'
// import Raw from '@editorjs/raw'
// import Warning from '@editorjs/warning'

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
	delimiter: Delimiter,
	table: Table,
	simpleImage: SimpleImage,
	// quote: Quote,
	// code: Code,
	// inlineCode: InlineCode,
	// raw: Raw,
	// warning: Warning,
}
