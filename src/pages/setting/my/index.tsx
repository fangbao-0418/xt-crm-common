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
      dataIndex: 'id'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: any, record: any, index: number) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (text: any, record: any, index: number) => {
        return text ? APP.fn.formatDate(text) : '-'
      }
    },
    {
      title: '最后发布人',
      dataIndex: 'publishTime',
      render: (text: any, record: any, index: number) => {
        return text || '-'
      }
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      render: (text: any, record: any, index: number) => {
        return  text === 1 ? statusEnums[text] : <Badge color={colorEnums[text]} text={statusEnums[text]} />
      }
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
                {environmentTypeOptions.map((opts: options) => (
                  <Menu.Item>
                    <span className='href' onClick={() => this.handlePublish(opts, record.id)}>{opts.label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            )}>
            <Button type='link'>发布<Icon type="down" /></Button>
          </Dropdown>
          <Button type='link' onClick={() => this.handleEdit(record.id)}>编辑</Button>
          <Button type='link' onClick={() => this.handleCopy(record.id)}>复制</Button>
          {record.status === 1 && <Button type='link' onClick={() => this.handleDelete(record.id)}>删除</Button>}
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
  public handlePublish (opts: options, id: number) {
    Modal.confirm({
      title: '系统提示',
      content: `是否发到${opts.label}`,
      onOk: async () => {
        const data = await api.publish({
          environmentType: opts.value,
          id
        })
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
  public handleEdit (id: number) {
    APP.history.push(`/setting/my/${id}`)
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
        />
      </div>
    )
  }
}
export default Main
