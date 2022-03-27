import { Button, Drawer, Form, Input, Spin } from 'antd';
import { UserSelect } from '../../components/user-select';
import { useProjectModal, useProjectsQueryKey } from './util';
import { useEditProject, useAddProject } from '../../utils/project';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { ErrorBox } from '../../components/lib';
import styled from '@emotion/styled';

export const ProjectModal = () => {
    const { projectModalOpen, close, editingProject, isLoading } = useProjectModal()
    const useMutateProject = editingProject ? useEditProject : useAddProject
    
    //这里选择async异步是因为希望等到编辑和创作操作完成以后再去关闭窗口或者重置表单；如果同步就没法捕捉它是否完成
    const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject(useProjectsQueryKey())
    //控制重置表单
    const [form] = useForm()

    const onFinish = (values: any) => {
        mutateAsync({ ...editingProject, ...values }).then(() => {
            form.resetFields()
            close()
        })
    }

    const closeModal = () => {
        form.resetFields()
        close()
    }

    const title = editingProject ? '编辑项目' : '创建项目'

    useEffect(() => {
        form.setFieldsValue(editingProject)
    },[editingProject, form])

    return <Drawer
        forceRender={true}
        onClose={closeModal}
        visible={projectModalOpen}
        width={'100%'}>
        <Container>
            {
            isLoading ? <Spin size={'large'} /> : <> 
                <h1>{title}</h1>
                <ErrorBox error={ error }/>
                <Form form={form} layout={"vertical"} style={{width: '40rem'}} onFinish={onFinish}>
                    <Form.Item label={'名称'} name={'name'} rules={[{required: true, message: '请输入项目名'}]}>
                        <Input placeholder={ '请输入项目名称' }/>
                    </Form.Item>
                    <Form.Item label={'部门'} name={'organization'} rules={[{required: true, message: '请输入部门名'}]}>
                        <Input placeholder={ '请输入部门名称' }/>
                    </Form.Item>
                    <Form.Item label={'负责人'} name={'personId'}>
                        <UserSelect defaultOptionName={ '负责人' } />
                    </Form.Item>
                    <Form.Item style={{textAlign: 'right'}}>
                        <Button loading={mutateLoading} type="primary" htmlType={"submit"}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </>
        }
        </Container>
    </Drawer>
}

const Container = styled.div`
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column
`