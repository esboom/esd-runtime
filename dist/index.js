var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  esdrt: () => esdrt,
  useDragStore: () => useDragStore
});
module.exports = __toCommonJS(src_exports);

// src/esdrt.ts
var import_react3 = __toESM(require("react"));

// src/Cell.tsx
var import_react = require("react");

// src/utils.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/Cell.tsx
var import_react2 = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
function Cell(props) {
  console.log("render Cell", props);
  const [insertType, setInsertType] = (0, import_react.useState)();
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      onDragEnd: () => {
      },
      onDragOver: () => {
      },
      onDrop: () => {
      },
      style: {
        display: "inline-block"
      },
      className: cn(insertType && `insert insert-${insertType}`, targetId == props.CompId && "insert-dragging"),
      children: props.children
    }
  );
}
var Cell_default = import_react2.default.memo(Cell);

// src/esdrt.ts
var import_zustand = require("zustand");
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
      return import_react3.default.createElement(Cell_default, { mode: "sandbox", CompId: props.compId }, import_react3.default.createElement(component, props));
    } else {
      return import_react3.default.createElement(component, props);
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
var useDragStore = (0, import_zustand.create)((set, get) => ({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esdrt,
  useDragStore
});
//# sourceMappingURL=index.js.map