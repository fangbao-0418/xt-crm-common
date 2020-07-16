import React from 'react'
import { ListPage, Form, FormItem, Alert, If } from '@/packages/common/components'
import { getData, getDetailDataList, getDetailInfo, claim } from './api'
import { defaultConfig, NAME_SPACE } from './config'
import { Button, Modal, DatePicker, Table, Col, Row } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { download } from '@/util/utils'
import MoneyRender from '@/components/money-render'
import Upload from '@/components/upload'
import { formatPrice } from '@/util/format'

const { RangePicker } = DatePicker
interface BondState {
  visible: boolean
  dataDetail: any
  current: number
  total: number
  pageSize: number
}
/**
 * 保证金管理
 */
class Index extends React.Component<AlertComponentProps, BondState> {
  list: ListPageInstanceProps
  id: any
  form: FormInstance
  state: BondState = {
    visible: false,
    dataDetail: null,
    current: 1,
    total: 0,
    pageSize: 10
  }
  columns = [{
    title: '序号',
    dataIndex: 'id'
  }, {
    title: '商家名称',
    dataIndex: 'supplierName'
  }, {
    title: '业务类型',
    dataIndex: 'supplierCategoryDesc'
  }, {
    title: '设置时间',
    dataIndex: 'createTime',
    render: (createTime: string | number | undefined) => {
      return APP.fn.formatDate(createTime)
    }
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
                this.id=records.id
                this.setState({
                  visible: true
                }, this.handleSearch)
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
    dataIndex: 'supplierName'
  }, {
    title: '缴纳时间',
    dataIndex: 'submitTime',
    render: (submitTime: string | number | undefined) => {
      return APP.fn.formatDate(submitTime)
    }
  }, {
    title: '状态',
    dataIndex: 'syncStatusDesc'
  }, {
    title: '缴纳金额',
    dataIndex: 'submitAmount',
    render: MoneyRender
  }, {
    title: '认领金额',
    dataIndex: 'claimAmount',
    render: MoneyRender
  }, {
    title: '操作',
    render: (records: any) => {
      return (
        <>
            {
              records.syncStatus===0&&(
                <span
                  className='href ml10'
                  onClick={() => {
                    this.getDetailInfoData(records.id)
                  }}
                >
              认领
                </span>
              )
            }
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
    const { visible, dataDetail, total, pageSize, current }=this.state
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
           onCancel={()=>{
             this.setState({
               visible: false
             })
           }}
           footer={null}
         >
           <Table
             columns={this.columnsDetail}
             rowKey='id'
             dataSource={dataDetail||[]}
             pagination={{
               current,
               total,
               pageSize,
               onChange: this.handlePageChange
             }} />
         </Modal>
      </>
    )
  }
   // 分页
   handlePageChange = (page: any, pageSize: any) => {
     this.setState(
       {
         current: page,
         pageSize
       },
       this.handleSearch
     )
   };
   // 查询
   handleSearch = () => {
     const params = {
       page: this.state.current,
       pageSize: this.state.pageSize,
       depositId: this.id
     }
     getDetailDataList(params).then(res => {
       if (res) {
         this.setState({
           dataDetail: res.records,
           total: res.total
         })
       }
     })
   }
   getDetailInfoData (id: any) {
     getDetailInfo({ id }).then(res => {
       if (res) {
         this.props.alert({
           title: '认领保证金',
           content: (
             <Form
               getInstance={ref => this.form = ref}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 14 }}
               mounted={() => {
                 this.form.setValues({
                   voucherImages: this.handleFileValue(res.voucherImages)
                 })
               }}
             >
               <Row style={{ marginBottom: 10 }}>
                 <Col span={6} style={{ textAlign: 'right' }}>保证金金额：</Col>
                 <Col span={3}>{formatPrice(res.balanceAmount)}元</Col>
                 <Col span={12}>保证金差额：{formatPrice(res.diffAmount)}元</Col>
               </Row>
               <FormItem
                 placeholder='请输入认领金额'
                 name='claimAmount'
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
                       {form.getFieldDecorator('voucherImages')(
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
                       download(this.getUrl(res.invoiceUrl), '打印凭证.xls')
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
                 claim({
                   id: res.id,
                   claimAmount: vals.claimAmount
                 }).then(res => {
                   if (res) {
                     APP.success('认领成功')
                     this.list.refresh()
                     hide()
                   }
                 })
               }
             })
           }
         })
       }
     })
   }
   public handleFileValue (value: any) {
     if (value instanceof Array) {
       return value.map((item) => {
         return {
           url: item,
           name: item
         }
       })
     }
     value = value || ''
     let result: any
     try {
       result = JSON.parse(value)
       result = (result || []).map((item: any) => {
         return {
           url: item,
           name: item
         }
       })
     } catch (e) {
       try {
         result = value.split(',').map((item: any) => ({ url: item }))
       } catch (e) {
         result = undefined
       }
     }
     return result
   }
}

export default Alert(Index)