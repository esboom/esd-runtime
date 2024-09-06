
import React, { type FunctionComponent } from "react"
import Cell from "./Cell";
// import { createRoot } from "react-dom"
type AnyClass<T = any> = new () => T;
type Dict = { [key: string]: any }

export type TPropsObject = {
    [key: string]: {
        type: "string" | "number" | "boolean" | "object" | "function" | "array",
        default: any
    }
}

export interface TService<T> {
    url: string;
    method: "get" | "post";
    params?: Dict;
    body?: Dict;
    headers?: (data: T) => any;
}

/**
 * 这个tango是有两个功能的
 * 1. 协助编辑器ast语法分析，用来做定位
 * 2. 协助编辑器列表生成，运行态的数据获取，tango会把数据挂在window上，让编辑器读取
 */
export const esdrt = {
    // todo - 使用语法树生成
    stores: {
        // appstore: appStore
    },
    isStore: <T>(store: any) => {
        return store
    },
    isPage: (page: React.ReactElement) => page,
    // todo - implement service handler
    // todo - with cache
    isService: <T = Dict>(service: TService<T>) => (() => service as unknown as T),
    isComponent: <T>(component: FunctionComponent<T>, propsDef: TPropsObject) => (props: any) => {

        // 外面通过ast定义的
        const compId = props.compId as string;
        if (compId) {
            return React.createElement(Cell, { mode: "sandbox", CompId: props.compId }, React.createElement(component, props))
        } else {
            return React.createElement(component, props)
        }

    },
    init(x: any) {



        window.addEventListener("message", (e) => {
            console.log("ssss", e.data)


            // 当用户把物料drop入iframe， 监听编辑器传递过来的drag事件
            if (e.type == "es-editor:dragenter") {

                // 1 在useDragStore设置外部拖入状态标识
                useDragStore.getState().onParentDragEnter()
            }

            // 当用户把物料drop入iframe，监听编辑器传递drop事件
            if (e.type == "es-editor:drop") {
                // 定位到鼠标位置的cell compid 和insert 反向 并 传回给编辑器

                useDragStore.getState().onParentDrop()
            }

            // 当用户把物料dragend入iframe， 监听编辑器传递过来的dragend事件
            if (e.type == "es-editor:dragend") {
                // 清除全部useDragStore状态信息
                useDragStore.getState().resetAllStates()
            }


            // 当用户把物料drag 移出iframe， 监听编辑器传递过来的dragleave事件
            if (e.type == "es-editor:dragleave") {
                // 清除全部useDragStore状态信息
                useDragStore.getState().resetAllStates()
            }


        })

        window.parent.postMessage({
            type: "esdrt.init"
        }, "*")


        window.addEventListener("click", (e) => {

            // 获取点击元素的attributes,dataset

            // console.log("f",e.target.attributes)
            // console.log("ff",e.target.dataset);

        })

        // 监听drag事件
        // window.addEventListener("drag", (e) => {
        //     console.log("drag",e.target)
        // })

        // 监听drop事件
        // window.document.body.addEventListener("dragover", (e) => {
        //     console.log("dragover", e.target)
        //     e.stopPropagation()
        //     e.preventDefault()
        // })


        // window.document.body.addEventListener("drop", (e) => {
        //     console.log("drop", e.dataTransfer)
        // })

        // window.document.body.addEventListener("dragstart", (e) => {
        //     console.log("dragstart", e.target)
        // })

        // window.document.body.addEventListener("dragend", (e) => {
        //     console.log("dragend", e.target)
        // })

        // window.document.body.addEventListener("dragleave", (e) => {
        //     console.log("dragleave", e.target)
        // })








    }
    // init(mountElement: HTMLElement) {
    //     console.log("tango init")
    //     const root = createRoot(mountElement)
    //     root.render(React.createElement(RouterCreator,{}))
    // }
}


import { create } from 'zustand'

export type TDirection = "top" | "bottom" | "left" | "right" | "center" | null;

export const useDragStore = create<{
    _isNewComp: boolean,
    _direction: TDirection,

    draggingId: string | null,
    targetId: string | null,

    onDragStart: (id: string) => boolean,
    onDragEnter: (id: string | null) => void,
    onDragLeave: () => void,
    onDragEnd: () => void,
    onDrop: () => void,
    updateDirection: (d: TDirection) => void,

    onParentDragEnter: () => void,
    onParentDrop: () => void,
    resetAllStates: () => void,
    onMouseEnter: (id: string) => void,
    onMouseLeave: (id: string) => void,
}>((set, get) => ({
    _direction: null,
    _isNewComp: false,
    draggingId: null,
    targetId: null,

    onDragStart: (id) => {
        if (!get().draggingId) {
            set({
                draggingId: id
            })
            return true
        }

        return false

    },
    onDragEnter: (id) => set({ targetId: id }),
    onDragLeave: () => set({ targetId: null }),
    onDragEnd: () => {
        get().resetAllStates();
    },
    onDrop: () => {
        const { draggingId, targetId, _direction } = get()
        if (draggingId && targetId) {
            // todo - 发送通知给编辑器
            console.log("drop!", draggingId, "-->", targetId, ":", _direction);
        }
    },
    onMouseEnter: (id: string) => {
        if (!get()._isNewComp) { return }

        set({ targetId: id })
    },
    onMouseLeave: (id: string) => {
        const { _isNewComp, resetAllStates } = get();
        if (!_isNewComp) { return }
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
            return
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
        })
    },
    updateDirection: (d: TDirection) => {
        const { targetId } = get();
        if (targetId) {
            set({ _direction: d })
        }
    }
}))


//subscribe 监听DragStore的draggingId和targetId变化,打印到控制台



const unsub3 = useDragStore.subscribe(
    (s, pres) => console.log("dragging  ", pres.draggingId, "--->", s.draggingId),
)

const unsub4 = useDragStore.subscribe(
    (s, pres) => console.log("target  ", pres.targetId, "--->", s.targetId),
)
