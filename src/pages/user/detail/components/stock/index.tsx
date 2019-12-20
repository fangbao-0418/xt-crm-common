import React from 'react'
import { Modal, InputNumber } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'
import { getPurchaseList, eliminate } from './api'
import { parseQuery } from '@/util/utils'
interface State {
  visible: boolean,
  stock?: number
}
class Main extends React.Component<any, State> {
  public query: any = parseQuery()
  /** 核销采购ID */
  public purchaseId: number
  /** 核销库存 */
  public purchaseStock: number
  public state: State = {
    visible: false
  }
  public form: FormInstance
  public list: ListPageInstanceProps
  public columns = [
    {
      title: '采购批次',
      width: 150,
      key: 'purchaseNo',
      dataIndex: 'purchaseNo'
    },
    {
      title: '采购时间',
      width: 150,
      key: 'createTime',
      dataIndex: 'createTime'
    },
    {
      title: '商品ID',
      width: 150,
      key: 'productId',
      dataIndex: 'productId'
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '采购成本(元)',
      width: 80,
      key: 'purchasePrice',
      dataIndex: 'purchasePrice'
    },
    {
      title: '采购量(件)',
      key: 'purchaseCount',
      dataIndex: 'purchaseCount'
    },
    {
      title: '剩余库存(件)',
      width: 80,
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: 'sku名称',
      width: 150,
      key: 'skuName',
      dataIndex: 'skuName'
    },
    {
      title: '团长价',
      width: 150,
      key: 'headPrice',
      dataIndex: 'headPrice'
    },
    {
      title: '区长价',
      width: 150,
      key: 'cityPrice',
      dataIndex: 'cityPrice'
    },
    {
      title: '合伙人价',
      width: 150,
      key: 'areaPrice',
      dataIndex: 'areaPrice'
    },
    {
      title: '管理员价',
      width: 150,
      key: 'managerPrice',
      dataIndex: 'managerPrice'
    },
    {
      title: '最后操作者',
      width: 150,
      key: 'lastModifyName',
      dataIndex: 'lastModifyName'
    },
    {
      title: '操作',
      key: 'operate',
      width: 80,
      fixed: 'right',
      render: (text: any, records: any) => {
        return (
          <span
            className='href'
            onClick={() => {
              this.purchaseId = records.id
              this.setState({
                visible: true,
                stock: records.stock
              })
            }}
          >
            核销
          </span>
        )
      }
    }
  ]
  public showModal = () => {
    this.setState({
      visible: true
    })
  }
  public handleOk = () => {
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        const res = await eliminate({
          eliminateCount: vals.eliminateCount,
          purchaseId: this.purchaseId
        })
        if (res) {
          APP.success('核销库存成功')
          this.list.refresh()
          this.handleClose()
        }
      }
    })
  }
  public handleClose = () => {
    this.form.props.form.resetFields()
    this.setState({
      visible: false,
      stock: undefined
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
          onCancel={this.handleClose}
          okText='确认核销'
        >
          <Form getInstance={ref => this.form = ref}>
            <FormItem
              label='核销'
              required
              inner={(form) => {
                return (
                  <>
                    {form.getFieldDecorator('eliminateCount', {
                      rules: [{
                        required: true,
                        message: '核销数目不能为空'
                      }]
                    })(
                      <InputNumber
                        min={0}
                        max={this.state.stock}
                        style={{ width: 172 }}
                      />
                    )}
                    <span className='ml10'>件（最多{this.state.stock}件）</span>
                  </>
                )
              }}
            />
          </Form>
        </Modal>
        <ListPage
          getInstance={ref => this.list = ref}
          rangeMap={{
            pruchaseTime: {
              fields: ['pruchaseStartTime', 'purchaseEndTime']
            }
          }}
          formConfig={getDefaultConfig()}
          columns={this.columns}
          api={(payload: any) => getPurchaseList(Object.assign(payload, {
            memberId: this.query.memberId
          }))}
        />
      </>
    )
  }
}

export default Main