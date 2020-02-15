import React from 'react'
import { Button, Popconfirm, Row, Col } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Detail from './Detail'
import { getFieldsConfig, TrimTypeEnum, TrimStatusEnum, CreatedTypeEnum } from './config'
import * as api from './api'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { ListResponse } from './interface'

interface Props extends Partial<AlertComponentProps> {
  /** 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效 */
  status: number
}

interface State {
  selectedRowKeys: any[]
}

class Main extends React.Component<Props, State> {
  public columns: ColumnProps<ListResponse>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 100
    },
    {
      dataIndex: 'trimName',
      title: '名称',
      width: 200
    },
    {
      dataIndex: 'accId',
      title: '对账单ID',
      width: 100
    },
    {
      dataIndex: 'trimType',
      title: '调整类型',
      width: 100,
      render: (text) => {
        return TrimTypeEnum[text]
      }
    },
    {
      dataIndex: 'trimReason',
      title: '调整原因',
      width: 200
    },
    {
      dataIndex: 'trimMoney',
      title: '金额',
      width: 100,
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      dataIndex: 'trimStatus',
      title: '状态',
      width: 200,
      render: (text) => {
        return TrimStatusEnum[text]
      }
    },
    {
      dataIndex: 'createName',
      title: '创建人',
      width: 150
    },
    {
      dataIndex: 'createdType',
      title: '创建人类型',
      width: 150,
      render: (text) => {
        return CreatedTypeEnum[text]
      }
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 200,
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      dataIndex: 'purchaseReviewName',
      title: '采购审核人'
    },
    {
      dataIndex: 'purchaseReviewTime',
      title: '采购审核时间',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      dataIndex: 'financeReviewName',
      title: '财务审核人'
    },
    {
      dataIndex: 'financeReviewTime',
      title: '财务审核时间',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (record) => {
        return (
          <div>
            <span
              className='href'
              onClick={() => { this.showAdjustment(record) }}
            >
              查看明细
            </span>&nbsp;&nbsp;
            {/* <span className='href'>导出</span>&nbsp;&nbsp; */}
            <span
              className='href'
              onClick={() => { this.showAdjustment(record) }}
            >
              审核
            </span>&nbsp;&nbsp;
            <Popconfirm
              title='确定是否撤销？'
              onConfirm={this.toRevoke.bind(this, record)}
            >
              <span className='href'>撤销</span>
            </Popconfirm>
            &nbsp;&nbsp;
            {/* <span className='href'>新建调整单</span> */}
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public state: State = {
    selectedRowKeys: []
  }
  /** 添加调整单 */
  public showAdjustment (record?: ListResponse) {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 600,
        title: record ? '调整单详情' : '新建调整单',
        content: (
          <Detail
            id={record && record.id}
            onOk={() => {
              this.listpage.refresh()
              hide()
            }}
            onCancel={() => {
              hide()
            }}
          />
        ),
        footer: null
      })
    }
  }
  public toRevoke (record: ListResponse) {
    api.toRevoke(record.id)
  }
  public toExport (isAll?: boolean) {
    const value =  this.listpage.form.getValues()
    api.toExport(value)
  }
  public onSelectChange = (selectedRowKeys: string[] | number[]) => {
    this.setState({
      selectedRowKeys
    })
  }
  public render () {
    const { selectedRowKeys } = this.state;
    const rowSelection: TableRowSelection<ListResponse> = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnWidth: 50
    }
    return (
      <div>
        <ListPage
          getInstance={(ref) => {
            this.listpage = ref
            // this.addAdjustment()
          }}
          rangeMap={{
            createTime: {
              fields: ['createTimeBegin', 'createTimeEnd']
            }
          }}
          columns={this.columns}
          formConfig={getFieldsConfig()}
          tableProps={{
            rowSelection
          }}
          formItemLayout={(
            <>
              <Row>
                <Col span={6}><FormItem name='id' /></Col>
                <Col span={6}><FormItem name='accId' /></Col>
                <Col span={6}><FormItem name='trimType' /></Col>
                <Col span={6}><FormItem name='purchaseReviewName' /></Col>
              </Row>
              <Row>
                <Col span={6}><FormItem name='trimStatus' /></Col>
                <Col span={6}><FormItem name='createName' /></Col>
                <Col span={6}><FormItem name='trimReason' /></Col>
                <Col span={6}><FormItem name='financeReviewName' /></Col>
              </Row>
              <Row>
                <Col span={12}><FormItem name='createTime' /></Col>
                <Col span={6}><FormItem name='createdType' /></Col>
                <Col span={6}><FormItem name='supplierName' /></Col>
              </Row>
            </>
          )}
          showButton={false}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr10'
                onClick={() => { this.listpage.fetchData() }}
              >
                查询
              </Button>
              <Button className='mr10' onClick={() => { this.listpage.refresh(true) }} >取消</Button>
              <Button
                className='mr10'
                type='primary'
                onClick={this.showAdjustment.bind(this, undefined)}
              >
                新建调整单
              </Button>
              <Button
                type='primary'
                className='mr10'
                onClick={this.toExport.bind(this, undefined)}
              >
                批量导出
              </Button>
              <Button
                type='primary'
                onClick={this.toExport.bind(this, true)}
              >
                全部导出
              </Button>
            </div>
          )}
          api={api.fetchList}
          processPayload={(payload) => {
            const status = this.props.status
            return {
              ...payload,
              pageNum: payload.page,
              page: undefined,
              trimStatus: status === 0 ? undefined : status
            }
          }}
          processData={(data) => {
            return {
              records: data.result,
              total: data.total
            }
          }}
        />
      </div>
    )
  }
}
export default Alert(Main)
