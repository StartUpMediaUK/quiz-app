
import EditorContact from "./editor-contact";
import EditorContainer from "./editor-container";
import EditorImage from "./editor-image";
import EditorLink from "./editor-link";
import EditorText from "./EditorText";
import EditorVideo from "./EditorVideo";

import { CanvasDB } from "@/db/canvas-db";
import type { EditorElement } from "@/lib/types/editor";
import EditorSection from "./editor-section";

type Props = {
  db: CanvasDB;
  element: EditorElement;
};

const EditorRecursive = ({ element, db }: Props) => {
  switch (element.type) {
    case "text":
      return <EditorText element={element} />;
    case "image":
      return <EditorImage element={element} />;
    case "container":
      return <EditorContainer element={element} db={db} />;
    case "__body":
      return <EditorContainer element={element} db={db} />;
    case "2Col":
      return <EditorContainer element={element} db={db} />;
    case "3Col":
      return <EditorContainer element={element} db={db} />;
    case "section":
      return <EditorSection element={element} db={db} />;
    case "video":
      return <EditorVideo element={element} />;
    case "link":
      return <EditorLink element={element} />;
    case "contactForm":
      return <EditorContact element={element} db={db} />;
    default:
      return null;
  }
};

export default EditorRecursive;
