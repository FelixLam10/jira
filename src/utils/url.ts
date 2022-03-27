import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom"
import { cleanObject } from './index';

/**
 * 返回页面url中，指定键的参数值,对象：?name=骑手&personId=18
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
    const [searchParams] = useSearchParams()
    const setSearchParams = useSetUrlSearchParam()
    // console.log(searchParams.get('name'));
    return [
        useMemo(
            () => keys.reduce((prev, key) => {
                return { ...prev, [key]: searchParams.get(key) || '' }
            }, {} as { [key in K]: string }),
            //eslint-disable-next-line react-hooks/exhaustive-deps
            [searchParams]
        ),
        (params: Partial<{ [key in K]: unknown }>) => {
            return setSearchParams(params)
            //iterator
            //iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index/.js
        }
    ] as const
}  

export const useSetUrlSearchParam = () => {
    const [ searchParams, setSearchParams ] = useSearchParams()

    return (params: {[key in string]: unknown}) => {
            const o = cleanObject({
                ...Object.fromEntries(searchParams),
                ...params
            }) as URLSearchParamsInit
            return setSearchParams(o)
    }
}