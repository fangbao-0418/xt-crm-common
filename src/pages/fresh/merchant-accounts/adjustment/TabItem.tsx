import React from 'react'
import { Button, Popconfirm, Row, Col, message } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Detail from './Detail'
import Auth from '@/components/auth'
import {
  getFieldsConfig,
  TrimTypeEnum,
  TrimStatusEnum,
  CreatedTypeEnum,
  TrimReasonEnum
} from './config'
import * as api from './api'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { ListResponse, ListRequest, ListRecordProps } from './interface'

interface Props extends Partial<AlertComponentProps> {
  /** 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效 */
  status: number
}

interface State {
  selectedRowKeys: any[]
}

class Main extends React.Component<Props, State> {
  public columns: ColumnProps<ListRecordProps>[] = [
    {
      dataIndex: 'serialNo',
      title: 'ID',
      width: 200
    },
    {
      dataIndex: 'billName',
      title: '名称',
      width: 200
    },
    {
      dataIndex: 'billType',
      title: '调整类型',
      width: 100,
      render: (text) => {
        return TrimTypeEnum[text]
      }
    },
    {
      dataIndex: 'billMoney',
      title: '金额',
      width: 150,
      align: 'center',
      render: (text, record) => {
        const className = record.billType === 10 ? 'success' : 'error'
        return (
          <span className={className}>
            {text !== 0 ? record.billType === 10 ? '+' : '-' : ''}
            {APP.fn.formatMoneyNumber(text, 'm2u')}
          </span>
        )
      }
    },
    {
      dataIndex: 'supplierId',
      title: '供应商ID',
      width: 150
    },
    {
      dataIndex: 'supplierName',
      title: '供应商名称',
      width: 150
    },
    {
      dataIndex: 'billStatus',
      title: '状态',
      width: 100,
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
      dataIndex: 'createType',
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
      dataIndex: 'firstVerifyName',
      title: '初审人',
      width: 150
    },
    {
      dataIndex: 'firstVerifyTime',
      title: '初审时间',
      width: 200,
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      dataIndex: 'secondVerifyName',
      title: '复审人',
      width: 150
    },
    {
      dataIndex: 'secondVerifyTime',
      title: '复审时间',
      width: 200,
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            {[
              (APP.user.menuGathers.indexOf('adjustment:procurement_audit') > -1 && [10, 20].indexOf(record.billStatus) === -1) && (
                <>
                  <span
                    className='href'
                    onClick={() => {
                      this.showAdjustment('view', record)
                    }}
                  >
                    查看明细
                  </span>
                </>
              ),
              <Auth key={2}>
                {(access: boolean, codes: string[]) => {
                  return (record.billStatus === 10 && codes.indexOf('adjustment:procurement_audit') > -1 || record.billStatus === 20 && codes.indexOf('adjustment:finance_audit') > -1) && (
                    <>
                      <span
                        className='href'
                        onClick={() => {
                          this.showAdjustment('audit', record)
                        }}
                      >
                        审核
                      </span>
                    </>
                  )
                }}
              </Auth>,
              (
                <Auth key={3} code='*'>
                  <Popconfirm
                    title='确定是否撤销？'
                    onConfirm={this.toRevoke.bind(this, record)}
                  >
                    <span className='href'>撤销</span>
                  </Popconfirm>
                </Auth>
              )
            ].map((node) => {
              return [node, <span key='span'>&nbsp;</span>]
            })}
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public payload: Partial<ListRequest>
  public state: State = {
    selectedRowKeys: []
  }
  /** 添加调整单 */
  public showAdjustment (type: 'add' | 'audit' | 'view', record?: ListRecordProps) {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 600,
        title: type !== 'add' ? '调整单详情' : '新建调整单',
        content: (
          <Detail
            type={type}
            id={record && record.serialNo}
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
  public toRevoke (record: ListRecordProps) {
    api.toRevoke(record.serialNo).then(() => {
      this.listpage.refresh()
    })
  }
  public toExport () {
    api.toSearchExport({
      ...this.payload,
      pageNum: undefined,
      pageSize: undefined
    }).then((res) => {
      return message.success('导出成功，请前往下载列表下载文件')
    })
  }
  public onSelectChange = (selectedRowKeys: string[] | number[]) => {
    this.setState({
      selectedRowKeys
    })
  }
  public render () {
    const { selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<ListResponse> = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnWidth: 50,
      fixed: true
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
          reserveKey={`adjustment${this.props.status}`}
          columns={this.columns}
          formConfig={getFieldsConfig()}
          tableProps={{
            scroll: {
              x: this.columns.map((item) => Number(item.width || 0)).reduce((a, b) => {
                return a + b
              })
            }
          }}
          formItemLayout={(
            <>
              <Row>
                <Col span={6}>
                  <FormItem label='调整单ID' name='serialNo' />
                </Col>
                <Col span={6}><FormItem name='supplierId' /></Col>
                <Col span={6}><FormItem name='supplierName' /></Col>
                <Col span={6}><FormItem name='billType' /></Col>
              </Row>
              <Row>
                <Col span={6}><FormItem name='billStatus' /></Col>
                <Col span={12}><FormItem name='createTime' /></Col>
              </Row>
            </>
          )}
          showButton={false}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr10'
                onClick={() => {
                  this.listpage.fetchData()
                }}
              >
                查询
              </Button>
              <Button
                className='mr10'
                onClick={() => {
                  this.listpage.refresh(true)
                }}
              >
                清除
              </Button>
              <Auth code='finance:trim_build'>
                <Button
                  className='mr10'
                  type='primary'
                  onClick={this.showAdjustment.bind(this, 'add', undefined)}
                >
                  新建调整单
                </Button>
              </Auth>
              <Button
                type='primary'
                className='mr10'
                onClick={this.toExport.bind(this)}
              >
                批量导出
              </Button>
              {/* <Button
                type='primary'
                onClick={this.toExport.bind(this, true)}
              >
                全部导出
              </Button> */}
            </div>
          )}
          api={api.fetchList}
          processPayload={(payload) => {
            const status = this.props.status
            this.payload = {
              ...payload,
              pageNum: payload.page,
              page: undefined,
              billStatus: payload.billStatus || (status === 0 ? undefined : status)
            }
            return this.payload
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
