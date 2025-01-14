import * as zustand from 'zustand';
import React from 'react';

type Dict = {
    [key: string]: any;
};
type TPropsObject = {
    [key: string]: {
        type: "string" | "number" | "boolean" | "object" | "function" | "array";
        default: any;
    };
};
interface TService<T> {
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
declare const esdrt: {
    stores: {};
    isStore: <T>(store: any) => any;
    isPage: (page: React.ReactElement) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    isService: <T_1 = Dict>(service: TService<T_1>) => () => T_1;
    isComponent: <T_2>(component: React.FunctionComponent<T_2>, propsDef: TPropsObject) => (props: any) => React.FunctionComponentElement<T_2> | React.FunctionComponentElement<{
        mode: "sandpack" | "sandbox";
        CompId: string;
    } & {
        children?: React.ReactNode;
    }>;
    init(x: any): void;
};
type TDirection = "top" | "bottom" | "left" | "right" | "center" | null;
declare const useDragStore: zustand.UseBoundStore<zustand.StoreApi<{
    _isNewComp: boolean;
    _direction: TDirection;
    draggingId: string | null;
    targetId: string | null;
    onDragStart: (id: string) => boolean;
    onDragEnter: (id: string | null) => void;
    onDragLeave: () => void;
    onDragEnd: () => void;
    onDrop: () => void;
    updateDirection: (d: TDirection) => void;
    onParentDragEnter: () => void;
    onParentDrop: () => void;
    resetAllStates: () => void;
    onMouseEnter: (id: string) => void;
    onMouseLeave: (id: string) => void;
}>>;

export { type TDirection, type TPropsObject, type TService, esdrt, useDragStore };
