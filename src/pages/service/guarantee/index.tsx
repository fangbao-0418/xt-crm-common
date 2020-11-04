import React from 'react'
import { Card, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Image from '@/components/Image'
import { Alert } from 'antd'
import { getGuaranteeList, updategGuarantee, getCategoryRelationDetail, saveRelationCategory } from './api'
import Detail from './Detail'
import Category from './Category'
import { adapterGuaranteeRes } from './adapter'

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
    title: 'icon',
    dataIndex: 'imageUrl',
    render: (text) => {
      return <Image width={50} height={50} src={text} alt=''/>
    }
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
    console.log('dataSource', dataSource)
    this.setState({ dataSource })
  }
  // 选择支持运费险类目
  public handleOpen = async (id: number) => {
    let nodes: any[] = (await getCategoryRelationDetail(id)) || []
    const value = nodes.map(item => item.thirdCategoryId)
    this.props.alert({
      title: '选择支持运费险类目',
      content: (
        <Category
          value={value}
          onChange={(treeNodes: any[]) => {
            nodes = treeNodes
          }}
        />
      ),
      onOk: async (hide) => {
        if (Array.isArray(nodes) && nodes.length === 0) {
          APP.error('类目关联列表不能为空')
          return
        }
        const productGuaranteeCategoryRelationDTOList = nodes.map(item => ({ guaranteeId: id, ...item}));
        const res = await saveRelationCategory({ productGuaranteeCategoryRelationDTOList })
        if (res) {
          APP.success('操作成功')
          hide()
        }
      }
    })
  }
  // 编辑
  public handleEdit = (data: any) => {
    data = adapterGuaranteeRes(data)
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
      onOk: (hide) => {
        const formRef = detailRef.current?.form.props.form
        if (formRef) {
          formRef.validateFields(async (errs, vals) => {
            if (!errs) {
              const res = await updategGuarantee({ id: data.id, ...vals })
              if (res) {
                APP.success('操作成功')
                this.fetchData()
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