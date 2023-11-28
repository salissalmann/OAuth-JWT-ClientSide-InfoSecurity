/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import { useEffect, useRef, useState } from "react";

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from "../../nodes/ImageNode";
import { CAN_USE_DOM } from "../../shared/src/canUseDOM";
import {
  ButtonFill,
  ButtonOutlined,
  Input,
  InsertImageIcon,
  Label,
  UploadIcon,
} from "../../../UiComponents";
import { SubTitle } from "../../../UiComponents/Headings";
import { createImage } from "../../../../services/api/imageApi";

const getDOMSelection = (targetWindow: Window | null) =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand(
  "INSERT_IMAGE_COMMAND"
);

interface InsertImageUploadedDialogBodyProps {
  onClick: (payload: {
    altText: string;
    src: File | null | string;
    type?: string;
  }) => void;
  setShowDialog: (show: boolean) => void;
  setMode: (mode: string) => void;
}

export function InsertImageUploadedDialogBody({
  onClick,
  setShowDialog,
  setMode,
}: InsertImageUploadedDialogBodyProps) {
  const [src, setSrc] = useState<File | null>(null);
  const [altText, setAltText] = useState<string>("");

  const isDisabled = src === null;

  const loadImage = (files: FileList | null) => {
    if (files !== null) {
      const file = files[0];
      setSrc(file);
    }
  };

  const closeOnOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("bg-opacity-75")) {
      setShowDialog(false);
      setMode("");
    }
  };
  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto "
      onClick={closeOnOutsideClick}
    >
      <div className="flex items-center justify-center min-h-screen text-center">
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity  "
          aria-hidden="true"
        ></div>
        <div className="inline-block relative z-[300] p-4 my-8 align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-sm sm:w-full">
          <div className="">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4">
                  <UploadIcon size="w-12 h-12" color="text-gray-500" />
                  <div className="text-center">
                    <p className="mb-2 text-lg text-gray-500 font-semibold">
                      Click to upload
                    </p>
                    <p className="text-base text-gray-500">
                      accepted: SVG, PNG, JPG, JPEG, or GIF
                    </p>
                  </div>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => loadImage(e.target.files)}
                  accept="image/*"
                  // className="hidden"
                />
              </label>
            </div>
            <input
              type="text"
              name=""
              id=""
              onChange={(e) => setAltText(e.target.value)}
            />

            <div className="flex flex-col space-y-4 items-center">
              <h1 className="text-primary text-xl font-semibold">Alt Text</h1>
              <Input
                name="image"
                value={altText}
                onChange={(_, e) => setAltText(e)}
                placeholder="Image Alt text here."
              ></Input>

              <ButtonFill
                disabled={isDisabled}
                handleClick={() => onClick({ altText, src })}
                width="w-full"
              >
                Confirm
              </ButtonFill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InsertImageUriDialogBodyProps {
  onClick: (payload: { altText: string; src: string }, type: string) => void;
  setShowDialog: (show: boolean) => void;
  setMode: (mode: string) => void;
}

export function InsertImageUriDialogBody({
  onClick,
  setShowDialog,
  setMode,
}: InsertImageUriDialogBodyProps) {
  const [src, setSrc] = useState<string>("");
  const [altText, setAltText] = useState<string>("");
  const isDisabled = src === "";

  const closeOnOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("bg-opacity-75")) {
      setShowDialog(false);
      setMode("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto "
      onClick={closeOnOutsideClick}
    >
      <div className="flex items-center justify-center min-h-screen text-center">
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity  "
          aria-hidden="true"
        ></div>
        <div className="inline-block p-4 space-y-6 my-8 align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-sm sm:w-full">
          <div className="flex flex-col space-y-2 items-center">
            <Label>Image URL</Label>
            <Input
              name="src"
              placeholder="i.e. https://source.unsplash.com/random"
              value={src}
              onChange={(_, value) => setSrc(value)}
            ></Input>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <Label>Alt Text</Label>
            <Input
              name="altText"
              placeholder="Alt text here"
              value={altText}
              onChange={(_, e) => setAltText(e)}
            ></Input>
          </div>

          <ButtonFill
            disabled={isDisabled}
            handleClick={() => onClick({ altText, src }, "url")}
            width="w-full"
          >
            Confirm
          </ButtonFill>
        </div>
      </div>
    </div>
  );
}

