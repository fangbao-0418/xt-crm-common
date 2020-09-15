import React from 'react'
import { Card, Tabs, Table, Button } from 'antd'
import { Form, FormItem, ListPage, Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { getDefaultConfig } from './config'
import { ColumnProps } from 'antd/es/table'
import { statusEnum } from './config'
import { getPromotionDetail, getPromotionProduct, auditSku, exportVenue, importAuditSku } from './api'
import { parseQuery } from '@/util/utils'
import Image from '@/components/Image'
import Modal from 'antd/es/modal'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Upload from '@/components/upload/file'
const { TabPane } = Tabs

const tabConfig = [{
  label: '所有商品',
  value: '-1'
}, {
  label: '待审核',
  value: '0'
}, {
  label: '审核通过',
  value: '1'
}, {
  label: '审核拒绝',
  value: '2'
}]
interface State {
  activeKey: string
  productCount: number
  skuCount: number
  passSkuCount: number
  rejectSkuCount: number
  totalStock: number
  iconUrl: string
  bgUrl: string
}
class Main extends React.Component<{}, State> {
  public formRef: FormInstance
  public state = {
    activeKey: '-1',
    productCount: 0,
    skuCount: 0,
    passSkuCount: 0,
    rejectSkuCount: 0,
    totalStock: 0,
    iconUrl: '',
    bgUrl: ''
  }
  public promotionId = (parseQuery() as any).promotionId
  public componentDidMount() {
    this.fetchData()
  }
  /** 会场活动详情 */
  public fetchData = async () => {
    if (this.promotionId) {
      const res = await getPromotionDetail(this.promotionId)
      this.formRef.setValues(res)
      this.setState({
        iconUrl: res.iconUrl,
        bgUrl: res.bgUrl,
        productCount: res.productCount,
        skuCount: res.skuCount,
        passSkuCount: res.passSkuCount,
        rejectSkuCount: res.rejectSkuCount,
        totalStock: res.totalStock
      })
    }
  }
  public onTabChange = (key: string) => {
    this.setState({
      activeKey: key
    })
  }
  public render () {
    const { activeKey, productCount, skuCount, passSkuCount, rejectSkuCount, totalStock } = this.state
    return (
      <Card title='前端会场设置'>
        <Form
          getInstance={(ref) => {
            this.formRef = ref
          }}
          config={getDefaultConfig()}
        >
          <FormItem name='title' type='text' />
          <FormItem label='会场图标'>
            <Image src={this.state.iconUrl} />
          </FormItem>
          <FormItem label='会场背景图'>
            <Image src={this.state.bgUrl} />
          </FormItem>
          <FormItem name='tags' />
          <FormItem name='venueDescription' />
          <Tabs
            activeKey={activeKey}
            onChange={this.onTabChange}
          >
            {tabConfig.map((item: any) => {
              return (
                <TabPane tab={item.label} key={item.value}>
                  <div>
                    已报名商品列表 （ 已报名
                    <span style={{ color: 'red' }}>{productCount}</span>
                    款 sku
                    <span style={{ color: 'red' }}>{skuCount}</span>
                    款 审核通过sku
                    <span style={{ color: 'red' }}>{passSkuCount}</span>
                    款 审核拒绝sku
                    <span style={{ color: 'red' }}>{rejectSkuCount}</span>
                    款 可供总库存：
                    <span style={{ color: 'red' }}>{totalStock}</span>
                    个）
                  </div>
                  <AlertTabItem
                    promotionId={this.promotionId}
                    refresh={this.fetchData}
                    auditStatus={activeKey}
                  />
                </TabPane>
              )
            })}
          </Tabs>
        </Form>
      </Card>
    )
  }
}

/** 0-待审核，1-审核通过，2-审核拒绝 */
type AuditStatus = 0 | 1 | 2
interface Props extends AlertComponentProps {
  promotionId: string,
  auditStatus: string,
  refresh: () => void
}
interface TabItemState {
  fileList: any[]
}
class TabItem extends React.Component<Props, TabItemState> {
  public listRef: ListPageInstanceProps
  public state = {
    fileList: []
  }
  // 审核通过或者拒绝
  public handleAudit = (auditStatus: AuditStatus, record: any) => {
    const msg = auditStatus === 1 ? '通过' : '拒绝'
    Modal.confirm({
      title: '提示',
      content: `是否确认${msg}`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await auditSku({
          auditStatus,
          promotionId: this.props.promotionId,
          skuId: record.skuId
        })
        if (res) {
          APP.success(`${msg}成功`)
          this.listRef.refresh()
          this.props.refresh()

        }
      }
    })
  }
  public formRef: FormInstance
  public columns: ColumnProps<any>[] = [{
    title: '商品id',
    dataIndex: 'productId'
  }, {
    title: '商品名称',
    dataIndex: 'productName'
  }, {
    title: '商品主图',
    dataIndex: 'coverUrl',
    render: (text) => {
      return (
        <Image src={text} />
      )
    }
  }, {
    title: '规格信息',
    dataIndex: 'skuList',
    render: (data) => {
      return (
        <Table
          columns={[{
            title: 'SKU名称',
            dataIndex: 'property'
          }, {
            title: '活动价',
            dataIndex: 'salePrice'
          }, {
            title: '活动供货价',
            dataIndex: 'promotionCostPrice'
          }, {
            title: '活动库存',
            dataIndex: 'inventory'
          }, {
            title: '剩余库存',
            dataIndex: 'remainInventory'
          }, {
            title: '状态',
            dataIndex: 'auditStatus',
            render: (text) => {
              return statusEnum['待审核'] === text ? <span style={{ color: 'red' }}>{statusEnum[text]}</span> : statusEnum[text]
            }
          }, {
            title: '操作',
            render: (record) => {
              switch(record.auditStatus) {
                case statusEnum['审核拒绝']:
                  return '-'
                case statusEnum['审核通过']:
                  return (
                    <span
                      className='href'
                      onClick={this.handleAudit.bind(null, 2, record)}
                    >拒绝</span>
                  )
                case statusEnum['待审核']:
                  return (
                    <>
                      <span
                        className='href'
                        onClick={this.handleAudit.bind(null, 1, record)}
                      >通过</span>
                      <span
                        className='href ml10'
                        onClick={this.handleAudit.bind(null, 2, record)}
                      >拒绝</span>
                    </>
                  )
              }
            }
          }]}
          dataSource={data}
          pagination={false}
        />
      )
    }
  }]
  /**
   * 导出
   */
  public handleExport = async () => {
    const res = await exportVenue(this.props.promotionId)
    console.log('res', res)
  }
  public render() {
    return (
      <ListPage
        getInstance={(ref) => {
          this.listRef = ref
        }}
        formConfig={getDefaultConfig()}
        namespace='detailFormConfig'
        formItemLayout={(
          <>
            <FormItem name='productId' />
            <FormItem name='productName' />
          </>
        )}
        addonAfterSearch={(
          <>
            <Button
              type='primary'
              ghost
              onClick={this.handleExport}
            >
              导出商品
            </Button>
            <Button
              type='primary'
              ghost
              className='ml10'
              onClick={() => {
                this.props.alert({
                  title: '导入商品',
                  content: (
                    <Form
                      getInstance={(ref) => {
                        this.formRef = ref
                      }}
                    >
                      <FormItem
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        required
                        label='上传表格'
                        inner={(form) => {
                          return (
                            <>
                              {form.getFieldDecorator('file', {
                                rules: [{
                                  required: true,
                                  message: '请上传表格'
                                }]
                              })(
                                <Upload
                                  listType='text'
                                  listNum={1}
                                  accept='doc,xls'
                                  size={10}
                                  extname='xls,xlsx'
                                  fileTypeErrorText='请上传正确xls格式文件'
                                >
                                  <span className='href'>+添加表格</span>
                                </Upload>
                              )}
                              <div>请按下载的表格模板导入，否则可能导入不成功。</div>
                            </>
                          )
                        }}
                      />
                    </Form>
                  ),
                  onOk: (hide) => {
                    this.formRef.props.form.validateFields(async (err, vals) => {
                      if (!err) {
                        const res = await importAuditSku({
                          file: vals.file[0].file,
                          promotionId: this.props.promotionId
                        })
                        if (res) {
                          APP.success('导入商品成功')
                          hide()
                          this.listRef.refresh()
                        }
                      }
                    })
                  }
                })
              }}
            >
              导入商品
            </Button>
          </>
        )}
        columns={this.columns}
        processPayload={(payload) => {
          const { auditStatus, promotionId } = this.props
          return {
            auditStatus,
            promotionId,
            ...payload
          }
        }}
        api={getPromotionProduct}
      />
    )
  }
}

const AlertTabItem = Alert(TabItem)


export default Main