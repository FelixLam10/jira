import { Button, Form, Input } from "antd"
import { FormEvent } from "react"
import { LongButton } from "."
import { useAuth } from '../context/auth-context'
import { useAsync } from "../utils/use-async"

export const RegisterScreen = ({ onError }: { onError: (error: Error) => void }) => {

    const { register, user } = useAuth()
    const {run, isLoading} = useAsync(undefined, {throwOnError: true})
    
    // HTMLFormElement extends Element
    // const handleSubmit = (values: FormEvent<HTMLFormElement>) => {
    const handleSubmit = async ({ cpassword, ...values }: { username: string, password: string, cpassword: string }) => {
        if (cpassword !== values.password) {
            onError(new Error('请确认两次输入的密码相同'))
            //直接return表示如果两次输入的密码不同，下面的捕获抛出异常则不再执行。
            return
        }

        try {
            await run(register(values))
        } catch (e: any) {
            onError(e)
       }
    }

    return <Form onFinish={handleSubmit}>
        <Form.Item name={'username'} rules={[{required:true, message:'请输入用户名'}]}>
            <Input placeholder={'用户名'} type="text" id={'username'}></Input>
        </Form.Item>
        <Form.Item name={'password'} rules={[{required:true, message:'请输入密码'}]}>
            <Input placeholder={'密码'} type="password" id={'password'}></Input>
        </Form.Item>
        <Form.Item
            name={'cpassword'}
            rules={[{ required: true, message: '请确认密码' }]}
        >
            <Input
                placeholder={'确认密码'}
                type="password"
                id={'cpassword'}>
            </Input>
        </Form.Item>
        <Form.Item >
            <LongButton
                htmlType={'submit'}
                type={"primary"}
                loading={isLoading}
            >注册</LongButton>
        </Form.Item>
    </Form>
}