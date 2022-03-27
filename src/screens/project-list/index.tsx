import { useDebounce, useDocumentTitle } from "../../utils"
import { List } from "./list"
import { SearchPanel } from "./search-panel"
import { useProjects } from "../../utils/project"
import { useUsers } from '../../utils/user';
import { Helmet } from "react-helmet"
import { useUrlQueryParam } from "../../utils/url"
import { useProjectModal, useProjectsSearchParams } from "./util"
import { Row, ButtonNoPadding, ErrorBox, ScreenContainer } from '../../components/lib';
import { useDispatch } from "react-redux"
import { projectListActions } from "./project-list.slice"
import { Profiler } from '../../components/profiler'

// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
// https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js

export const ProjectListScreen = () => {
    useDocumentTitle('项目列表', false)
    const {open} = useProjectModal()

    // const [keys] = useState<('name' | 'personId')[]>(['name', 'personId'])
    const [param, setParam] = useProjectsSearchParams()
    const { isLoading, error, data: list } = useProjects(useDebounce(param, 200))
    const { data: users } = useUsers()

    //redux-thunk管理登录状态写法
    // const dispatch = useDispatch()


    console.log(useUrlQueryParam(['random']))

    return (
        <Profiler id={'项目列表'}>
            <ScreenContainer>
            <Row between={true}>
                <h1>项目列表1</h1>
                <ButtonNoPadding
                    onClick={open}
                    type={'link'}
                >
                    创建项目2
                </ButtonNoPadding>
            </Row>
            <SearchPanel users={users || []} param={param} setParam={setParam} />
            <ErrorBox error={error} />
            <List
                loading={isLoading}
                users={users || []}
                dataSource={list || []}
            />
            </ScreenContainer>
        </Profiler>
        
    )
}

ProjectListScreen.whyDidYouRender = false;
