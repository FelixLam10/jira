import { FormEvent } from "react"
import { useAuth } from '../context/auth-context'
import { Button, Form, Input } from 'antd'
import { LongButton } from "."
import { useAsync } from '../utils/use-async';
import { useDispatch } from "react-redux";

export const LoginScreen = ({ onError }: { onError: (error: Error) => void }) => {

    const { login, user } = useAuth()
    const {run, isLoading} = useAsync(undefined, {throwOnError: true})
    const dispatch = useDispatch()

    // HTMLFormElement extends Element
    // const handleSubmit = (values: FormEvent<HTMLFormElement>) => {
    /**const username = (event.currentTarget.elements[0] as HTMLInputElement).value
     * 如果不加 as HTMLInputElement会报 Element 没有value 的错误
     * 加上以后相当于告诉编译环境，我知道它是什么类型 听我的
     */
    const handleSubmit = async (values: {
        username: string,
        password: string
    }) => {
        dispatch(login(values))
        try {
            await run(login(values)) 
        } catch (e: any) {
            onError(e)
        }
    };

    return <Form onFinish={handleSubmit}>
        <Form.Item name={'username'} rules={[{required:true, message:'请输入用户名'}]}>
            <Input placeholder={'用户名'} type="text" id={'username'}></Input>
        </Form.Item>
        <Form.Item
            name={'password'}
            rules={[{ required: true, message: '请输入密码' }]}
        >
            <Input
                placeholder={'密码'}
                type="password"
                id={'password'}>
            </Input>
        </Form.Item>
        <Form.Item >
            <LongButton
                loading={isLoading}
                htmlType={'submit'}
                type={"primary"}
            >登录</LongButton>
        </Form.Item>
    </Form>
}