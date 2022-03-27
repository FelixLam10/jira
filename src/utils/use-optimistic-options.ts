import { QueryKey, useQueryClient } from "react-query";
import { Task } from "../types/task";
import { reorder } from "./reorder";

export const useConfig = (queryKey: QueryKey, callback: (target: any, old?: any[]) => any[]) => {
    const queryClient = useQueryClient()
    return {
        onSuccess: () => queryClient.invalidateQueries(queryKey),
        //mutation一发生，onMutate就会立刻被调用
        async onMutate(target: any) {
            //获取queryKey对应的data数据
            const previousItems = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old?: any[]) => {
                return callback(target, old)
            })
            return {previousItems}
        },
        //回滚机制：当上边的异步操作发生异常，本地的数据还发生了更改是不行的。此时需要回滚
        onError(error: any, newItem: any, context: any) {
            queryClient.setQueryData(queryKey, context.previousItems)
        }
    }   
}

export const useDeleteConfig = (queryKey: QueryKey) =>
    useConfig(
        queryKey,
        (target, old) => old?.filter(item => item.id !== target.id) || []
    );

export const useEditConfig = (queryKey: QueryKey) =>
    useConfig(
        queryKey,
        (target, old) =>
            old?.map((item) => item.id === target.id ? { ...item, ...target } : item
            ) || []
    );

export const useAddConfig = (queryKey: QueryKey) => useConfig(
    queryKey, (target, old) => old ? [...old, target] : []
)

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
    useConfig(queryKey, (target, old) => reorder({ list: old, ...target }))

export const useReorderTaskConfig = (queryKey: QueryKey) => useConfig(queryKey, (target, old) => {
    //乐观更新task序列中的位置
    const orderedList = reorder({ list: old, ...target }) as Task[];
    //由于task排序还可能涉及到所属kanban的改变，所以不要忘记改变kanbanId
    return orderedList.map((item) =>
        item.id === target.fromId
            ? { ...item, kanbanId: target.toKanbanId }
            : item
    )
})