import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getFieldsConfig, environmentTypeOptions, statusEnums, colorEnums, options } from './config'
import * as api from './api'
import { ColumnProps } from 'antd/lib/table'
import { Icon, Menu, Dropdown, Button, Modal, Badge } from 'antd'

class Main extends React.Component {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [
    {
      title: '版本编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any, record: any, index: number) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '发布时间',
      dataIndex: 'lastPublishTime',
      key: 'lastPublishTime',
      render: (text: any, record: any, index: number) => {
        return text ? APP.fn.formatDate(text) : '-'
      }
    },
    {
      title: '最后发布人',
      dataIndex: 'lastPublishName',
      key: 'lastPublishName',
      render: (text: any, record: any, index: number) => {
        return text || '-'
      }
    },
    {
      title: '发布状态',
      dataIndex: 'statusDesc'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 300,
      render: ((text: any, record: any, index: number) => (
        <>
          {
            record.status === 0 ?
            <Button type='link' onClick={() => this.handleEdit(record.id)}>编辑</Button> :
            <Button type='link' onClick={() => this.handleEdit(record.id, 'readOnly')}>查看</Button>
          }
          {record.status !== 8 && <Button type='link' onClick={() => this.handlePublish(record.id)}>发布</Button>}
          <Button type='link' onClick={() => this.handleCopy(record.id)}>复制</Button>
          {record.status === 0 && <Button type='link' onClick={() => this.handleDelete(record.id)}>删除</Button>}
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
  public handlePublish (id: number) {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认发布',
      onOk: async () => {
        const data = await api.publish({ id })
        if (data) {
          APP.success('发布成功')
          this.listpage.refresh()
        }
      }
    })
  }
  /** 新建配置 */
  public async handleAdd () {
    Modal.confirm({
      title: '系统提示',
      content: `是否新建版本`,
      onOk: async () => {
        const data = await api.addVersion()
        if (data) {
          APP.success('新建成功')
          this.listpage.refresh()
        }
      }
    })
  }
  /** 编辑 */
  public handleEdit (id: number, readOnly?: string) {
    const search = readOnly ? `?readOnly=${readOnly}` : ''
    APP.history.push(`/setting/my/${id}${search}`)
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
              <Button icon='plus' type='primary' onClick={this.handleAdd}>新建版本</Button>
            </div>
          )}
          processData={(data) => {
            data.records = data.result
            Reflect.deleteProperty(data, 'result')
            return data
          }}
          rangeMap={{
            publishTime: {
              fields: ['startLastPublishTime', 'endLastPublishTime'],
              format: 'YYYY-MM-DD HH:MM:SS'
            }
          }}
        />
      </div>
    )
  }
}
export default Main
