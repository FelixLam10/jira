import { useCallback, useReducer, useState } from "react"

const UNDO = 'UNDO'
const REDO = 'REDO'
const SET = 'SET'
const RESET = 'RESET'

type State<T> = {
    past: T[],
    present: T,
    future: T[]
}

type Action<T> = {newPresent?: T, type: typeof UNDO | typeof REDO | typeof SET | typeof RESET}

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
    const { past, present, future } = state
    const { type, newPresent } = action

    switch (action.type) {
        case 'UNDO': {
            if (past.length === 0) return state
        
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [present, ...future]
            }
        }
        
        case 'REDO': {
            if (future.length === 0) return state
        
            const next = future[0]
            /**slice(1)表示:
             * ['present', f1, f2, f3]
             * 当前值是present，按下redo到f1，所以当前的future从f1变为f2
             */
            const newFuture = future.slice(1)

            return {
                past: [...past, present],
                present: next,
                future: newFuture
            }
        }
            
        case 'SET': {
            if (newPresent === present) {
                return state
            }
            
            return {
                past: [...past, present],
                present: newPresent,
                //set新值进来，就不存在redo的概念
                future: []
            }
        }
            
        case 'RESET': {
            return {
                past: [],
                //把现在的值设为传进来的newPresent，过去未来一笔勾销
                present: newPresent,
                future: []
            }
        }
    }
}

export const useUndo = <T>(initialPresent: T) => {

    const [state, dispatch] = useReducer(undoReducer, {
        //past: [] as T[]这样写也可以
        past: [],
        present: initialPresent,
        future: []
    } as State<T>)

    // const [state, setState] = useState<{
    //     past: T[],
    //     present: T,
    //     future: T[]
    // }>({
    //     //past: [] as T[]这样写也可以
    //     past: [],
    //     present: initialPresent,
    //     future: []
    // })

    const canUndo = state.past.length !== 0;
    const canRedo = state.future.length !== 0;

    const undo = useCallback(() => dispatch({type: UNDO}), []);

    const redo = useCallback(() => dispatch({ type: REDO }),[])

    const set = useCallback((newPresent: T) => dispatch({ type: SET, newPresent}),[])

    const reset = useCallback((newPresent: T) => dispatch({type: RESET, newPresent}),[])
    
    return [
        state,
        { set, reset, undo, redo, canUndo, canRedo }
    ]
}
