import React from 'react'
import { Modal, InputNumber } from 'antd'
import Form, { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'
import { getPurchaseDetail } from './api'
import { parseQuery } from '@/util/utils'
interface State {
  visible: boolean
}
class Main extends React.Component<any, State> {
  public query: any = parseQuery()
  public state: State = {
    visible: false
  }
  public columns = [
    {
      title: '采购批次',
      key: 'purchaseNo',
      dataIndex: 'purchaseNo'
    },
    {
      title: '采购时间',
      key: 'createTime',
      dataIndex: 'createTime'
    },
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId'
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '供货成本',
      key: 'purchasePrice',
      dataIndex: 'purchasePrice'
    },
    {
      title: '库存',
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: 'sku名称',
      key: 'skuName',
      dataIndex: 'skuName'
    },
    {
      title: '团长价',
      key: 'headPrice',
      dataIndex: 'headPrice'
    },
    {
      title: '区长价',
      key: 'cityPrice',
      dataIndex: 'cityPrice'
    },
    {
      title: '合伙人价',
      key: 'areaPrice',
      dataIndex: 'areaPrice'
    },
    {
      title: '管理员价',
      key: 'managerPrice',
      dataIndex: 'managerPrice'
    },
    {
      title: '最后操作者',
      key: 'lastModifyName',
      dataIndex: 'lastModifyName'
    },
    {
      title: '操作',
      key: 'operate',
      width: 80,
      fixed: 'right',
      render: (text: any, records: any) => {
        return <span className='href' onClick={this.showModal}>核销</span>
      }
    }
  ]
  public showModal = () => {
    this.setState({
      visible: true
    })
  }
  public handleOk = () => {

  }
  public handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  public render () {
    const { visible } = this.state
    return (
      <>
        <Modal
          title='核销库存'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='确认核销'
        >
          <Form>
            <FormItem>
              <span className='mr10'>核销</span>
              <InputNumber style={{ width: 172 }} />
              <span className='ml10'>件（最多XX件）</span>
            </FormItem>
          </Form>
        </Modal>
        <ListPage
          rangeMap={{
            pruchaseTime: {
              fields: ['pruchaseStartTime', 'purchaseEndTime']
            }
          }}
          formConfig={getDefaultConfig()}
          columns={this.columns}
          api={(payload: any) => getPurchaseDetail(Object.assign(payload, {
            memberId: this.query.memberId
          }))}
        />
      </>
    )
  }
}

export default Main