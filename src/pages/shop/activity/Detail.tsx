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
  status?: number
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
    status: undefined,
    iconUrl: '',
    bgUrl: ''
  }
  public tabItem: TabItem
  public promotionId = (parseQuery() as any).promotionId
  public componentDidMount() {
    this.fetchData()
    this.tabItem.listRef.refresh()
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
        totalStock: res.totalStock,
        status: res.status
      })
    }
  }
  public onTabChange = (key: string) => {
    this.setState({
      activeKey: key
    }, () => {
      this.tabItem.listRef.refresh()
    })
  }
  public render () {
    const { activeKey, productCount, skuCount, passSkuCount, rejectSkuCount, totalStock } = this.state
    return (
      <Form
        getInstance={(ref) => {
          this.formRef = ref
        }}
        config={getDefaultConfig()}
      >
        <Card title='活动介绍'>
          <FormItem name='title' type='text' />
          <FormItem name='description' type='text' />
          <FormItem name='applyTime' />
          <FormItem name='' />
          <FormItem />
        </Card>
        <Card title='活动规则和要求'></Card>
        <Card title='前端会场设置'>
        <FormItem name='name' />
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
                  getInstance={(tabItem: any) => this.tabItem = tabItem }
                  promotionId={this.promotionId}
                  refresh={this.fetchData}
                  auditStatus={activeKey}
                  status={this.state.status}
                />
              </TabPane>
            )
          })}
        </Tabs>
        </Card>
      </Form>
    )
  }
}

/** 0-待审核，1-审核通过，2-审核拒绝 */
type AuditStatus = 0 | 1 | 2
interface Props extends AlertComponentProps {
  promotionId: string,
  auditStatus: string,
  refresh: () => void
  getInstance: (ref: any) => void
  /**  全部 = 0, 待发布 = 1, 已发布 = 2, 报名中 = 3, 预热中 = 4, 进行中 = 5, 已结束 = 6, 已关闭 = 7, 未开始 = 8 */
  status?: number
}
interface TabItemState {
  fileList: any[]
}
class TabItem extends React.Component<Props, TabItemState> {
  public listRef: ListPageInstanceProps
  public constructor(props: Props) {
    super(props)
    props.getInstance(this)
  }
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
            dataIndex: 'salePrice',
            render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
          }, {
            title: '活动供货价',
            dataIndex: 'promotionCostPrice',
            render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
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
              if (!!this.props.status && [6, 7].includes(this.props.status)) {
                return '-'
              }
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
                  // 已结束、已关闭状态不能审核，拒绝操作
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
        autoFetch={false}
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
              // 已结束、已关闭状态不能导入审核
              disabled={!!this.props.status && [6, 7].includes(this.props.status)}
              onClick={() => {
                this.props.alert({
                  title: '导入审核',
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
                          APP.success('导入成功')
                          hide()
                          this.listRef.refresh()
                        }
                      }
                    })
                  }
                })
              }}
            >
              导入审核
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