import { useLocation } from "react-router"
import { useProject } from "../../utils/project"
import { useUrlQueryParam } from '../../utils/url';
import { useCallback, useMemo } from 'react';
import { useTask } from "../../utils/task";
import { useDebounce } from '../../utils/index';

//获取url上id对应的project项目名来展现看板名称hook

//读取url中project的id
export const useProjectIdInUrl = () => {
    const { pathname } = useLocation()
    const id = pathname.match(/projects\/(\d+)/)?.[1]
    return Number(id)
}

//根据id返回整个project
export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() })

export const useKanbanQueryKey = () => ['kanbans', useKanbanSearchParams]

export const useTasksSearchParams = () => { 
    const [param] = useUrlQueryParam([
        'name',
        'typeId',
        'processorId',
        'tagId'
    ])
    const projectId = useProjectIdInUrl()

    return useMemo(() => ({
        projectId,
        typeId: Number(param.typeId) || undefined,
        processorId: Number(param.processorId) || undefined,
        tagId: Number(param.tagId) || undefined,
        name: param.name
    }),
        [projectId, param])
}

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]   

export const useTasksModal = () => {
    const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam(['editingTaskId'])
    const { data: editingTask, isLoading } = useTask(Number(editingTaskId))
    const startEdit = useCallback((id: number) => {
        setEditingTaskId({editingTaskId: id})
    }, [setEditingTaskId])
    const close = useCallback(() => {
        setEditingTaskId({editingTaskId: ''})
    }, [setEditingTaskId])
    return {
        editingTaskId,
        editingTask,
        startEdit,
        close,
        isLoading
    }
}