//获取taskType的列表接口；获取到列表就可以根据task.ts中typeId来找到对应的task信息

import { useQuery } from "react-query"
import { TaskType } from "../types/task-type"
import { useHttp } from "./http"

export const useTaskTypes = () => {
    const client = useHttp()
    
    //react-query写法
    return useQuery<TaskType[]>(['taskTypes'], () =>
        client('taskTypes')
    );
}
