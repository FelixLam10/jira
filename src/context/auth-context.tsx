import React, { ReactNode, useCallback, useState } from 'react';
import * as auth from '../auth-provider';
import { User } from "../types/user";
import { register } from '../auth-provider';
import { useMount } from '../utils/index';
import { http } from '../utils/http';
import { useUsers } from '../utils/user';
import { useAsync } from '../utils/use-async';
import { FullPageLoading, FullPageErrorFallback } from '../components/lib';
import * as authStore from '../store/auth.slice'
import { useDispatch, useSelector } from 'react-redux';
import { bootstrap, selectUser } from '../store/auth.slice';
import { useQueryClient, QueryClient } from 'react-query';

export interface AuthForm {
    username: string,
    password: string
}

//在页面刷新的时候初始化一下user
export const bootstrapUser = async () => {
    let user = null;
    const token = auth.getToken()
    console.log(token);
    if (token) {
        const data = await http('me', {token})
        user = data.user
        console.log(data);
    }
    return user;
}

//context写法
// const AuthContext = React.createContext<{
//     user: User | null,
//     register: (form: AuthForm) => Promise<void>,
//     login: (form: AuthForm) => Promise <void>,
//     logout: () => Promise<void>
// } | undefined> (undefined)
// AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        // data: user,
        error, isLoading,
        isIdle,
        isError,
        run,
        // setData: setUser
    } = useAsync<User | null>()

    const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()
    //context写法
    // point free消参，user=>setUser(user) -> setUser
    // const login = (form: AuthForm) => auth.login(form).then(setUser)
    // const register = (form: AuthForm) => auth.register(form).then(setUser)
    // const logout = () => auth.logout().then(user => setUser(null))

    useMount(() => {
        // useCallback(() => {
        //     run(bootstrapUser());
        // }, [])
        run(dispatch(bootstrap()))
    })

    if (isIdle || isLoading) {
        return <FullPageLoading />
    }
    
    if (isError) {
        return <FullPageErrorFallback error={error}/>
    }

    return <div>
        {children}
    </div>

    //context写法
    // return <AuthContext.Provider
    //     children={children}
    //     value={{ user, login, register, logout }}
    // />
}

export const useAuth = () => {

    //context写法
    // const context = React.useContext(AuthContext)
    // if (!context) {
    //     throw new Error('useAuth必须在AuthProvider中使用')
    // }
    // return context

    //redux-thunk写法
    const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()
    const queryClient = useQueryClient()
     const { setData: setUser } = useAsync<User | null>()

    const user = useSelector(selectUser)
    const login = useCallback((form: AuthForm) => dispatch(authStore.login(form)),[dispatch])
    const register = useCallback((form: AuthForm) => dispatch(authStore.register(form)),[dispatch])
    const logout = () => auth.logout().then(() => {
        setUser(null)
        queryClient.clear()
    })
    
    return {
        user,
        login,
        register,
        logout,
    }
}