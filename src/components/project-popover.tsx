import styled from '@emotion/styled';
import { Button, Divider, List, Popover, Typography } from 'antd';
import { useProjects } from '../utils/project';
import { type } from 'os';
import { ButtonNoPadding } from './lib';
import { useDispatch } from 'react-redux';
import { projectListActions } from '../screens/project-list/project-list.slice';
import { useProjectModal } from '../screens/project-list/util';

export const ProjectPopover = () => {

    //用url参数管理项目模态框状态
    const { open } = useProjectModal()
    
    //用redux-thunk管理登录状态
    // const dispatch = useDispatch()

    //获取项目列表
    const { data: projects, refetch } = useProjects()
    //把所有的收藏项目筛选出来
    const pinnedProjects = projects?.filter((project) => project.pin)

    const content = <ContentContainer>
        <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
        <List>
            {
                pinnedProjects?.map((project) => (
                    <List.Item key={project.id}>
                        <List.Item.Meta title={project.name} />
                    </List.Item>
                ))
            }
        </List>
        <Divider />
        <ButtonNoPadding
            onClick={open}
            type={"link"}
        >
            创建项目
        </ButtonNoPadding>
    </ContentContainer>
    
    return <Popover onVisibleChange={() => refetch()} placement={'bottom'} content={content}>
        <span>
            项目
        </span>
    </Popover>
}

const ContentContainer = styled.div`
    min-width: 30rem
`