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
import { jsx, jsxs } from "react/jsx-runtime";
function Cell(props) {
  const [insertType, setInsertType] = useState();
  const dragStart = useDragStore((state) => state.onDragStart);
  const dragEnter = useDragStore((state) => state.onDragEnter);
  const dragLeave = useDragStore((state) => state.onDragLeave);
  const onDragEnd = useDragStore((state) => state.onDragEnd);
  const onDrop = useDragStore((state) => state.onDrop);
  const targetId = useDragStore((state) => state.targetId);
  const draggingId = useDragStore((state) => state.draggingId);
  const isDragSelf = useDragStore((state) => state.draggingId === props.CompId);
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggingId || isDragSelf) {
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
  const onDragEnter = (e) => {
    if (!draggingId || isDragSelf) {
      return;
    }
    dragEnter(props.CompId);
  };
  const onDragLeave = (e) => {
    if (!draggingId || isDragSelf) {
      return;
    }
    dragLeave();
    if (insertType) {
      setInsertType(void 0);
    }
  };
  const onDragStart = () => {
    const canDrag = dragStart(props.CompId);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-esd-id": props.CompId,
      draggable: true,
      onMouseDown: () => {
      },
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragLeave,
      onDragEnter,
      onDrop,
      className: cn("cell", isDragSelf && "dragging-self"),
      children: [
        props.children,
        /* @__PURE__ */ jsx("div", { className: cn(insertType && `${insertType}-inside`) })
      ]
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
  // setDraggingId: (id) => set({ draggingId: id }),
  // clearDraggingId: () => set({ draggingId: null }),
  // setTargetId: (id) => get().draggingId != id &&  set({ targetId: id }),
  // clearTargetId: () => set({ targetId: null }),
  onDragStart: (id) => {
    if (!get().draggingId) {
      set({
        draggingId: id
      });
      return true;
    }
    return false;
  },
  onDragEnter: (id) => set({ targetId: id }),
  onDragLeave: () => set({ targetId: null }),
  onDragEnd: () => {
    console.log("dragend");
    set({ draggingId: null, targetId: null });
  },
  onDrop: () => {
    if (get().draggingId && get().targetId) {
      console.log("drop!", get().draggingId, "-->", get().targetId);
    }
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