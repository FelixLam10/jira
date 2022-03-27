//在真实企业开发环境中，如果使用firebase、auth0这种第三方auth服务的话，本文件不需要开发者开发
//在本文件中需定义一些函数，这些函数可以帮助操控JWT的token

import { User } from "./types/user"
const localStorageKey = '__auth_provider_token__'
const apiUrl = process.env.REACT_APP_API_URL

export const getToken = () => window.localStorage.getItem(localStorageKey)

export const handlerUserResponse = ({ user }: { user: User }) => {
    window.localStorage.setItem(localStorageKey, user.token || '')
    return user
}

export const login = (data: { username: string, password: string }) => {
    return fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(
        async (response: Response) => {
            if (response.ok) {
                // let data = await response.json()
                // console.log(data)
                return handlerUserResponse(await response.json())
            } else {
                return Promise.reject(await response.json())
            }
        });
}

export const register = (data: { username: string, password: string }) => {
    return fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(
            async (response: Response) => {
                if (response.ok) {
                    // let data = await response.json()
                    // console.log(data)
                    return handlerUserResponse(await response.json())
                } else {
                    return Promise.reject(await response.json())
                }
            }
        )
}

export const logout = async () => window.localStorage.removeItem(localStorageKey)