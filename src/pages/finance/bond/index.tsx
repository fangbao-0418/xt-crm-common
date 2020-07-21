import React from 'react'
import { ListPage, Form, FormItem, Alert, If } from '@/packages/common/components'
import { getData, getDetailDataList, getDetailInfo, claim } from './api'
import { defaultConfig, NAME_SPACE } from './config'
import { Icon, ConfigProvider, DatePicker, Table, Col, Row } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { download } from '@/util/utils'
import MoneyRender from '@/components/money-render'
import ModalConfig from '@/components/modalConfig'
import Upload from '@/components/upload'
import { formatPrice } from '@/util/format'
import { update } from 'lodash'

const { RangePicker } = DatePicker
interface BondState {
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
                this.handleSearch()
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
  customizeRenderEmpty = () => (
    //这里面就是我们自己定义的空状态
    <div style={{ textAlign: 'center' }}>
      <Icon type='smile' style={{ fontSize: 20 }} />
      <p>暂无数据</p>
    </div>
  );
  render () {
    return (
      <>
        <ListPage
          tableProps={{
            scroll: {
              x: true
            }
          }}
          getInstance={(ref) => {
            this.list = ref
          }}
          rangeMap={{
            createTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          formConfig={defaultConfig}
          columns={this.columns}
          api={getData}
        />
      </>
    )
  }

  showModal (txt: any, dom: any, domId: any, cd: any, cancel: any) {
    ModalConfig.show(
      {
        maskClosable: true,
        title: txt,
        width: '80%',
        onOk: cd,
        onCancel: cancel
      }, dom, domId
    )
  }

   // 分页
   handlePageChange = (page: any, pageSize: any) => {
     this.setState(
       {
         current: page,
         pageSize
       },
       ()=>this.handleSearch()
     )
   };
   // 查询
   handleSearch () {
     const { dataDetail, total, pageSize, current }=this.state
     const params = {
       page: this.state.current,
       pageSize: this.state.pageSize,
       depositId: this.id
     }
     getDetailDataList(params).then(res => {
       if (res) {
         console.log(res)
         this.setState({
           dataDetail: res.records,
           total: res.total
         }, ()=>{
           ModalConfig.show(
             {
               maskClosable: true,
               title: '供应商缴纳明细',
               width: '80%',
               footer: null
             },
             <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
               <Table
                 columns={this.columnsDetail}
                 rowKey='id'
                 dataSource={res?.records||[]}
                 pagination={{
                   current,
                   total: res?.total||0,
                   pageSize,
                   onChange: this.handlePageChange
                 }} />
             </ConfigProvider>, 'Synchronizesupplier'
           )
         })
       }
     })
   }
   getDetailInfoData (id: any) {
     getDetailInfo({ id }).then(res => {
       if (res) {
         const ok = () => {
           this.form.props.form.validateFields((err, vals) => {
             if (!err) {
               claim({
                 id: res.id,
                 claimAmount: vals.claimAmount
               }).then(res => {
                 if (res) {
                   ModalConfig.close('Synchronizesupplier1')
                   APP.success('认领成功')
                   this.handleSearch()
                 }
               })
             }
           })
         }
         const onCancel = () => {
           ModalConfig.close('Synchronizesupplier1')
         }
         this.showModal('认领保证金',
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
                     res.voucherImages.map((item: string)=>{
                       let str=item
                       const index = item.lastIndexOf('/')
                       str = item.substring(index + 1, item.length)
                       download(this.getUrl(item), str)
                     })
                   }}>
           下载
                 </div>
               </Col>
             </Row>

           </Form>
           , 'Synchronizesupplier1', ok, onCancel)
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