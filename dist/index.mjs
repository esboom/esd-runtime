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
  const [insertType, setInsertType] = useState(null);
  const dragStart = useDragStore((state) => state.onDragStart);
  const dragEnter = useDragStore((state) => state.onDragEnter);
  const dragLeave = useDragStore((state) => state.onDragLeave);
  const mouseEnter = useDragStore((state) => state.onMouseEnter);
  const mouseLeave = useDragStore((state) => state.onMouseLeave);
  const dragEnd = useDragStore((state) => state.onDragEnd);
  const onDrop = useDragStore((state) => state.onDrop);
  const draggingId = useDragStore((state) => state.draggingId);
  const isNewComp = useDragStore((state) => state._isNewComp == true);
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
    let direct = null;
    const fny = (x2) => w / h * x2;
    const fnx = (y2) => (w - y2) / h * w;
    if (y < fny(x)) {
      x < fnx(y) ? direct = "top" : direct = "right";
    } else {
      x < fnx(y) ? direct = "right" : direct = "bottom";
    }
    setInsertType(direct);
    useDragStore.getState().updateDirection(direct);
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
      setInsertType(null);
    }
  };
  const onDragEnd = (e) => {
    if (insertType) {
      setInsertType(null);
    }
    dragEnd();
  };
  const onDragStart = () => {
    if (isNewComp) {
      return;
    }
    dragStart(props.CompId);
  };
  const onMouseEnter = () => {
    if (!isNewComp) {
      return;
    }
    mouseEnter(props.CompId);
  };
  const onMouseLeave = () => {
    if (!isNewComp) {
      return;
    }
    if (insertType) {
      setInsertType(null);
    }
    mouseLeave(props.CompId);
  };
  const onMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isNewComp) {
      return;
    }
    if (isDragSelf) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    let direct = null;
    const fny = (x2) => w / h * x2;
    const fnx = (y2) => (w - y2) / h * w;
    if (y < fny(x)) {
      x < fnx(y) ? direct = "top" : direct = "right";
    } else {
      x < fnx(y) ? direct = "right" : direct = "bottom";
    }
    setInsertType(direct);
    useDragStore.getState().updateDirection(direct);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-esd-id": props.CompId,
      draggable: true,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
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
      if (e.type == "es-editor:dragenter") {
        useDragStore.getState().onParentDragEnter();
      }
      if (e.type == "es-editor:drop") {
        useDragStore.getState().onParentDrop();
      }
      if (e.type == "es-editor:dragend") {
        useDragStore.getState().resetAllStates();
      }
      if (e.type == "es-editor:dragleave") {
        useDragStore.getState().resetAllStates();
      }
    });
    window.parent.postMessage({
      type: "esdrt.init"
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
  _direction: null,
  _isNewComp: false,
  draggingId: null,
  targetId: null,
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
    get().resetAllStates();
  },
  onDrop: () => {
    const { draggingId, targetId, _direction } = get();
    if (draggingId && targetId) {
      console.log("drop!", draggingId, "-->", targetId, ":", _direction);
    }
  },
  onMouseEnter: (id) => {
    if (!get()._isNewComp) {
      return;
    }
    set({ targetId: id });
  },
  onMouseLeave: (id) => {
    const { _isNewComp, resetAllStates } = get();
    if (!_isNewComp) {
      return;
    }
    resetAllStates();
  },
  onParentDragEnter: () => {
    get().resetAllStates();
    set({ _isNewComp: true });
  },
  onParentDrop: () => {
    const { targetId, _isNewComp, _direction, resetAllStates } = get();
    if (!_isNewComp) {
      resetAllStates();
      return;
    }
    if (targetId) {
      console.log("drop!", "new material", "-->", targetId, ":", _direction);
    }
    resetAllStates();
  },
  resetAllStates: () => {
    set({
      targetId: null,
      draggingId: null,
      _isNewComp: false,
      _direction: null
    });
  },
  updateDirection: (d) => {
    const { targetId } = get();
    if (targetId) {
      set({ _direction: d });
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