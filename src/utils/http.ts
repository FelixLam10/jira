import qs from "qs"
import { useCallback } from "react"
import * as auth from '../auth-provider'
import { useAuth } from "../context/auth-context"

const apiUrl = process.env.REACT_APP_API_URL

interface Config extends RequestInit {
    token?: string,
    data?: object,
}
export const http = async (endpoint: string, {data, token, headers, ...customConfig}: Config = {}) => {
    const config = {
        method: 'GET',
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': data ? 'application/json' : ''
        },
        ...customConfig
    }

    if (config.method.toUpperCase() === 'GET') {
        endpoint += `?${qs.stringify(data)}`
    } else {
        config.body = JSON.stringify(data || {})
    }

    return window.fetch(`${apiUrl}/${endpoint}`, config)
        .then(async response => {
            if (response.status === 401) {
                await auth.logout()
                window.location.reload()
                return Promise.reject({message: '请重新登陆'})
            }
            const data = await response.json()
            if (response.ok) {
                return data
            } else {
                return Promise.reject(data)
            }
    })
}

//需要手动的将Jwt token传入到headers中。以http方法为基础，
//另一个可以自动携带jwt token的方法
export const useHttp = () => {
    const { user } = useAuth()
    /*return ([endpoint, config]:[string, Config]) => http(endpoint, {...config, token: user?.token})
    *优化写法：因该约束条件与http中的约束条件相同，可以用TS 操作符
    *utility type写法：用泛型给它传入一个其他类型，然后utility type对这个类型进行某种操作
    */
    return useCallback(
        (...[endpoint, config]: Parameters<typeof http>) =>
        http(endpoint, { ...config, token: user?.token }),[user?.token])
}