import { Link } from 'react-router-dom';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { KanbanScreen } from '../Kanban';
import { EpicScreen } from '../epic';
import styled from '@emotion/styled';
import { Menu } from 'antd';

const useRouteType = () => {
    const units = useLocation().pathname.split('/')
    return units[units.length - 1]
}

export const ProjectScreen = () => {
    const routeType = useRouteType()
    return (
        <Container>
            <Aside>
                <Menu mode={'inline'} selectedKeys={[routeType]}>
                    <Menu.Item key={'kanban'}>
                        <Link to={ 'kanban' }>看板1</Link>
                    </Menu.Item>
                   <Menu.Item key={'epic'}>
                        <Link to={ 'epic' }>任务组界面</Link>
                    </Menu.Item>
                </Menu>
            </Aside>
            <Main>
                <Routes>
                    {/* projects/:projectId/kanban */}
                    <Route path={'/kanban'} element={<KanbanScreen />} />
                    {/* projects/:projectId/epic */}
                    <Route path={'/epic'} element={<EpicScreen />} />
                    <Route index element={<KanbanScreen/> }></Route>
                    {/* <Navigate to={window.location.pathname + '/kanban'}/> */}
                </Routes>
            </Main>
        </Container>
    )
}

const Aside = styled.aside`
    background-color: rgb(244, 245, 247);
    display: flex;
`

const Main = styled.div`
    box-shadow: -5px 0 -5px rgb(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
`

const Container = styled.div`
    display: grid;
    grid-template-columns: 16rem 1fr;
    width: 100%;
`