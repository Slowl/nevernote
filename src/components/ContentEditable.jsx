import React from 'react';
import styled from 'styled-components'

const MainInput = styled.div`
  display: block;
  box-sizing: border-box;
  min-width: 100%;
  max-width: 100%;
  height: calc(100% - 9.2em);
  border: 0;
  padding: .5em 1.5em 0em 1.5em;
  resize: none;
  font-family: 'Hind Madurai', sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-wrap: break-word;
  color: ${props => props.theme.grey8};
  cursor: text;
  scrollbar-color: ${props => props.theme.grey2} rgba(0,0,0,0);
  scrollbar-with: thin;
  transition: all ease .4s;

  @media screen and (max-width: 45em) {
    height: calc(100% - 8.1em);
 }

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.grey1};
    border: 0px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.grey2};
  }
  ::-webkit-scrollbar-thumb:active {
    background: ${props => props.theme.grey2};
  }
  ::-webkit-scrollbar-track {
    background: #rgba(0,0,0,0);
    border: 0px none ${props => props.theme.white};
  }
  ::-webkit-scrollbar-track:hover {
    background: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-track:active {
    background: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  :focus {
    outline: 0;
  }

  :empty:before{
    content: 'write your note ...';
    color: ${props => props.theme.lightGrey};
}
`

const TextContainer = styled.span`
  font-weight: 300;
  font-size: 1.13em;
  letter-spacing: 1px;
  word-spacing: 2px;
  @media screen and (max-width: 45em) {
    font-size: 1.1em;
    letter-spacing: 0px;
    word-spacing: 1px;
 }
`

export default class ContentEditable extends React.Component {

  shouldComponentUpdate(nextProps){
        return nextProps.html !== this.noteInputRef.innerHTML
    }

  componentDidUpdate() {
    if ( this.props.html !== this.noteInputRef.innerHTML ) {
       this.noteInputRef.innerHTML = this.props.html
    }
  }

  emitChange = () => {
    const html = this.noteInputRef.innerHTML
    if (this.props.onChange && html !== this.lastHtml) {
        this.props.onChange({
            target: {
                value: html
            }
        })
    }
    this.lastHtml = html
  }

  handlePaste = e => {
    e.persist()
    e.preventDefault()
    const textToPaste = (e.originalEvent || e).clipboardData.getData('text/plain')
    document.execCommand("insertText", false, textToPaste)
  }

render() {
    return(
      <MainInput
        ref={(ref) => {this.noteInputRef = ref} }
        onInput={this.emitChange}
        onBlur={this.emitChange}
        onPaste={this.handlePaste}
        contentEditable>
        <TextContainer>{this.props.value}</TextContainer>
      </MainInput>
    )
  }
}

// Code to handle onBlur effect to force the update and get latest states
// but push the cursor at the beginning each update <- issue to fix [wip]
// can pass the emitChange to the handleBlur = à tester

// state = {
//   isBlurred: true,
//   html: ''
// }
//
// shouldComponentUpdate(){
//   return this.state.isBlurred
// }
//
// componentDidUpdate() {
//     if ( this.state.isBlurred ) {
//        this.nodeSelect.innerHTML = this.props.html
//     }
// }
//
// emitChange = () => {
//     const html = this.nodeSelect.innerHTML
//     if (this.props.onChange && html !== this.lastHtml) {
//         this.props.onChange({
//             target: {
//                 value: html
//             }
//         })
//     }
//     this.lastHtml = html
// }
//
// handleBlur = blurFunc => {
//   this.setState(prevState => ({
//     isBlurred: !prevState.isBlurred
//   }))
//   console.log(this.state.isBlurred)
// }
//
// handleFocus = () => {
//   this.setState(prevState => ({
//     isBlurred: !prevState.isBlurred
//   }))
//   console.log(this.state.isBlurred)
// }
//
//
// render() {
//   const { ...otherAttributes } = this.props;
//   return(
//     <MainInput ref={(ref) => {this.nodeSelect = ref} }
//           onInput={this.emitChange}
//           onBlur={() => this.handleBlur(this.props.onBlur)}
//           onFocus={this.handleFocus}
//           contentEditable
//           dangerouslySetInnerHTML={{__html: this.props.html}}>{this.props.value}</MainInput>
//   )
// }
// }
