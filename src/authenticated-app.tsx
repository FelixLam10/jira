import { useAuth } from "./context/auth-context";
import styled from "@emotion/styled";
import { Row, ButtonNoPadding } from './components/lib';
import { ReactComponent as SoftwareLogo } from './assets/software-logo.svg'
import { Button, Dropdown, Menu } from "antd";
import { Route, Routes } from 'react-router'
import { BrowserRouter as Router} from 'react-router-dom'
import { ProjectScreen } from "./screens/project";
import { resetRoute } from "./utils";
import { ProjectPopover } from './components/project-popover';
import { ProjectListScreen } from "./screens/project-list";
import { UserPopover } from "./components/user-popover";
import { ProjectModal } from "./screens/project-list/project-modal";

export const AuthenticatedApp = () => {
    //redux-thunk写法
    // const dispatch = useDispatch()

    //状态提升写法
    // const [projectModalOpen, setProjectModalOpen] = useState(false);

    return (
        <Container>
            <Router>
                <PageHeader/>
                {/* <Button onClick={ ()=> dispatch(projectListActions.openProjectModal())}>打开</Button> */}
                <Main>
                    <Routes>
                        <Route
                            path={'/projects'}
                            element={
                                <ProjectListScreen />
                            }
                        />
                        <Route
                            path={'/projects/:ProjectId/*'}
                            element={<ProjectScreen />}
                        />
                        <Route index element={<ProjectListScreen/>
                                }/>
                        {/* <Navigate to={'/project'}/> */}
                    </Routes>
                </Main>
                <ProjectModal />
            </Router>
    </Container>
    )
}

const HeaderItem = styled.h3`margin-right: 3rem`

const PageHeader = () => {
    return <Header between={true}>
        <HeaderLeft gap={true}>
            {/* 点击时重置路由 */}
            <ButtonNoPadding type={'link'} onClick={ resetRoute }>
                <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'}/>
            </ButtonNoPadding>
            <ProjectPopover />
            <UserPopover />
            </HeaderLeft>
            <HeaderRight>
                <User/>
            </HeaderRight>
        </Header>
}

const User = () => {
    const { logout, user } = useAuth()
    return <Dropdown
        overlay={<Menu>
            <Menu.Item key={'logout'}>
                <Button type={'link'} onClick={logout}>登出</Button>
            </Menu.Item>
            </Menu>}>
            <Button type={'link'} onClick={e => e.preventDefault()}>
                Hi, {user?.name}
            </Button>
    </Dropdown>
}

const Container = styled.div`
display: grid;
grid-template-rows: 6rem 1fr;
height: 100vh;
`

const Header = styled(Row)`
padding: 3.2rem;
box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
z-index: 1;
`

const HeaderLeft = styled(Row)``

const HeaderRight = styled.div``

const Main = styled.main`
    display: flex;
    overflow: hidden;
`

// const PageHeader = styled.header`
// background-color: gray;
// height: 6rem;
// `

// const Main = styled.main`
// height: calc(100vh - 6rem);
// `