import React from 'react'
import { Card, Tabs, Table, Button, Upload } from 'antd'
import { Form, FormItem, ListPage, Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { getDefaultConfig } from './config'
import { ColumnProps } from 'antd/es/table'
import { statusEnum } from './config'
import { getPromotionDetail, getPromotionProduct } from './api'
import { parseQuery } from '@/util/utils'
import Image from '@/components/Image'
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
        bgUrl: res.bgUrl
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
                    status={activeKey}
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

interface Props extends AlertComponentProps {
  promotionId: string,
  status: string
}
interface TabItemState {
  fileList: any[]
  uploading: boolean
}
class TabItem extends React.Component<Props, TabItemState> {
  public state = {
    fileList: [],
    uploading: false
  }
  public columns: ColumnProps<any>[] = [{
    title: '序号',
    dataIndex: 'id'
  }, {
    title: '商品id',
    dataIndex: 'productId'
  }, {
    title: '商品名称',
    dataIndex: 'productName'
  }, {
    title: '商品主图',
    dataIndex: 'coverImage'
  }, {
    title: '规格信息',
    dataIndex: 'skuInfo',
    render(data) {
      return (
        <Table
          columns={[{
            title: 'SKU名称',
            dataIndex: 'skuName'
          }, {
            title: '活动价',
            dataIndex: 'price'
          }, {
            title: '活动供货价',
            dataIndex: 'salePrice'
          }, {
            title: '活动库存',
            dataIndex: 'activityStock'
          }, {
            title: '剩余库存',
            dataIndex: 'remaindStock'
          }, {
            title: '状态',
            dataIndex: 'status',
            render: (text) => {
              return statusEnum['待审核'] === text ? <span style={{ color: 'red' }}>{statusEnum[text]}</span> : statusEnum[text]
            }
          }, {
            title: '操作',
            render: (record) => {
              switch(record.status) {
                case statusEnum['拒绝']:
                  return '-'
                case statusEnum['通过']:
                  return (<span className='href'>拒绝</span>)
                case statusEnum['待审核']:
                  return (
                    <>
                      <span className='href'>通过</span>
                      <span className='href'>拒绝</span>
                    </>
                  )
              }
            }
          }]}
          dataSource={data}
        />
      )
    }
  }]
  public render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file: any) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file: any) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <ListPage
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
                    <>
                      <div>
                        <span>上传表格：</span>
                        <Upload {...props}>
                          <span className='href'>+添加表格</span>
                        </Upload>
                      </div>
                      <div>请按下载的表格模板导入，否则可能导入不成功。</div>
                    </>
                  )
                })
              }}
            >
              导入商品
            </Button>
          </>
        )}
        columns={this.columns}
        processPayload={(payload) => {
          const { status, promotionId } = this.props
          return {
            status,
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