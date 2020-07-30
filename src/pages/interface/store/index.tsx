/**
 * 一次性财务结算外部明细
 */
import React from 'react'
import { ListPage, Alert, FormItem, Form, SelectFetch, SearchFetch } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, message, Col, Row, Modal } from 'antd'
import { getFieldsConfig } from './config'
import modal, { ModalProps } from './modal'
import _ from 'lodash'
import * as api from './api'
import { FormInstance } from '@/packages/common/components/form'
import { getShopTypes } from '@/pages/order/api'

interface Props {
  modal: ModalProps,
  awardType: number,
  value?: any,
  disabled: boolean,
  onChange?: (result: any) => void
}
interface State{
  detailData: any
  visible:boolean

}

const formatDate = (text: string | number | undefined) =>
  text ? APP.fn.formatDate(text) : '-'

class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public listpagecoupon: ListPageInstanceProps
  public form: FormInstance
  public isEdit: boolean
  public state: State = {
    detailData: null,
    visible:false
  }
  public columns: any = [{
    title: '门店名称',
    dataIndex: 'shopName'
  }, {
    title: '权重',
    dataIndex: 'ranking'
  }, {
    dataIndex: 'shopTypeDesc',
    title: '店铺类型'
  }, {
    dataIndex: 'modifyTime',
    title: '创建时间',
    render: formatDate
  }, 
  {
    title: '操作',
    render: (_text: any,records: any) => {
      return (
        <>
           <span className='href' onClick={()=>{
             this.isEdit=true
             this.setState({
               visible:true,
               detailData:_.cloneDeep(records)
             },()=>{
               console.log(this.state.detailData)
             })
          }}>
          编辑 </span>
        </>
      )
    }
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public handleOkModal=()=>{
    const {detailData}=this.state
    this.form.props.form.validateFields((err: any, vals: any) => {
      if (!err) {
        api.ranking({shopId:detailData.shopId,...vals,couponList:detailData.couponList}).then((res: any) => {
          if (res) {
            this.setState({
              visible:false
            },()=>{
              APP.success('操作成功')
              this.refresh()
            })
          }
        })
      }
    })
  }

  public render () {
    const {visible}=this.state
    let {detailData}=this.state
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'id'
          }}
          rangeMap={{
            createTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
                  this.isEdit=false
                  this.setState({
                    detailData:null,
                    visible:true
                  })
                }}
              >
                新增
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='shopName' />
              <FormItem label='店铺类型'
               inner={(form) => {
                return form.getFieldDecorator('shopType')(
                  <SelectFetch
                    placeholder= '请选择店铺类型'
                    style={{ width: 172 }}
                    fetchData={getShopTypes}
                  />
                )
               }}
             />
              <FormItem name='createTime' />
            </>
          )}
          api={api.getAnchorList}
        />
        <Modal
        title='设置门店'
        visible={visible}
        width='60%'
        onCancel={()=>{
          this.setState({
            visible:false
          })
        }}
        destroyOnClose
        onOk={this.handleOkModal}
      >
         <Form
             getInstance={ref => this.form = ref}
             labelCol={{ span: 6 }}
             wrapperCol={{ span: 14 }}
             config={getFieldsConfig()}
             mounted={() => {
              this.form.setValues({
                ...detailData
              })
             }}
           >
             <FormItem label='店铺类型'
               required
               inner={(form) => {
                return form.getFieldDecorator('shopType', {
                  rules: [{
                    required: true,
                    message: '请选择店铺类型'
                  }],
                  initialValue: detailData&&detailData.shopTypeDsc||'全部'
                })(
                  <SelectFetch
                    readonly={this.isEdit}
                    placeholder= '请选择店铺类型'
                    style={{ width: 172 }}
                    fetchData={getShopTypes}
                  />
                )
               }}
             />
                <FormItem label='选择店铺'
               required
               inner={(form) => {
                return this.isEdit?detailData&&detailData.shopName :form.getFieldDecorator('shopId', {
                  rules: [{
                    required: true,
                    message: '请选择店铺'
                  }],
                  initialValue: detailData&&detailData.shopName 
                })(
                  <SearchFetch
                    placeholder= '请选择选择店铺'
                    style={{ width: 172 }}
                    api={async(value)=>{
                      const param=this.form&&this.form.getValues()
                      return api.searchfuzzy({shopType:param.shopType==='全部'?null:param.shopType,shopName:value})
                    }}
                  />
                )
               }}
             /> 
              <FormItem name='ranking' required/>
              <Row>
              <Col span={6} style={{textAlign:'right'}}>
                优惠券：
              </Col>
              <Col span={14}>
                <span 
                className='href'
                onClick={()=>{
                  this.props.modal.show({
                    success: (res: any, hide?: any) => {
                      detailData=detailData||{}
                      detailData.couponList=res
                      this.setState({
                        detailData
                      },()=>{
                        hide() 
                      })
                    }
                  },detailData&&detailData.couponList||[])
                }}
                >选择优惠券</span>
              </Col>
              </Row>
              {
                detailData&&detailData.couponList&&detailData.couponList.length>0&&detailData.couponList.map((_item: any,index: number)=>{
                  return <Row>
                  <Col offset={6} span={14}>
                    {detailData.couponList[index].code+" "+detailData.couponList[index].name}
                    <span
                     className='href ml8'
                    onClick={()=>{
                  detailData.couponList.splice(index,1)
                  this.setState({
                    detailData
                  })
                }}
                >
                  删除
                </span>
                  </Col>
                  </Row>
                })
              }
              <Row>
              </Row>

           </Form>
   
        </Modal>
      </div>
    )
  }

}
export default modal(Main)
