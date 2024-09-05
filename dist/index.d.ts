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
    isComponent: <T_2>(component: React.FunctionComponent<T_2>, propsDef: TPropsObject) => (props: any) => React.FunctionComponentElement<T_2> | React.FunctionComponentElement<React.PropsWithChildren<{
        mode: "sandpack" | "sandbox";
        unquieId: string;
    }>>;
    init(x: any): void;
};
declare const useDragStore: zustand.UseBoundStore<zustand.StoreApi<{
    draggingId: string | null;
    targetId: string | null;
    setDraggingId: (id: string | null) => void;
    clearDraggingId: () => void;
    setTargetId: (id: string | null) => void;
    clearTargetId: () => void;
    onDragEnter: (id: string | null) => void;
    onDragLeave: () => void;
}>>;

export { type TPropsObject, type TService, esdrt, useDragStore };
