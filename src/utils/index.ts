import { useEffect, useRef, useState } from "react";
//目的是在不改变原来对象的情况下,把对象中值为空的键删掉(没输入名字的情况同样让jsonserver显示名单)
//在一个函数里，改变传入的对象本身是不好的；js中的对象是引用对象，
//调用你函数的人若不仔细阅读函数里的代码容易造成污染引起bug

//一个！号取反，两个表示把值转换成布尔值
export const isFalsy = (value: unknown) => value === 0 ? false : !value

//考虑到value的值是false的字面量，针对{check: false}也会被误删的情况做优化
export const isVoid = (value: unknown) => value === undefined || value === null || value === ''

export const cleanObject = (object: { [key: string]: unknown}) => {
    //等同于Object.assign({},object);
    const result = { ...object };
    Object.keys(result).forEach(key => {
        const value = result[key]
        //考虑到value为0特殊情况，它是有效数字不希望被delete
        // if (!value) {
        if (isVoid(value)) {
            delete result[key]
        }
    })
    return result
}

//抽象users，它仅在组件加载时执行一次useEffect，用customHook封装成useMount
//void表示传入的函数callback不返回任何值
export const useMount = (callback: ()=> void) => {
    useEffect(() => {
        callback();
        // TODO 依赖项里加上callback会造成无限循环，这个和useCallback以及useMemo有关系
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

//delay表示传入时间，可传可不传。冒号前问号表示要么传number要么不传
export const useDebounce = <V>(value: V, delay?: number) => {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        //每次在value变化之后，设置一个定时器
        const timeout = setTimeout(() => setDebounceValue(value), delay)
        //每次在上一个useEffect处理完之后再运行
        return () => clearTimeout(timeout)
    }, [value, delay])
    
    return debounceValue
}

// 此hook为了改变文档的标题
export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
    // const oldTitle = document.title
    const oldTitle = useRef(document.title).current;
    // 页面加载时： oldTitle = document.title(闭包); 旧title(useRef)
    // 加载后： oldTitle === 新title; 新title(useRef)

    useEffect(() => {
        document.title = title
    }, [title])
    
    useEffect(() => {
        return () => {
            if (!keepOnUnmount) {
                // 如果不指定依赖，读到的就是旧title
                document.title = oldTitle
            }
        }
    },[keepOnUnmount, oldTitle])
}

export const resetRoute = () => window.location.href = window.location.origin

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
    const mountedRef = useRef(false)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    })
    return mountedRef
}