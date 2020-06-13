import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Popconfirm, Button, Radio } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import UploadView from '@/components/upload'
import { exportFile } from '@/util/fetch'
import If from '@/packages/common/components/if'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  state = {
    errorUrl: null
  }
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '账务结算ID',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '收支类型',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '账务金额',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  }, {
    dataIndex: 'anchorId',
    title: '账务对象类型',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'anchorLevel',
    title: '账务对象ID',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '账务对象名称',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '原因',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '创建方式',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '审核状态',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <span className='href'>查看</span>
          <span className='href'>审核</span>
        </div>
      )
    }
  }]
  public refresh () {
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
              const operateRemark = values.operateRemark
              api.addAnchor({
              }).then(() => {
                hide()
                this.listpage.refresh()
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
              api.addAnchor({
              }).then(() => {
                hide()
                this.listpage.refresh()
              })
            })
          }
        }
      })
    }
  }
  public render () {
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
            rowKey: 'anchorId'
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={this.toOperate()}
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
              <FormItem name='memberId' />
              <FormItem name='nickName' />
              <FormItem name='anchorLevel' />
              <FormItem name='status' />
              <FormItem name='status1' />
              <FormItem name='status2' />
            </>
          )}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
