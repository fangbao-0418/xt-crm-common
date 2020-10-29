import React from 'react'
import { Card, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { Alert } from 'antd'
import Detail from './Detail'
import Category from './Category'

class Main extends React.Component<AlertComponentProps, {}> {
  public columns: ColumnProps<unknown>[] = [{
    title: '服务名称',
    dataIndex: 'name'
  }, {
    title: '服务内容',
    dataIndex: 'content'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '操作',
    render: (record) => {
      return (
        <>
          
          {record.name ==='运费险' && <span className='href mr10' onClick={this.handleOpen}>类目管理</span>}
          <span className='href' onClick={this.handleEdit.bind(null, record)}>编辑</span>
        </>
      )
    }
  }]
  public dataSource = [{
    name: '正品保障',
    content: '杭州市西湖区古荡湾',
    sort: 7
  }, {
    name: '品质优选',
    content: '杭州市西湖区古荡湾',
    sort: 6
  }, {
    name: '全场包邮',
    content: '杭州市西湖区古荡湾，特殊商品除外，0元购等等等',
    sort: 5
  }, {
    name: '运费险',
    content: '喜团为你购买的商品投保运费险（保单生效以确认订单页展示的运费险为准）',
    sort: 4
  }]
  // 选择支持运费险类目
  public handleOpen = () => {
    this.props.alert({
      title: '选择支持运费险类目',
      content: <Category />
    })
  }
  // 编辑
  public handleEdit = (data: any) => {
    let detailRef = React.createRef<Detail>()
    this.props.alert({
      title: '编辑服务保障',
      content: (
        <Detail
          {...data}
          ref={detailRef}
          onMounted={(form) => {
            form.setValues(data)
          }}
        />
      ),
      onOk(hide) {
        const formRef = detailRef.current?.form.props.form
        if (formRef) {
          formRef.validateFields((errs, vals) => {
            if (!errs) {
              hide()
            }
          })
        }
      }
    })
  }
  public render () {
    return (
      <Card>
        <Alert
          message="显示在商品详情页面的服务保障，正品保障，品质优选，全场包邮，运费险为平台自营+pop店商品详情共用，"
          description={<span style={{ color: 'red' }}>参加拦截的商品不支持运费险</span>}
          type="warning"
          showIcon
        />
        <Table className='mt10' columns={this.columns} dataSource={this.dataSource}/>
      </Card>
    )
  }
}

export default alert(Main)