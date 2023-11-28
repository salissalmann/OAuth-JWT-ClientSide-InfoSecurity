import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPluginOld';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { SetStateAction, useEffect, useState } from 'react';
import './editor.css';
import {
  $getRoot,
  CLEAR_HISTORY_COMMAND,
  EditorState,
  Klass,
  LexicalEditor,
  LexicalNode,
  SerializedEditorState,
  SerializedLexicalNode,
  // SerializedLexicalNode,
  // SerializedRootNode,
} from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ImagesPlugin from './plugins/ImagePlugin';
import { ImageNode } from './nodes/ImageNode';
import { EMPTY_CONTENT } from '../../pages/Questions/constants';

const editorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
];

interface EditorProps {
  editorState: SerializedEditorState<SerializedLexicalNode>; // Define the type for editorState
  setEditorState: (
    newState: SetStateAction<SerializedEditorState<SerializedLexicalNode>>,
    plainText: string
  ) => void; // Define the type for the change handler
  disabled: boolean;
  getPlainText?: boolean;
  reset?: boolean;
  showOutput?: boolean;
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}
function MyCustomEditorModeChangerPlugin({ editable }: { editable: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
}

function MyCustomPluginToSetEditorState({
  editorState,
}: {
  editorState: SerializedEditorState<SerializedLexicalNode>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const initialEditorState = editor.parseEditorState(editorState);
    editor.setEditorState(initialEditorState);
  }, []);

  return null;
}

export function RefreshContentBasedOnActiveDoc({
  initialEditorState,
  reset,
}: {
  initialEditorState: SerializedEditorState<SerializedLexicalNode>;
  reset: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (reset) {
      const newState = editor.parseEditorState(initialEditorState);
      editor.setEditorState(newState);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return null;
}
export default function Editor({
  editorState,
  setEditorState,
  disabled = false,
  getPlainText,
  reset,
  showOutput = false,
}: EditorProps) {
  const config: InitialConfigType = {
    namespace: 'MedShool',
    editorState: isEmptyObject(editorState)
      ? JSON.stringify(EMPTY_CONTENT)
      : JSON.stringify(editorState),
    theme: PlaygroundEditorTheme,
    onError(error: Error) {
      throw error;
    },
    nodes: [...editorNodes],
  };
  const [editorConfig, setEditorConfig] = useState<InitialConfigType>(config);

  useEffect(() => {
    setEditorConfig(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  function isEmptyObject(obj: object) {
    return Object.keys(obj).length === 0;
  }
  const [rawHtml, setRawHtml] = useState('');

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const result = $generateHtmlFromNodes(editor, null);
      setRawHtml(result);
    });

    const editorStateJSON = editorState.toJSON();
    let plainText = '';
    if (getPlainText) {
      const stringifiedEditorState = JSON.stringify(
        editor.getEditorState().toJSON()
      );
      const parsedEditorState = editor.parseEditorState(stringifiedEditorState);

      const editorStateTextString = parsedEditorState.read(() =>
        $getRoot().getTextContent()
      );

      plainText = editorStateTextString;
      // getPlainText(editorStateTextString);
    }

    setEditorState(editorStateJSON, plainText.trim());
  }

  return (
    <>
      <div className="space-y-10 w-full">
        <LexicalComposer initialConfig={editorConfig}>
          <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<h1></h1>}
                ErrorBoundary={LexicalErrorBoundary}
              />

              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <AutoLinkPlugin />
              <ListMaxIndentLevelPlugin maxDepth={7} />
              <OnChangePlugin onChange={onChange} />
              <MyCustomAutoFocusPlugin />
              <ImagesPlugin captionsEnabled={false}  />
              <MyCustomEditorModeChangerPlugin editable={!disabled} />
              <MyCustomPluginToSetEditorState editorState={editorState} />
              <RefreshContentBasedOnActiveDoc
                initialEditorState={editorState}
                reset={typeof reset !== 'undefined' ? reset : true}
              />
            </div>
          </div>
        </LexicalComposer>
        {showOutput && (
          <div className="">
            <h1 className="text-emerald-500">Output:</h1>

            <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
          </div>
        )}
      </div>
    </>
  );
}
