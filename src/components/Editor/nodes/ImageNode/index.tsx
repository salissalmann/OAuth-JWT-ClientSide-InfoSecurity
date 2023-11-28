import {
  $applyNodeReplacement,
  createEditor,
  DecoratorNode,
  DOMConversionMap,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import React, { Suspense } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const ImageComponent = React.lazy(() => import("./ImageComponent"));

function convertImageElement(domNode: Node) {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type Position = "left" | "right" | "full" | undefined;

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  maxWidth?: number;
  key?: NodeKey;
  showCaption?: boolean;
  captionsEnabled?: boolean;
  src: string;
  width?: number;
  position?: Position;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth?: number;
    showCaption: boolean;
    src: string;
    width?: number;
    position?: Position;
  },
  SerializedLexicalNode
>;

export interface UpdateImagePayload {
  altText?: string;
  showCaption?: boolean;
  position?: Position;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src;
  __altText;
  __width;
  __height;
  __maxWidth;
  __showCaption;
  __caption;
  // Captions cannot yet be used within editor cells
  __captionsEnabled;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__captionsEnabled,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode) {
    const { altText, height, width, maxWidth, caption, src, showCaption } =
      serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    });
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportDOM() {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      img: (_: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth?: "inherit" | number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    captionsEnabled?: boolean,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
    this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
  }

  exportJSON() {
    return {
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  setWidthAndHeight(width: "inherit" | number, height: "inherit" | number) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean) {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  decorate() {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth ? this.__maxWidth : 500}
          nodeKey={this.getKey()}
          showCaption={this.__showCaption}
          caption={this.__caption}
          captionsEnabled={this.__captionsEnabled}
          resizable={true}
          // position={position}
        />
      </Suspense>
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  captionsEnabled,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload) {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      captionsEnabled,
      key
    )
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
