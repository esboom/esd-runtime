
import React, { FunctionComponent } from "react"
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
        if(compId){
            return React.createElement(Cell, { mode: "sandbox", unquieId:props.compId }, React.createElement(component, props))
        }else{
            return React.createElement(component, props)
        }

    },
    init(x: any) {



        window.addEventListener("message", (e) => {
            console.log("ssss", e.data)
        })

        window.parent.postMessage({
            type: "tango.init"
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
        window.document.body.addEventListener("dragover", (e) => {
            console.log("dragover", e.target)
            e.stopPropagation()
            e.preventDefault()
        })


        window.document.body.addEventListener("drop", (e) => {
            console.log("drop", e.dataTransfer)
        })

        window.document.body.addEventListener("dragstart", (e) => {
            console.log("dragstart", e.target)
        })

        window.document.body.addEventListener("dragend", (e) => {
            console.log("dragend", e.target)
        })

        window.document.body.addEventListener("dragleave", (e) => {
            console.log("dragleave", e.target)
        })




        // // 监听鼠标按下事件
        // window.addEventListener("mousedown", (e) => {
        //     console.log("mousedown")

        //     // 获取点击元素的attributes
        //     console.log("fmousedown",e.target)
        // })

        // // 监听鼠标抬起事件
        // window.addEventListener("mouseup", (e) => {
        //     console.log("mouseup",e.target)

        //     // 获取点击元素的attributes
        //     console.log("fmouseup",e.target)
        // })

        // // 监听鼠标移动事件
        // window.addEventListener("mousemove", (e) => {
        //     console.log("mousemove",e.target)
        // })



    }
    // init(mountElement: HTMLElement) {
    //     console.log("tango init")
    //     const root = createRoot(mountElement)
    //     root.render(React.createElement(RouterCreator,{}))
    // }
}


import { create } from 'zustand'

export const useDragStore = create<{
    draggingId: string | null,
    targetId: string | null,
    setDraggingId: (id: string | null) => void,
    clearDraggingId: () => void,
    setTargetId: (id: string | null) => void,
    clearTargetId: () => void,
    onDragEnter: (id: string | null) => void,
    onDragLeave: () => void
}>((set,get) => ({
    draggingId: null,
    targetId: null,
    setDraggingId: (id) => set({ draggingId: id }),
    clearDraggingId: () => set({ draggingId: null }),
    setTargetId: (id) => get().draggingId != id &&  set({ targetId: id }),
    clearTargetId: () => set({ targetId: null }),

    onDragEnter: (id) => set({ targetId: id }),
    onDragLeave: () => set({ targetId: null }),
}))