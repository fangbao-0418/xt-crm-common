import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getFieldsConfig } from './config'
import * as api from './api'
import { ColumnProps } from 'antd/lib/table'
import { Icon, Menu, Dropdown, Button, Modal } from 'antd'
class Main extends React.Component {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [
    {
      title: '版本编号',
      dataIndex: 'id'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime'
    },
    {
      title: '最后发布人',
      dataIndex: 'publishTime'
    },
    {
      title: '发布状态',
      dataIndex: 'status'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 300,
      render: ((text: any, record: any, index: number) => (
        <>
          <Dropdown
            overlay={(
              <Menu>
                <Menu.Item>
                  <span className='href' onClick={() => this.handlePublish('正式环境')}>正式环境</span>
                </Menu.Item>
                <Menu.Item>
                  <span className='href' onClick={() => this.handlePublish('预发环境')}>预发环境</span>
                </Menu.Item>
              </Menu>
            )}>
            <Button type='link'>发布<Icon type="down" /></Button>
          </Dropdown>
          <Button type='link' onClick={this.handleEdit}>编辑</Button>
          <Button type='link' onClick={() => this.handleCopy(record.id)}>复制</Button>
          <Button type='link' onClick={() => this.handleDelete(record.id)}>删除</Button>
        </>
      ))
    },
  ]
  public constructor (props: any) {
    super(props)
    this.handleCopy = this.handleCopy.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }
  /** 复制 */
  public handleCopy (id: number) {
    Modal.confirm({
      title: '系统提示',
      content: '是否复制草稿',
      onOk: async () => {
        const data = await api.copy({ id })
        if (data) {
          APP.success('复制成功')
          this.listpage.refresh()
        }
      }
    })
  }
  /** 发布 */
  public handlePublish (msg: string) {
    Modal.confirm({
      title: '系统提示',
      content: `是否发到${msg}`,
      onOk: async () => {
        const data = await api.publish()
        if (data) {
          APP.success('发布成功')
          this.listpage.refresh()
        }
      }
    })
  }
  /** 新建配置 */
  public handleAdd () {
    APP.history.push('/setting/my/-1')
  }
  /** 编辑 */
  public handleEdit () {
    APP.history.push('/setting/my/1')
  }
  /** 删除 */
  public handleDelete (id: number) {
    Modal.confirm({
      title: '系统提示',
      content: '是否删除草稿',
      onOk: async () => {
        const data = await api.deleteVersion({ id })
        if (data) {
          APP.success('删除成功')
          this.listpage.refresh()
        }
      }
    })
  }
  public render () {
    return (
      <div>
        <ListPage
          getInstance={(ref) => {
            this.listpage = ref
          }}
          formConfig={getFieldsConfig()}
          api={api.getList}
          columns={this.columns}
          addonAfterSearch={(
            <div>
              <Button icon='plus' type='primary' onClick={this.handleAdd}>新建</Button>
            </div>
          )}
        />
      </div>
    )
  }
}
export default Main
