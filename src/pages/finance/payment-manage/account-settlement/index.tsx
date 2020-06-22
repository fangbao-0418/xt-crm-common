/**
 * 账务结算（一次性账务结算）
 */
import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Select, Button, Radio } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { ColumnProps } from 'antd/lib/table'
import UploadView from '@/components/upload'
import { exportFile } from '@/util/fetch'
import If from '@/packages/common/components/if'
import { getFieldsConfig } from './config'
import * as api from './api'
import moment from 'moment'
interface Props extends AlertComponentProps {
}
const dateFormat = 'YYYY-MM-DD HH:mm'
const getFormatDate = (s: any, e: any) => {
  return e ? [moment(s, dateFormat), moment(e, dateFormat)] : []
}
class Main extends React.Component<Props> {
  state = {
    errorUrl: null,
    selectedRowKeys: null

  }
  public listpage: ListPageInstanceProps
  public columns: any = [{
    title: '账务结算ID',
    dataIndex: 'id',
    width: 150
  }, {
    title: '收支类型',
    dataIndex: 'inOrOutTypeDesc',
    width: 150,
    align: 'center'
  }, {
    dataIndex: 'amount',
    title: '账务金额',
    width: 100
  }, {
    dataIndex: 'subjectTypeDesc',
    title: '账务对象类型',
    width: 150,
    align: 'center'
  }, {
    dataIndex: 'subjectId',
    title: '账务对象ID',
    width: 150
  }, {
    dataIndex: 'subjectName',
    title: '账务对象名称',
    width: 150
  }, {
    dataIndex: 'applicationRemark',
    title: '原因',
    width: 100
  }, {
    dataIndex: 'settlementTypeDesc',
    title: '创建方式',
    width: 100
  }, {
    dataIndex: 'auditStatusDesc',
    title: '审核状态',
    width: 100
  }, {
    dataIndex: 'settlementStatusDesc',
    title: '结算状态',
    width: 100
  }, {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 100
  }, {
    dataIndex: 'creator',
    title: '创建人',
    width: 100
  }, {
    dataIndex: 'auditFinishTime',
    title: '完成时间',
    width: 100
  }, {
    dataIndex: 'auditor',
    title: '操作人',
    width: 100
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    align: 'center',
    render: (text: any, record: any) => {
      return record.auditStatus===0 ? <span
        className='href'
        onClick={
          this.getDetailData(2, record.id)
        }>审核
      </span>: <span
        className='href'
        onClick={
          this.getDetailData(3, record.id)
        }
      > 查看
      </span>
    }
  }]
  public refresh () {
    this.listpage.form.setValues({
      time: getFormatDate(new Date(((new Date()).getTime())-30*24*3600*1000), new Date(((new Date()).getTime())+3600*1000))
    })
    this.listpage.refresh()
  }
  public toOperate = () => () => {
    if (this.props.alert) {
      let form: FormInstance
      const hide = this.props.alert({
        title: '批量审核（请谨慎操作，操作不可逆）',
        content: (
          <Form
            getInstance={(ref) => {
              form = ref
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
          >
            <FormItem
              label='审核意见'
              verifiable
              inner={(form) => {
                return (form.getFieldDecorator('file')(
                  <Radio.Group>
                    <Radio value={1}>审核通过</Radio>
                    <Radio value={2}>审核不通过</Radio>
                  </Radio.Group>
                )
                )
              }}
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '审核意见必填' }
                ]
              }}
            />
            <FormItem
              style={{
                marginBottom: 0
              }}
              label='原因'
              type='textarea'
              name='operateRemark'
              placeholder='请输入原因，140字以内'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '原因必填' },
                  { max: 140, message: '原因最长140个字符' }
                ]
              }}
            />
          </Form>
        ),
        onOk: () => {
          if (form) {
            form.props.form.validateFields((err, values) => {
              if (err) {
                return
              }
              api.add({
              }).then(() => {
                hide()
                this.refresh()
              })
            })
          }
        }
      })
    }
  }

  public batchOperation = () => () => {
    if (this.props.alert) {
      let form: FormInstance
      const hide = this.props.alert({
        title: '批量创建账务结算单',
        content: (
          <Form
            getInstance={(ref) => {
              form = ref
            }}
          >
            <FormItem
              label='上传文件'
              extra='(请控制文件大小在10mb内)'
              inner={(form) => {
                return (form.getFieldDecorator('file')(
                  <div>
                    <UploadView
                      placeholder='请上传文件'
                      listNum={1}
                      size={2}
                      ossDir='finance/payment'
                    >
                      <span className={'href'}>+添加文件</span>
                    </UploadView>
                    <div style={{ color: '#999' }}>（支持xls、xlsx，大小请控制在10MB）</div>
                    <If condition={this.state.errorUrl?true:false}>
                      <div>
                       上传失败
                        <span className='href' onClick={() => {
                          exportFile(this.state.errorUrl)
                        }}>下载
                        </span>
                      </div>
                    </If>
                  </div>
                )
                )
              }}
            />
          </Form>
        ),
        onOk: () => {
          if (form) {
            form.props.form.validateFields((err, values) => {
              if (err) {
                return
              }
              const operateRemark = values.operateRemark
              api.add({
              }).then(() => {
                hide()
                this.refresh()
              })
            })
          }
        }
      })
    }
  }
  public validateSubjectId (form: any) {
    const values = (form && form.getValues())||{}
    const subjectId = values.subjectId
    const subjectType = values.subjectType
    if (!subjectId) {
      APP.error('请输入账务对象ID')
      return
    }
    if (!subjectType) {
      APP.error('请选择账务对象类型 ')
      return
    }
    const params={ subjectId, subjectType }
    api.checkSubject(params).then((res: any) => {
      APP.success('校验通过')
      form.setValues({
        subjectName: res
      })
    })
  }
  public getDetailData = (type: any, id: any) => () => {
    api.getDetail(id).then((res: any) => {
      this.operation(type, res)
    })
  }
  //type 1添加，2审核， 3查看
  public operation (type: any, res: any) {
    const readonly=type !== 1
    const uploadProps = readonly ? { showUploadList: { showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: false } } : { listNum: 5 }
    if (this.props.alert) {
      let form: FormInstance
      const hide = this.props.alert({
        title: '创建账务结算单',
        width: 700,
        content: (
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            getInstance={(ref) => {
              form = ref
              if (res) {
                setTimeout(() => {
                  console.log(res, 'record')
                  form.setValues(res)
                }, 100)
              }
            }}
            readonly={readonly}
            onChange={(filed, value) => {
              if (filed === 'subjectId'&&type===1) {
                form.setValues({
                  subjectName: null
                })
              }
            }}
          >
            <FormItem
              label='收支类型'
              verifiable
              inner={(form) => {
                return readonly?res.inOrOutTypeDesc: (form.getFieldDecorator('inOrOutType')(
                  <Select placeholder='请选择收支类型' allowClear >
                    <Select.Option value={1}>收入</Select.Option>
                    <Select.Option value={2}>支出</Select.Option>
                  </Select>
                )
                )
              }}
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '收支类型必填' }
                ]
              }}
            />
            <FormItem
              label='账务对象类型'
              verifiable
              inner={(form) => {
                return readonly?res.subjectTypeDesc:(form.getFieldDecorator('subjectType')(
                  <Select placeholder='请选择账务对象类型' allowClear >
                    <Select.Option value={1}>普通供应商</Select.Option>
                    <Select.Option value={2}>喜团小店</Select.Option>
                  </Select>
                )
                )
              }}
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '账务对象类型必填' }
                ]
              }}
            />
            <FormItem
              label='账务对象ID'
              type='input'
              name='subjectId'
              placeholder='请输入账务对象ID'
              verifiable
              wrapperCol={{
                span: readonly ? 12 : 10
              }}
              addonAfterCol={{ span: 6 }}
              addonAfter={(!readonly) && (
                <Button
                  className='ml10'
                  onClick={()=>{
                    this.validateSubjectId(form)
                  }}
                >
                  校验
                </Button>
              )}
            />
            <FormItem
              label='账务对象名称'
              type='input'
              verifiable
              name='subjectName'
              disabled={true}
              placeholder='请输入账务对象ID后进行校验'
            />
            <FormItem
              label='账务金额'
              type='number'
              name='amount'
              controlProps={{
                precision: 2,
                min: 0,
                max: 100000000,
                style: {
                  width: 240
                }
              }}
              placeholder='请输入金额，精确到小数点后两位'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '账务金额必填' }
                ]
              }}
            />
            <FormItem
              style={{
                marginBottom: 0
              }}
              label='原因'
              type='textarea'
              name='applicationRemark'
              placeholder='请输入原因，140字以内'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '原因必填' },
                  { max: 140, message: '原因最长140个字符' }
                ]
              }}
            />
            <FormItem
              label='凭证'
              inner={(form) => {
                return (
                  <div>
                    {
                      form.getFieldDecorator('evidenceDocUrlList')(
                        <UploadView
                          multiple
                          disabled={readonly}
                          listType='text'
                          listNum={3}
                          accept='doc,xls'
                          size={10}
                          extname='doc,docx,xls,xlsx'
                          fileTypeErrorText='请上传正确doc、xls格式文件'
                        >
                          <span className={readonly ? 'disabled' : 'href'}>+请选择文件</span>
                        </UploadView>
                      )
                    }
                    <div style={{ color: '#999', fontSize: 10 }}>（支持xls、xlsx、word格式，大小请控制在10MB，最多可上传2个文件）</div>
                    <If condition={this.state.errorUrl?true:false}>
                      <div>
                       上传失败
                        <span className='href' onClick={() => {
                          exportFile(this.state.errorUrl)
                        }}>下载
                        </span>
                      </div>
                    </If>
                  </div>
                )
              }}
            />
            <FormItem
              label='图片'
              inner={(form) => {
                return (
                  <div>
                    {
                      form.getFieldDecorator('evidenceImgUrlList')(
                        <UploadView
                          {...uploadProps}
                          placeholder='上传凭证'
                          listType='picture-card'
                          size={2}
                          disabled={readonly}
                          fileType={['jpg', 'jpeg', 'gif', 'png']}
                          multiple
                        />
                      )
                    }
                    <div style={{ color: '#999', fontSize: 10 }}>（支持jpg、jpeg、png格式，最大2mb，最多可上传5张）</div>
                  </div>
                )
              }}
            />
            {
              <If condition={readonly}>
                <div>
                  <div style={{ borderBottom: '1px solid #333', padding: 8, marginBottom: 15 }}>
                 审核
                  </div>
                  <FormItem
                    label='审核意见'
                    verifiable
                    inner={(form) => {
                      return (form.getFieldDecorator('auditStatus')(
                        <Radio.Group disabled={type===3}>
                          <Radio value={1}>审核通过</Radio>
                          <Radio value={2}>审核不通过</Radio>
                        </Radio.Group>
                      )
                      )
                    }}
                    fieldDecoratorOptions={{
                      rules: [
                        { required: true, message: '审核意见必填' }
                      ]
                    }}
                  />
                  <FormItem
                    style={{
                      marginBottom: 0
                    }}
                    label='原因'
                    verifiable
                    inner={(form) => {
                      return (form.getFieldDecorator('operateRemark')(
                        <TextArea disabled={type===3} placeholder='请输入原因，140字以内' />
                      )
                      )
                    }}
                    fieldDecoratorOptions={{
                      rules: [
                        { required: true, message: '原因必填' },
                        { max: 140, message: '原因最长140个字符' }
                      ]
                    }}
                  />
                </div>

              </If>
            }
          </Form>
        ),
        onOk: () => {
          if (form&&type!==3) {
            form.props.form.validateFields((err, value) => {
              if (err) {
                return
              }
              if (type===1) {
                value.evidenceDocUrlList = (value.evidenceDocUrlList || []).map((item: {name: string, rurl: string}) => {
                  return {
                    url: item.rurl,
                    name: item.name
                  }
                })
                value.evidenceImgUrlList = (value.evidenceImgUrlList || []).map((item: {name: string, rurl: string}) => {
                  return {
                    url: item.rurl,
                    name: item.name
                  }
                })
                api.add(value).then(() => {
                  hide()
                  this.refresh()
                })
              } else if (type===2) {
                const param={ id: res.id, auditStatus: value.auditStatus, auditDesc: value.auditDesc }
                api.audit(param).then(() => {
                  hide()
                  this.refresh()
                })
              }

            })

          }
        }
      })
    }
  }
   public handleSelectionChange = (selectedRowKeys: any) => {
     this.setState({
       selectedRowKeys
     })
   }
   public render () {
     const { selectedRowKeys } = this.state
     const rowSelection = {
       selectedRowKeys,
       onChange: this.handleSelectionChange,
       getCheckboxProps: (record: any) => ({
         disabled: record.status === 1
       })
     }
     return (
       <div
         style={{
           background: '#FFFFFF'
         }}
       >
         <ListPage
           getInstance={(ref) => this.listpage = ref}
           columns={this.columns}
           rowSelection={rowSelection}
           mounted={() => {
             this.listpage.form.setValues({
               time: getFormatDate(new Date(((new Date()).getTime())-30*24*3600*1000), new Date(((new Date()).getTime())+3600*1000))
             })
           }}
           tableProps={{
             rowKey: 'anchorId',
             scroll: {
               x: this.columns.reduce((a: any, b:any) => {
                 return (typeof a === 'object' ? a.width : a) as any + b.width
               }) as number
             }
           }}
           rangeMap={{
             time: {
               fields: ['startTime', 'endTime']
             }
           }}
           addonAfterSearch={(
             <div>
               <Button
                 type='primary'
                 onClick={()=>{
                   this.operation(1, null)
                 }}
               >
                创建账务结算单
               </Button>
               <Button
                 type='primary'
                 className='ml8 mr8'
                 onClick={this.batchOperation()}
               >
                批量创建账务结算单
               </Button>
               <Button
                 type='primary'
                 onClick={this.toOperate()}
               >
                批量审核
               </Button>
             </div>
           )}
           formConfig={getFieldsConfig()}
           formItemLayout={(
            <>
              <FormItem name='id' />
              <FormItem name='subjectId' />
              <FormItem name='subjectName' />
              <FormItem name='auditStatus' />
              <FormItem name='inOrOutType' />
              <FormItem name='settlementStatus' />
              <FormItem name='time' />
              <FormItem name='settlementType' />
            </>
           )}
           api={api.getList}
         />
       </div>
     )
   }
}
export default Alert(Main)
