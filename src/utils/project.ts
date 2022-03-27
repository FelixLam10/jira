import { useCallback, useEffect } from "react"
import { cleanObject } from "."
import { useHttp } from "./http"
import { useAsync } from "./use-async"
import { Project } from "../types/project"
import { useMutation, useQuery, QueryClient, useQueryClient, QueryKey } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useProjectsSearchParams } from '../screens/project-list/util';
import { useAddConfig, useDeleteConfig, useEditConfig } from "./use-optimistic-options"

export const useProjects = (param?: Partial<Project>) => {
    const client = useHttp()
    // const { run, ...result } = useAsync<Project[]>()

    // const fetchProjects = useCallback(() => client('projects', { data: cleanObject(param || {}) }),[client, param]
    // )

    // useEffect(() => {
    //     run(fetchProjects(), {
    //         retry: fetchProjects
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [param, run, fetchProjects])   

    // return result
    
    //react-query写法
    return useQuery<Project[]>(['projects', param], () =>
        client('projects', { data: param }))
}

export const useEditProject = (queryKey: QueryKey) => {
    // const { run, ...asyncResult} = useAsync()

    const client = useHttp()
    // const queryClient = useQueryClient()
    const [searchParams] = useProjectsSearchParams()
    // const queryKey = ['projects', searchParams]
    
    return useMutation((params: Partial<Project>) => client(`projects/${params.id}`, {
        method: 'PATCH',
        data: params
    }),
        useEditConfig(queryKey)
        //非抽象公共hook写法
        // {
        // onSuccess: () => queryClient.invalidateQueries(queryKey),
        // //mutation一发生，onMutate就会立刻被调用
        // async onMutate(target) {
        //     //获取queryKey对应的data数据
        //     const previousItems = queryClient.getQueryData(queryKey)
        //     queryClient.setQueryData(queryKey, (old?: Project[]) => {
        //         return old?.map(project => project.id === target.id ? {...project, ...target} : project) || []
        //     })
        //     return {previousItems}
        // },
        // //回滚机制：当上边的异步操作发生异常，本地的数据还发生了更改是不行的。此时需要回滚
        // onError(error, newItem, context) {
        //     queryClient.setQueryData(queryKey, (context as {previousItems: Project[]}).previousItems)
        // }
        // }
    )

    //useAsync写法
    // const mutate = (params: Partial<Project>) => {
    //     return run(client(`project/${params.id}`, {
    //         data: params,
    //         method: 'PATCH'
    //     }))
    // }
    // return {
    //     mutate,
    //     ...asyncResult
    // }
}

export const useAddProject = (queryKey: QueryKey) => {
    // const { run, ...asyncResult} = useAsync()

    const client = useHttp()
    const queryClient = useQueryClient()

    return useMutation(
        (params: Partial<Project>) => client(`projects`, {
            data: params,
            method: 'POST'
        }), 
        // 非抽象hook写法    
        // onSuccess: () => queryClient.invalidateQueries('projects')
        useAddConfig(queryKey)
    )

    //useAsync写法
    // const mutate = (params: Partial<Project>) => {
    //     return run(client(`project/${params.id}`, {
    //         data: params,
    //         method: 'POST'
    //     }))
    // }
    // return {
    //     mutate,
    //     ...asyncResult
    // }
}    

export const useDeleteProject = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        ({id}: {id: number}) => client(`projects/${id}`, {
            method: 'DELETE'
        }), 
        useDeleteConfig(queryKey)
    )
}    

export const useProject = (id?: number) => {
    const client = useHttp()
    return useQuery<Project>(
        ['projects', { id }],
        () => client(`projects/${id}`),
        {
            enabled: Boolean(id)
        }
    )
}
