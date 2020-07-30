/**
 * 一次性财务结算外部明细
 */
import React from 'react'
import { ListPage, Alert, FormItem, Form, SelectFetch } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, message, Col, Row, Modal } from 'antd'
import { getFieldsConfig } from './config'
import modal, { ModalProps } from './modal'
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
  update: number
  visible:boolean
}
class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public listpagecoupon: ListPageInstanceProps
  public form: FormInstance
  public state: State = {
    detailData: null,
    update:0,
    visible:false
  }
  public columns: any = [{
    title: '门店名称',
    dataIndex: 'nickName'
  }, {
    title: '权重',
    dataIndex: 'fansTotal'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '店铺类型'
  }, {
    dataIndex: 'anchorId',
    title: '创建时间'
  }, {
    dataIndex: 'anchorLevel',
    title: '状态'
  },
  {
    title: '操作',
    render: (text: any,records: any) => {
      return (
        <>
           <span className='href' onClick={()=>{
             if(this.form){
              this.form.setValues({
                ...records
              })
             }
             this.setState({
               detailData:records,
               visible:true
             })
          }}>
          编辑 </span>
          <span
            className='href ml8' 
            onClick={() => {
              this.toggleStatus(records.id, records.status ? 0 : 1)
            }}
          >
            {status ? '关闭' : '开启'}
          </span>
          &nbsp;
        
        </>
      )
    }
  }]

  public toggleStatus (id: any, status: number){
    api.getAnchorList({
      id,
      status
    }).then((res: any) => {
      res && message.success('操作成功')
      this.refresh()
    })
  };
  public refresh () {
    this.listpage.refresh()
  }
  public handleOkModal=()=>{
    this.form.props.form.validateFields((err: any, vals: any) => {
      if (!err) {
        api.getAnchorList({
          id: vals.id,
          claimAmount: vals.claimAmount
        }).then((res: any) => {
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
                  this.setState({
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
              <FormItem name='memberId' />
              <FormItem label='店铺类型'
               inner={(form) => {
                return form.getFieldDecorator('memberId1')(
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
        title='选择商品'
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
                return form.getFieldDecorator('memberId', {
                  rules: [{
                    required: true,
                    message: '请选择店铺类型'
                  }],
                  initialValue: detailData&&detailData.memberId 
                })(
                  <SelectFetch
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
                return form.getFieldDecorator('anchorId', {
                  rules: [{
                    required: true,
                    message: '请选择店铺'
                  }],
                  initialValue: detailData&&detailData.anchorId 
                })(
                  <SelectFetch
                    placeholder= '请选择选择店铺'
                    style={{ width: 172 }}
                    fetchData={getShopTypes}
                  />
                )
               }}
             /> 
              <FormItem name='anchorLevel' required/>
              <Row>
              <Col span={6} style={{textAlign:'right'}}>
                优惠券：
              </Col>
              {
                detailData&&detailData.couponList&&detailData.couponList.length>0&&
                <Col span={14}>
                {detailData.couponList[0].code+" "+detailData.couponList[0].name }
                <span className='href ml8'
                onClick={()=>{
                  detailData.couponList.splice(0,1)
                  this.setState({
                    detailData
                  })
                }}
                >
                  删除
                </span>
              </Col>
              }
             
              </Row>
              {
                detailData&&detailData.couponList&&detailData.couponList.length>1&&detailData.couponList.map((item: any,index: number)=>{
                  return index>0&&<Row>
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
              <Col offset={6} span={14}>
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

           </Form>
   
        </Modal>
      </div>
    )
  }

}
export default modal(Main)
