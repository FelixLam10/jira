import { Input } from 'antd';
import Column from 'antd/lib/table/Column';
import { useState } from 'react';
import { ColumnsContainer } from '.';
import { useAddKanban } from '../../utils/kanban';
import { useProject } from '../../utils/project';
import { useKanbanQueryKey, useProjectIdInUrl } from './util';
import { Container } from './kanban-column';
export const CreateKanban = () => {
    const [name, setName] = useState('');
    const projectId = useProjectIdInUrl()
    const { mutateAsync: addKanban } = useAddKanban(useKanbanQueryKey())
    
    const submit = async() => {
        await addKanban({ name, projectId })
        setName('')
    }
    return(
        <Container>
            <Input
                size={'large'}
                placeholder={'新建看板名称'}
                onPressEnter={submit}
                value={name}
                onChange={evt => setName(evt.target.value)}
            />
        </Container>
    )
}