interface InsertImageDialogProps {
  activeEditor: LexicalEditor; // Replace 'any' with the actual type of activeEditor
  onClose: () => void;
  disabled: boolean;
}

export function InsertImageDialog({
  disabled,
  activeEditor,
  onClose,
}: InsertImageDialogProps) {
  const [mode, setMode] = useState<string>("");
  const hasModifier = useRef<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  const onClick = async (
    payload: { altText: string; src: File | string | null },
    type: string = "file"
  ) => {
    console.log("Payload: ", payload);

    if (!payload.src) return;
    if (type === "url") {
      const newPayload = {
        altText: payload.altText ? payload.altText : "",
        src: payload.src as string,
      };

      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, newPayload);
      setModal(false);
      onClose();
      return;
    }

    // Create a FormData object and append the file and other data
    const formData = new FormData();
    formData.append("file", payload.src);
    formData.append("altText", "testing");

    const setUrl = (url: string) => {
      if (!url.startsWith("https://")) {
        const newUrl = "https://" + url;
        return newUrl;
      }
      return url;
    };
    try {
      const response = await createImage({ data: formData });
      console.log("API Response: ", response);
      if (response.data) {
        const newPayload = {
          altText: payload.altText ? payload.altText : "",
          src: setUrl(response.data.imageUrl),
        };

        console.log("newPayload: ", newPayload);
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, newPayload);
        setModal(false);
        onClose();
      }
    } catch (error) {
      console.error("API Error: ", error);
    }
  };

  const closeOnOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).classList.contains("bg-opacity-75")) {
      setShowDialog(false);
      setMode("");
    }
  };

  return (
    <>
      <button
        className="flex items-center space-x-2 disabled:cursor-not-allowed"
        onClick={() => {
          setShowDialog(true);
          setMode("");
        }}
        disabled={disabled}
      >
        <InsertImageIcon size="w-5 h-5" color="text-gray-500" />
        <span className="text-[14px] text-[#777] my-auto">Image</span>
      </button>

      {mode === "" && showDialog && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto "
          onClick={closeOnOutsideClick}
        >
          <div className="flex items-center justify-center min-h-screen text-center">
            <div
              className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity  "
              aria-hidden="true"
            ></div>
            <div className="inline-block p-4 my-8 align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-sm sm:w-full">
              <div className="w-full space-y-5 text-center">
                <SubTitle>Select Image Mode</SubTitle>
                <ButtonOutlined
                  handleClick={() => {
                    setMode("file");
                    setModal(true);
                  }}
                  width="w-full"
                >
                  File
                </ButtonOutlined>
                <ButtonFill
                  handleClick={() => {
                    setMode("url");
                    setModal(true);
                  }}
                  width="w-full"
                >
                  Url
                </ButtonFill>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "url" && modal && (
        <InsertImageUriDialogBody
          onClick={onClick}
          setMode={setMode}
          setShowDialog={setShowDialog}
        />
      )}
      {mode === "file" && modal && (
        <InsertImageUploadedDialogBody
          onClick={onClick}
          setMode={setMode}
          setShowDialog={setShowDialog}
        />
      )}
    </>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          console.log("Payloadddddddd... : ", payload);
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const img = document.createElement("img");
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData("text/plain", "_");
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: "image",
    })
  );

  return true;
}

function onDragover(event: DragEvent) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent) {
  const dragData = event.dataTransfer?.getData("application/x-lexical-drag");
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== "image") {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent) {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest("code, span.editor-image") &&
    target.parentElement &&
    target.parentElement.closest("div.ContentEditable__root")
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const target = event.target as null | Element | Document;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
      ? (target as Document).defaultView
      : (target as Element).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);

  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error("Cannot get the selection when dragging");
  }

  return range;
}
