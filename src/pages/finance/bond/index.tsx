import React from 'react'
import { ListPage, Form, FormItem, Alert, If } from '@/packages/common/components'
import { getSummary, getData, cancelRemittance, applyVoucher } from './api'
import { defaultConfig, NAME_SPACE } from './config'
import { Button, Modal, DatePicker, Table, Col, Row } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { download } from '@/util/utils'
import Upload from '@/components/upload'

const { RangePicker } = DatePicker
interface BondState {
  visible: boolean
  dataDetail: any
}
/**
 * 保证金管理
 */
class Index extends React.Component<AlertComponentProps, BondState> {
  list: ListPageInstanceProps
  form: FormInstance
  state: BondState = {
    visible: false,
    dataDetail: null
  }
  columns = [{
    title: '序号',
    dataIndex: 'transferNo'
  }, {
    title: '商家名称',
    dataIndex: 'moneyAccountTypeDesc'
  }, {
    title: '业务类型',
    dataIndex: 'memberMobile'
  }, {
    title: '设置时间',
    dataIndex: 'createTime'
  }, {
    title: '操作',
    fixed: 'right',
    align: 'center',
    render: (records: any) => {
      return (
        <>
            <span
              className='href ml10'
              onClick={() => {
                this.setState({
                  visible: true
                }, ()=>{
                  getData({}).then(res => {
                    if (res) {
                      this.setState({
                        dataDetail: res.records
                      })
                    }
                  })
                })
              }}
            >
              查看
            </span>
        </>
      )
    }
  }]
  columnsDetail = [{
    title: '供应商名称',
    dataIndex: 'transferNo'
  }, {
    title: '缴纳时间',
    dataIndex: 'moneyAccountTypeDesc'
  }, {
    title: '状态',
    dataIndex: 'memberMobile'
  }, {
    title: '缴纳金额',
    dataIndex: 'createTime'
  }, {
    title: '认领金额',
    dataIndex: 'createTime'
  }, {
    title: '操作',
    render: (records: any) => {
      return (
        <>
            <span
              className='href ml10'
              onClick={() => {
                const hid=this.props.alert({
                  title: '认领保证金',
                  content: (

                    <Form
                      getInstance={ref => this.form = ref}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 14 }}
                    >
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={6} style={{ textAlign: 'right' }}>保证金金额：</Col>
                        <Col span={3}>3000元</Col>
                        <Col span={12}>保证金差额：100元</Col>
                      </Row>
                      <FormItem
                        placeholder='请输入认领金额'
                        name='remark'
                        label='认领金额'
                        type='number'
                        verifiable
                        fieldDecoratorOptions={{
                          rules: [{
                            required: true,
                            message: '请输入认领金额'
                          }]
                        }}
                        controlProps={{
                          precision: 2,
                          min: 0,
                          max: 100000000,
                          maxLength: 9,
                          style: { width: 200 }
                        }}
                      />
                      <FormItem
                        label='打款凭证'
                        inner={(form) => {
                          return (
                            <div>
                              {form.getFieldDecorator('trimImgUrl')(
                                <Upload
                                  listType='picture-card'
                                  multiple
                                  disabled={true}
                                  extname='png,jgp,jpeg'
                                >
                                </Upload>
                              )}
                            </div>
                          )
                        }}
                      />
                      <Row style={{ marginBottom: 10 }}>
                        <Col offset={6} >
                          <div
                            className='href'
                            onClick={() => {
                              download(this.getUrl(records.invoiceUrl), '打印凭证.xls')
                            }}>
                        下载
                          </div>
                        </Col>
                      </Row>

                    </Form>
                  ),
                  onOk: (hide) => {
                    this.form.props.form.validateFields((err, vals) => {
                      if (!err) {
                        cancelRemittance({
                          id: records.id,
                          remark: vals.remark
                        }).then(res => {
                          if (res) {
                            APP.success('取消提现成功')
                            this.list.refresh()
                            hide()
                          }
                        })
                      }
                    })
                  }
                })
              }}
            >
              认领
            </span>
        </>
      )
    }
  }]
  getUrl (url: string) {
    url = (/^http/).test(url) ? url : `https://assets.hzxituan.com/${url}`
    return url
  }
  componentDidMount () {
    if (this.list) {
      this.list.refresh()
    }
  }
  render () {
    const { visible, dataDetail }=this.state
    return (
      <>
        <ListPage
          autoFetch={false}
          tableProps={{
            scroll: {
              x: true
            }
          }}
          getInstance={(ref) => {
            this.list = ref
          }}
          formConfig={defaultConfig}
          columns={this.columns}
          api={getData}
        />
         <Modal
           title='供应商缴纳明细'
           visible={visible}
           width='70%'
         >
           <Table
             columns={this.columnsDetail}
             pagination={false}
             dataSource={dataDetail||[]} />
         </Modal>
      </>
    )
  }
}

export default Alert(Index)