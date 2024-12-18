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
import CheckList from '@editorjs/checklist'
// import Hyperlink from 'editorjs-hyperlink'
// import Quote from '@editorjs/quote'
// import Code from '@editorjs/code'
// import InlineCode from '@editorjs/inline-code'
// import Raw from '@editorjs/raw'
// import Warning from '@editorjs/warning'

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
	checklist: CheckList,
	// hyperlink: {
	// 	class: Hyperlink,
	// 	config: {
	// 		target: '_blank',
	// 		rel: 'nofollow',
	// 		availableTargets: ['_blank', '_self'],
	// 		availableRels: ['noreferrer', 'noopener noreferrer'],
	// 		validate: false,
	// 	}
	// },
	// quote: Quote,
	// code: Code,
	// inlineCode: InlineCode,
	// raw: Raw,
	// warning: Warning,
}
