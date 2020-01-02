import React from 'react'
import { Table, Button, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Search from './components/Search'
import styles from './style.module.sass'
import * as api from './api'
interface State extends PageProps<Special.DetailProps> {
}
class Main extends React.Component<{}, State> {
  public payload: Special.SearchProps = {}
  public state: State = {
    records: [],
    current: 1,
    size: 10,
    total: 0
  }
  public columns: ColumnProps<Special.DetailProps>[] = [{
    dataIndex: 'id',
    title: '专题ID'
  }, {
    dataIndex: 'subjectName',
    title: '专题名称'
  }, {
    title: '链接',
    render: (text, record) => {
      const url = APP.fn.getH5Origin() + `#/activity/${record.id}`
      return <a target="_blank" href={url} title={record.subjectName}>{url}</a>
    }
  }, {
    dataIndex: 'status',
    title: '状态',
    width: 100,
    render: (text) => {
      return text === 1 ? <span className={styles.valid}>已生效</span> : <span  className={styles.invalid}>失效</span>
    }
  }, {
    title: '操作',
    align: 'center',
    width: 200,
    render: (text, record) => {
      const status = record.status
      const statusText = status === 0 ? '生效' : '失效'
      return (
        <div className={styles.operate}>
          <span className='href' onClick={() => {APP.history.push(`/interface/special/${record.id}`)}}>编辑</span>
          <Popconfirm
            title={`确定要${statusText}该专题吗?`}
            onConfirm={() => this.changeSpecialStatus([record.id], status)}
          >
            <span
              className='href'
            >
              {statusText}
            </span>
          </Popconfirm>
          <Popconfirm
            title="确定要删除该专题吗?"
            onConfirm={() => this.deleteSpecial([record.id])}
          >
            {status === 0 && <span className='href' >删除</span>}
          </Popconfirm>
        </div>
      )
    }
  }]
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchSpecialList(this.payload).then((res: any) => {
      console.log(res)
      this.setState({...res})
    })
  }
  public deleteSpecial (ids: number[]) {
    api.deleteSpecial(ids).then(() => {
      this.fetchData()
    })
  }
  public changeSpecialStatus (ids: number[], status: 0 | 1 | undefined) {
    api.changeSpecialStatus(ids, status).then(() => {
      this.fetchData()
    })
  }
  public render () {
    return (
      <div>
        <div className={styles.container}>
          <Search
            className={styles.search}
            onChange={(param) => {
              this.payload = param || {}
              this.payload.pageNo = 1
              this.fetchData()
            }}
          />
          <div style={{marginBottom: 20}}>
            <Button
              type="primary"
              onClick={() => {
                APP.history.push('/interface/special/-1')
              }}
            >
              新增专题
            </Button>
          </div>
          <Table
            rowKey='id'
            columns={this.columns}
            dataSource={this.state.records}
            pagination={{
              total: this.state.total,
              pageSize: this.state.size,
              current: this.state.current,
              onChange: (current) => {
                this.payload.pageNo = current
                this.fetchData()
              }
            }}
          />
        </div>
      </div>
    )
  }
}
export default Main