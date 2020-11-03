import React from 'react'
import { Card, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { Alert } from 'antd'
import { getGuaranteeList, updategGuarantee, getCategoryRelationDetail } from './api'
import Detail from './Detail'
import Category from './Category'

interface State {
  dataSource: any[]
}
class Main extends React.Component<AlertComponentProps, State> {
  public state = {
    dataSource: []
  }
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
          
          {record.name ==='运费险' && <span className='href mr10' onClick={this.handleOpen.bind(null, record.id)}>类目管理</span>}
          <span className='href' onClick={this.handleEdit.bind(null, record)}>编辑</span>
        </>
      )
    }
  }]
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData = async () => {
    const dataSource = await getGuaranteeList()
    this.setState({ dataSource })
  }
  // 选择支持运费险类目
  public handleOpen = async (id: number) => {
    let res = await getCategoryRelationDetail(id)
    console.log('res', res)
    this.props.alert({
      title: '选择支持运费险类目',
      content: (
        <Category
          value={res}
          onChange={(value: any[]) => {
            res = value
          }}
        />
      ),
      onOk: () => {
        console.log('value', res)       
      }
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
          formRef.validateFields(async (errs, vals) => {
            if (!errs) {
              const res = await updategGuarantee({ id: data.id, ...vals })
              if (res) {
                APP.success('操作成功')
                hide()
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
      <Card>
        <Alert
          message="显示在商品详情页面的服务保障，正品保障，品质优选，全场包邮，运费险为平台自营+pop店商品详情共用，"
          description={<span style={{ color: 'red' }}>参加拦截的商品不支持运费险</span>}
          type="warning"
          showIcon
        />
        <Table className='mt10' columns={this.columns} dataSource={dataSource}/>
      </Card>
    )
  }
}

export default alert(Main)