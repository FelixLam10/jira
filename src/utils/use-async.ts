import { useCallback, useState, useReducer } from 'react';
import { useMountedRef } from './index';

interface State<D> {
    error: Error | null;
    data: D | null;
    /** 表示status：idle表示异步操作还未发生，
     * loding表示正在发生，error表示发生结束出现错误，成功success
     */
    stat: 'idle' | 'loading' | 'error' | 'success'
}

//刚开始默认的state
const defaultInitialState: State<null> = {
    stat: 'idle',
    data: null,
    error: null
}

const defaultConfig = {
    throwOnError: false
}

//将moutedRef.current进行抽象
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
    const mountedRef = useMountedRef()
    return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),[dispatch, mountedRef])
}

// TODO 用reducer改造
//useAsync抽象项目中的异步操作。initialState是用户传入的初始状态，优先级比默认state高
export const useAsync = <D>(
    initialState?: State<D>, 
    initialConfig?: typeof defaultConfig
) => {
    const config = {...defaultConfig, initialConfig}
    const [state, dispatch] = useReducer((state: State<D>,
        action: Partial<State<D>>) => ({ ...state, ...action }), {
        ...defaultInitialState,
        ...initialState,
    })

    const safeDispatch = useSafeDispatch(dispatch);
    // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数
    // https://codesandbox.io/s/blissful-water-230u4?file=/src/App.js
    const [retry, setRetry] = useState(() => () => {
    })

    //当调用setData，说明请求已经成功，data返回了
    const setData = useCallback((data: D) => safeDispatch({
        data,
        stat: 'success',
        error: null
    }),[safeDispatch])

    const setError = useCallback((error: Error) => safeDispatch({
        error,
        stat: 'error',
        data: null
    }),[safeDispatch])

    //run 用来触发异步请求
    const run = useCallback((
        promise: Promise<D>,
        runConfig?: { retry: () => Promise<D> }
    ) => {
        //什么也不传或者传入的不是promise
        if (!promise || !promise.then) {
            throw new Error('请传入 Promise 类型数据')
        }
        setRetry(() => () => { 
            if (runConfig?.retry) {
                run(runConfig?.retry(), runConfig)
            }
        })
        //异步请求刚开始触发,设置stat为loading
        // dispatch(prevState => ({ ...prevState, stat: 'loading' }))
        //dispatch会自动在上面reducer中把以前的状态和现在的action 合并
        safeDispatch({stat: 'loading'})
        return promise.then(data => {
            //上面setData已经是safeDispatch，因此处不需要再判断
            // if (mountedRef.current)
            setData(data)
            return data;
        }).catch(error => {
        //catch会消化异常，如果不主动抛出，外面是接收不到异常的
        // return error
            setError(error)
            if(config.throwOnError) return Promise.reject(error)
        })
    }, [config.throwOnError, setData, setError, safeDispatch])

    return {
        isIdle: state.stat === 'idle',
        isLoading: state.stat === 'loading',
        isError: state.stat === 'error',
        isSuccess: state.stat === 'success',
        run,
        setData,
        setError,
        // retry 被调用时重新跑一遍run让state刷新一遍
        retry:() => {
        
        },
        ...state
    }
}