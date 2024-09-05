import { PropsWithChildren, useRef, useState } from "react";

import "./cell.css"
import { useDragStore } from "./esdrt";
import { cn } from "./utils";
import React from "react";

function getUUId() {
    return Math.random().toString(36).slice(2);
}


function Cell(props: PropsWithChildren<{
    mode: "sandpack" | "sandbox",
    CompId: string
}>) {

    console.log("render Cell", props);

    // 生成唯一的随机id
    // 不可以在运行态分配id，因为这样会导致编辑器无法定位语法树
    // const cId = useRef<string>(getUUId())


    const [insertType, setInsertType] = useState<"top" | "bottom" | "left" | "right" | "center" | undefined>();

    const dragEnter = useDragStore((state) => state.onDragEnter)
    const dragLeave = useDragStore((state) => state.onDragLeave)
    const onDragEnd = useDragStore((state) => state.onDragEnd)
    const onDrop = useDragStore((state) => state.onDrop)
    const setDraggingId = useDragStore((state) => state.setDraggingId)
    const targetId = useDragStore((state) => state.targetId);
    const draggingId = useDragStore((state) => state.draggingId);
    const setTargetId = useDragStore((state) => state.setTargetId);



    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggingId) {
            return
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        // 把区域划分为四个方向，按照斜对角方向划分

        // 斜对角线
        const fny = (x) => (w / h) * x;
        const fnx = (y) => ((w - y) / h) * w;

        if (y < fny(x)) {
            x < fnx(y) ? setInsertType("top") : setInsertType("right");
        } else {
            x < fnx(y) ? setInsertType("left") : setInsertType("bottom");
        }
    }

    const onDragEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        if (!draggingId) {
            return
        }

        // setTargetId(props.CompId)

        dragEnter(props.CompId)
    }

    const onDragLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {


        if (!draggingId) {
            return
        }

        // setTargetId(null)
        dragLeave()


        // 复位自身
        if (insertType) {
            setInsertType(undefined)
        }
    }

    // const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     console.log("dragover")
    // }

    // const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {




    // }


    return <div
        data-esd-id={props.CompId}
        draggable
        onMouseDown={() => { }}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        // onMouseUp={() => { }}
        // onMouseMove={onMouseMove}
        onDragStart={() => !draggingId && draggingId != props.CompId && setDraggingId(props.CompId)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}

        onDrop={onDrop}

        // onClickCapture={(e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        // }}
        // onClick={(e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        // }}

        style={{
            display: "inline-block",

        }}

        className={cn(insertType && `insert insert-${insertType}`, targetId == props.CompId && "insert-dragging")}



    >
        {props.children}
    </div>;
}


export default React.memo(Cell)