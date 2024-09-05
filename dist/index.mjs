// src/esdrt.ts
import React2 from "react";

// src/Cell.tsx
import { useState } from "react";

// src/utils.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/Cell.tsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Cell(props) {
  console.log("render Cell", props);
  const [insertType, setInsertType] = useState();
  const onDragEnter = useDragStore((state) => state.onDragEnter);
  const onDragLeave = useDragStore((state) => state.onDragLeave);
  const onDragEnd = useDragStore((state) => state.onDragEnd);
  const onDrop = useDragStore((state) => state.onDrop);
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
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("dragover");
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
      onDragStart: () => !draggingId && draggingId != props.CompId && setDraggingId(props.CompId),
      onDragEnd,
      onDragOver,
      onDragLeave: () => onDragLeave(),
      onDragEnter: () => onDragEnter(props.CompId),
      onDrop,
      style: {
        display: "inline-block"
      },
      className: cn(insertType && `insert insert-${insertType}`, targetId == props.CompId && "insert-dragging"),
      children: props.children
    }
  );
}
var Cell_default = React.memo(Cell);

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
      return React2.createElement(Cell_default, { mode: "sandbox", CompId: props.compId }, React2.createElement(component, props));
    } else {
      return React2.createElement(component, props);
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
  onDragLeave: () => set({ targetId: null }),
  onDragEnd: () => {
    console.log("dragend");
    if (get().draggingId && get().targetId) {
    } else {
      set({ draggingId: null, targetId: null });
    }
  },
  onDrop: () => {
    console.log("drop");
  }
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