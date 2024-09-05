import { PropsWithChildren, useState } from "react";

import "./cell.css"
import { useDragStore } from "./esdrt";
import { cn } from "./utils";

function Cell(props: PropsWithChildren<{
    mode: "sandpack" | "sandbox",
    unquieId: string
}>) {

    console.log("render Cell", props);


    const [insertType, setInsertType] = useState<"top" | "bottom" | "left" | "right" | "center" | undefined>();

    const onDragEnter = useDragStore((state) => state.onDragEnter)
    const onDragLeave = useDragStore((state) => state.onDragLeave)
    const setDraggingId = useDragStore((state) => state.setDraggingId)
    const targetId = useDragStore((state) => state.targetId);
    const draggingId = useDragStore((state) => state.draggingId);



    const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

    const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    }


    return <div
        draggable
        onMouseDown={() => { }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => { }}
        onMouseUp={() => { }}
        onMouseMove={onMouseMove}
        onDragStart={() => setDraggingId(props.unquieId)}
        onDragEnd={() => {}}
        onDragOver={() => { }}
        onDragLeave={() => onDragLeave()}
        onDragEnter={() => onDragEnter(props.unquieId)}
        onDrop={() => { }}

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

        className={cn(insertType && `insert insert-${insertType}` , targetId == props.unquieId && "insert-dragging")}



    >
        {props.children}
    </div>;
}


export default Cell