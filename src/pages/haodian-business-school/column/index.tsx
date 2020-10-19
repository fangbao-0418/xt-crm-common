import React, { RefObject } from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { If } from '@/packages/common/components'
import { ColumnProps } from 'antd/es/table'
import { Button, Popconfirm } from 'antd'
import { platformEnum } from './config'
import Color from './Color'
import Detail from './Detail'
import { Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { getColumnList, deleteColumn, addColumn, updateColumn } from './api'

interface State {
  dataSource: any
}
class Main extends React.Component<AlertComponentProps, State> {
  public state = {
    dataSource: undefined
  }
  public listRef: ListPageInstanceProps
  public detailRef: RefObject<Detail> = React.createRef<Detail>()
  public columns: ColumnProps<any>[] = [{
    title: '栏目名称',
    dataIndex: 'columnName'
  }, {
    title: '描述',
    dataIndex: 'description'
  }, {
    title: '渠道',
    dataIndex: 'platform',
    render: (text) => platformEnum[text]
  }, {
    title: '课程数量',
    dataIndex: 'articleNum'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '显示状态',
    dataIndex: 'showStatus',
    render: (text) => <Color status={text}/>
  }, {
    title: '操作',
    width: 200,
    render: (record) => {
      const text = record.showStatus === 2 ? '显示': '隐藏'
      return (
        <>
          <Popconfirm className='href' placement="top" title={`你确定要${text}此栏目吗`} onConfirm={this.toggleDisplay.bind(null, record)}>
            <span>{text}</span>
          </Popconfirm>
          <span className='href ml10' onClick={this.handleView.bind(null, record)}>查看</span>
          <span className='href ml10' onClick={this.handleEdit.bind(null, record)}>编辑</span>
          {/* 是否删除 0 能删除 1 不能删除 */}
          <If condition={record.canDelete === 0}>
            <Popconfirm className='href ml10' placement="top" title='你确定要删除此栏目吗？' onConfirm={this.handleDelete.bind(null, record.id)} okText="确认" cancelText="取消">
              <span>删除</span>
            </Popconfirm>
          </If>
        </>
      )
    } 
  }]
  // 切换显示隐藏
  // 显示 = 1, 隐藏 = 2
  public toggleDisplay = async (record: any) => {
    console.log('record', record)
    const res = await updateColumn({
      id: record.id,
      showStatus: record.showStatus === 1 ? 2 : 1,
      platform: 2
    })
    if (res) {
      APP.success('操作成功')
      this.listRef.refresh()
    }
  }
  // 查看栏目
  public handleView = (data: any) => {
    this.props.alert({
      title: '查看栏目',
      width: 600,
      footer: null,
      content: (
        <Detail
          readonly={true}
          mounted={(ref: Detail) => {
            ref.formRef.setValues(data)
          }}
        />
      )
    })
  }
  // 编辑栏目
  public handleEdit = (data: any) => {
    let detailRef = React.createRef<Detail>()
    this.props.alert({
      title: '编辑栏目',
      width: 600,
      content: (
        <Detail
          ref={detailRef}
          mounted={(ref: Detail) => {
            ref.formRef.setValues(data)
          }}
        />
      ),
      onOk: async (hide) => {
        const form = detailRef?.current?.formRef.props.form
        if (form) {
          form.validateFields(async (errs, vals) => {
            if (!errs) {
              let res = await updateColumn({ ...vals, id: data.id })
              if (res) {
                APP.success('操作成功')
                hide()
                this.listRef.refresh()
              }
            }
          })
        }
      }
    })
  }
  public handleDelete = async (id: number) => {
    const res = await deleteColumn(id)
    if (res) {
      APP.success('删除成功')
      this.listRef.refresh()
    }
  }
  public handleAdd = () => {
    let detailRef = React.createRef<Detail>()
    this.props.alert({
      title: '新增栏目',
      width: 600,
      content: (
        <Detail ref={detailRef} />
      ),
      onOk: (hide) => {
        const form = detailRef?.current?.formRef.props.form
        if (form) {
          form.validateFields(async (errs, vals) => {
            if (!errs) {
              let res = await addColumn(vals)
              if (res) {
                APP.success('操作成功')
                hide()
                this.listRef.refresh()
              }
            }
          })
        }
      }
    })
  }
  public render () {
    const { dataSource } = this.state
    return (
      <ListPage
        getInstance={(ref) => this.listRef = ref}
        addonAfterSearch={<Button icon='plus' type='primary' onClick={this.handleAdd}>新建栏目</Button>}
        columns={this.columns}
        api={getColumnList}
      />
    )
  }
}

export default Alert(Main)