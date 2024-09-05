// src/esdrt.ts
import React from "react";

// src/Cell.tsx
import { useState } from "react";

// src/utils.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/Cell.tsx
import { jsx } from "react/jsx-runtime";
function Cell(props) {
  console.log("render Cell", props);
  const [insertType, setInsertType] = useState();
  const onDragEnter = useDragStore((state) => state.onDragEnter);
  const onDragLeave = useDragStore((state) => state.onDragLeave);
  const setDraggingId = useDragStore((state) => state.setDraggingId);
  const targetId = useDragStore((state) => state.targetId);
  const draggingId = useDragStore((state) => state.draggingId);
  const setTargetId = useDragStore((state) => state.setTargetId);
  const onMouseMove = (e) => {
    if (!draggingId) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const fny = (x2) => w / h * x2;
    const fnx = (y2) => (w - y2) / h * w;
    if (y < fny(x)) {
      x < fnx(y) ? setInsertType("top") : setInsertType("right");
    } else {
      x < fnx(y) ? setInsertType("left") : setInsertType("bottom");
    }
  };
  const onMouseEnter = (e) => {
    if (!draggingId) {
      return;
    }
    setTargetId(props.CompId);
  };
  const onMouseLeave = (e) => {
    if (!draggingId) {
      return;
    }
    setTargetId(null);
    if (insertType) {
      setInsertType(void 0);
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-esd-id": props.CompId,
      draggable: true,
      onMouseDown: () => {
      },
      onMouseEnter,
      onMouseLeave,
      onMouseUp: () => {
      },
      onMouseMove,
      onDragStart: () => setDraggingId(props.CompId),
      onDragEnd: () => {
      },
      onDragOver: () => {
      },
      onDragLeave: () => onDragLeave(),
      onDragEnter: () => onDragEnter(props.CompId),
      onDrop: () => {
      },
      style: {
        display: "inline-block"
      },
      className: cn(insertType && `insert insert-${insertType}`, targetId == props.unquieId && "insert-dragging"),
      children: props.children
    }
  );
}
var Cell_default = Cell;

// src/esdrt.ts
import { create } from "zustand";
var esdrt = {
  // todo - 使用语法树生成
  stores: {
    // appstore: appStore
  },
  isStore: (store) => {
    return store;
  },
  isPage: (page) => page,
  // todo - implement service handler
  // todo - with cache
  isService: (service) => () => service,
  isComponent: (component, propsDef) => (props) => {
    const compId = props.compId;
    if (compId) {
      return React.createElement(Cell_default, { mode: "sandbox", CompId: props.compId }, React.createElement(component, props));
    } else {
      return React.createElement(component, props);
    }
  },
  init(x) {
    window.addEventListener("message", (e) => {
      console.log("ssss", e.data);
    });
    window.parent.postMessage({
      type: "tango.init"
    }, "*");
    window.addEventListener("click", (e) => {
    });
    window.document.body.addEventListener("dragover", (e) => {
      console.log("dragover", e.target);
      e.stopPropagation();
      e.preventDefault();
    });
    window.document.body.addEventListener("drop", (e) => {
      console.log("drop", e.dataTransfer);
    });
    window.document.body.addEventListener("dragstart", (e) => {
      console.log("dragstart", e.target);
    });
    window.document.body.addEventListener("dragend", (e) => {
      console.log("dragend", e.target);
    });
    window.document.body.addEventListener("dragleave", (e) => {
      console.log("dragleave", e.target);
    });
  }
  // init(mountElement: HTMLElement) {
  //     console.log("tango init")
  //     const root = createRoot(mountElement)
  //     root.render(React.createElement(RouterCreator,{}))
  // }
};
var useDragStore = create((set, get) => ({
  draggingId: null,
  targetId: null,
  setDraggingId: (id) => set({ draggingId: id }),
  clearDraggingId: () => set({ draggingId: null }),
  setTargetId: (id) => get().draggingId != id && set({ targetId: id }),
  clearTargetId: () => set({ targetId: null }),
  onDragEnter: (id) => set({ targetId: id }),
  onDragLeave: () => set({ targetId: null })
}));
var unsub3 = useDragStore.subscribe(
  (s, pres) => console.log("dragging  ", pres.draggingId, "--->", s.draggingId)
);
var unsub4 = useDragStore.subscribe(
  (s, pres) => console.log("target  ", pres.targetId, "--->", s.targetId)
);
export {
  esdrt,
  useDragStore
};
//# sourceMappingURL=index.mjs.map