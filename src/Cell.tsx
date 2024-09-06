import { PropsWithChildren, useEffect, useRef, useState } from "react";

import "./cell.css"
import { TDirection, useDragStore } from "./esdrt";
import { cn } from "./utils";
import React from "react";


function Cell(props: PropsWithChildren<{
    mode: "sandpack" | "sandbox",
    CompId: string
}>) {



    // 生成唯一的随机id
    // 不可以在运行态分配id，因为这样会导致编辑器无法定位语法树
    // const cId = useRef<string>(getUUId())


    const [insertType, setInsertType] = useState<TDirection>(null);

    const dragStart = useDragStore((state) => state.onDragStart)
    const dragEnter = useDragStore((state) => state.onDragEnter)
    const dragLeave = useDragStore((state) => state.onDragLeave)
    const mouseEnter = useDragStore((state) => state.onMouseEnter)
    const mouseLeave = useDragStore((state) => state.onMouseLeave)
    const dragEnd = useDragStore((state) => state.onDragEnd)
    const onDrop = useDragStore((state) => state.onDrop)
    // const setDraggingId = useDragStore((state) => state.setDraggingId)
    // const targetId = useDragStore((state) => state.targetId);
    const draggingId = useDragStore((state) => state.draggingId);
    // const setTargetId = useDragStore((state) => state.setTargetId);
    // const updateDirection = useDragStore((state) => state.updateDirection)


    const isNewComp = useDragStore((state) => state._isNewComp == true);

    const isDragSelf = useDragStore((state) => state.draggingId === props.CompId)





    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggingId || isDragSelf) {
            return
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        // 把区域划分为四个方向，按照斜对角方向划分
        let direct: TDirection = null
        // 斜对角线
        const fny = (x) => (w / h) * x;
        const fnx = (y) => ((w - y) / h) * w;

        if (y < fny(x)) {
            x < fnx(y) ? (direct = "top") : (direct = "right");
        } else {
            x < fnx(y) ? (direct = "right") : (direct = "bottom");
        }

        setInsertType(direct);
        useDragStore.getState().updateDirection(direct);

    }

    const onDragEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        if (!draggingId || isDragSelf) {
            return
        }

        // setTargetId(props.CompId)

        dragEnter(props.CompId)
    }

    const onDragLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!draggingId || isDragSelf) {
            return
        }

        dragLeave()

        // 复位自身
        if (insertType) {
            setInsertType(null)
        }
    }

    const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        // 复位自身
        if (insertType) {
            setInsertType(null)
        }

        dragEnd()
    }

    const onDragStart = () => {
        if(!isNewComp) { return}
        dragStart(props.CompId);
    }


    const onMouseEnter = ()=>{
        if(!isNewComp) { return}
        mouseEnter(props.CompId)
    }

    const onMouseLeave = ()=>{
        if(!isNewComp) { return}
        if (insertType) {
            setInsertType(null)
        }
        mouseLeave(props.CompId)
    }

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        e.preventDefault();
        e.stopPropagation();

        if(!isNewComp) { return}

        if (isDragSelf) {
            return
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        // 把区域划分为四个方向，按照斜对角方向划分
        let direct: TDirection = null
        // 斜对角线
        const fny = (x) => (w / h) * x;
        const fnx = (y) => ((w - y) / h) * w;

        if (y < fny(x)) {
            x < fnx(y) ? (direct = "top") : (direct = "right");
        } else {
            x < fnx(y) ? (direct = "right") : (direct = "bottom");
        }

        setInsertType(direct);
        useDragStore.getState().updateDirection(direct);
    }


    return <div
        data-esd-id={props.CompId}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        className={cn("cell", isDragSelf && "dragging-self")}
    >
        {props.children}

        <div className={cn(insertType && `${insertType}-inside`)} />

    </div>;
}


export default React.memo(Cell)