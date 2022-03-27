import { Dropdown, Menu, Modal, Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import { User } from "../../types/user"
//react和react-router-dom的关系类似于react和react-dom/react-native/react-vr...
import { Link } from 'react-router-dom'
import { Pin } from '../../components/pin'
import { render } from '@testing-library/react';
import { useDeleteProject, useEditProject } from '../../utils/project';
import { ButtonNoPadding } from '../../components/lib'
import { type } from 'os';
import { projectListActions } from './project-list.slice';
import { useDispatch } from 'react-redux'
import { useProjectModal, useProjectsQueryKey } from './util';
import { Project } from '../../types/project'

interface ListProps extends TableProps<Project>{
    users: User[];
    // refresh?: () => void,
    // projectButton: JSX.Element
}

export const List = ({ users, ...props }: ListProps) => {
    const { mutate } = useEditProject(useProjectsQueryKey())
    // const dispatch = useDispatch()
    const pinProject = (id: number) =>  (pin: boolean) => mutate({id, pin})

    return <Table
        rowKey={'id'}
        pagination={false}
        columns={[
            {
                title: <Pin checked={true} disabled={true} />,
                render(value, project) {
                    return <Pin
                        checked={project.pin}
                        onCheckedChange={pinProject(project.id)}/>
                }
            },
            {
                title: '名称',
                sorter: (a, b) => a.name.localeCompare(b.name),
                render(value, project) {
                    return <Link to={`projects/${String(project.id)}`}>{ project.name }</Link>
                }
            },
            {
                title: '部门',
                dataIndex: 'organization',
            },
            {
                title: '负责人',
                render(value, project) {
                    return <span>
                        {users.find(user => user.id === project.personId)?.name || '未知'}
                    </span>
                }
            },
            {
                title: '创建时间',
                render(value, project) {
                    return <span>
                        {project.created? dayjs(project.created).format('YYYY-MM-DD'): '无'}
                    </span>
                }
            },
            {
                render(value, project) {
                    return <More project={ project }/>
                }
            }
        ]}
        {...props}
    />
}

const More = ({ project }: { project: Project }) => {
    const {startEdit} = useProjectModal()
    const editProject = (id: number) => () => startEdit(id)

    //引入delete
    const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey())

    //先给用户弹窗确认是否删除，避免点错的情况
    const confirmDeleteProject = (id: number) => {
        Modal.confirm({
            title: '确定删除这个项目吗？',
            content: '点击确定删除',
            okText: '确定',
            onOk() {
                deleteProject({id})
            }
        })
    }

    return <Dropdown
        overlay={
            <Menu>
                <Menu.Item key={'edit'} onClick={editProject(project.id)}>
                    编辑
                </Menu.Item>
                <Menu.Item key={'delete'} onClick={() => confirmDeleteProject(project.id)}>
                    删除
                </Menu.Item>
            </Menu>
        }>
            <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
}