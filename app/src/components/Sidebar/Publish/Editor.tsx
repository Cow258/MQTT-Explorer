import * as React from 'react'
import { default as AceEditor } from 'react-ace'
import { useTheme } from '@mui/material/styles'
import 'ace-builds'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/xml'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-monokai'

function Editor(props: {
  editorMode: string
  value: string | undefined
  onChange: (value: string) => void
  editorRef: React.Ref<AceEditor>
}) {
  const theme = useTheme()
  const editorOptions = {
    showLineNumbers: false,
    tabSize: 2,
  }
  const mode = props.editorMode === 'json' || props.editorMode === 'xml' ? props.editorMode : 'text'
  const placeholder = props.editorMode === 'hex' ? '01 02 FF   or   0x01 0x02 0xFF' : undefined

  return (
    <AceEditor
      ref={props.editorRef}
      style={{}}
      mode={mode}
      placeholder={placeholder}
      wrapEnabled={props.editorMode === 'hex'}
      theme={theme.palette.mode === 'dark' ? 'monokai' : 'dawn'}
      name="UNIQUE_ID_OF_DIV"
      width="100%"
      height="200px"
      enableSnippets
      enableBasicAutocompletion
      enableLiveAutocompletion
      showPrintMargin={false}
      showGutter
      value={props.value}
      onChange={props.onChange}
      setOptions={editorOptions}
      editorProps={{ $blockScrolling: true }}
    />
  )
}

export default Editor
