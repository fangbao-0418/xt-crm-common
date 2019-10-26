import React from 'react';
import { Table, Card, Button, Modal, message } from 'antd';
import Search from './Search'
class MessageTemplate extends React.Component {
    payload = {
        page: 1,
        pageSize: 10
    }
    state = {
        selectedRowKeys: [],
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
    };

    // 在第一次渲染后调用，组件已经生成了对应的DOM结构
    componentDidMount() {

    }
    query = () => {
        this.setState({
            page: this.payload.page,
            pageSize: this.payload.pageSize
        })
        console.log('执行了','query');
    }

    render() {
        const { current, total, pageSize } = this.state;

        const columns = [
            {
                title: '模板ID',
                dataIndex: 'id'
            },
            {
                title: '模板标题',
                dataIndex: 'title'
            }
        ]
        console.log("state", this.state)
        return (
            <>
            <Card>
                <Search className='ml10'>

                </Search>
            </Card>
            <Card>
                <Table>
                    
                </Table>
            </Card>
            </>
        )
    }
}