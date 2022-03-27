import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query"
import { Kanban } from "../types/kanban"
import { Task } from "../types/task"
import { useHttp } from "./http"
import { useAddConfig, useDeleteConfig, useReorderKanbanConfig } from './use-optimistic-options';

export const useKanbans = (param?: Partial<Kanban>) => {
    const client = useHttp()
    
    //react-query写法
    return useQuery<Kanban[]>(['kanbans', param], () =>
        client('kanbans', { data: param }))
}


export const useAddKanban = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        (params: Partial<Kanban>) => client(`kanbans`, {
            data: params,
            method: 'POST'
        }), 
        // 非抽象hook写法    
        // onSuccess: () => queryClient.invalidateQueries('projects')
        useAddConfig(queryKey)
    )
}    

export const useAddTask = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        (params: Partial<Task>) => client(`tasks`, {
            data: params,
            method: 'POST'
        }), 
        // 非抽象hook写法    
        // onSuccess: () => queryClient.invalidateQueries('projects')
        useAddConfig(queryKey)
    )
}   

export const useDeleteKanban = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        ({id}: {id: number}) => client(`kanbans/${id}`, {
            method: 'DELETE'
        }), 
        useDeleteConfig(queryKey)
    )
}    

export interface SortProps {
    //要重新排序的item
    fromId: number;
    // 目标item
    referenceId: number;
    //放在目标item的前还是后
    type: 'before' | 'after',
    fromKanbanId?: number,
    toKanbanId?: number
}

export const useReorderKanban = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation(
        (params: SortProps) => {
            return client('kanbans/reorder', {
                data: params,
                method: 'POST'
            });
        },useReorderKanbanConfig(queryKey)
    )
}