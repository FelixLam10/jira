import { useEffect } from "react"
import { useQuery } from "react-query"
import { cleanObject } from "."
import { User } from "../types/user"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

export const useUsers = (param?: Partial<User>) => {
    const client = useHttp()
    return useQuery<User[]>(
        ['users', param],
        () => client('users', {data: param})
    )
}