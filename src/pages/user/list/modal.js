import React, { Component } from 'react'
import { Input, Form, Modal, Button, Upload, message } from 'antd'
import { connect } from '@/util/utils'
import { getHeaders, prefix, replaceHttpUrl, download } from '@/util/utils'
import styles from './index.module.scss'
import { namespace } from './model'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
}

@connect(state => ({
  visible: state[namespace].visible,
  excelDialogVisible: state[namespace].excelDialogVisible,
  currentUserInfo: state[namespace].currentUserInfo
}))
@Form.create()
export default class extends Component {
  state = {
    importRes: null
  }
  onCancel = () => {
    this.props.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        visible: false
      }
    })
  }

  onOk = () => {
    const { form: { validateFields }, dispatch, currentUserInfo } = this.props
    validateFields((errors, values) => {
      if (!errors) {
        dispatch[namespace].sendCode({
          memberId: currentUserInfo.id,
          num: values.num
        })
      }
    })
  }
  /** 关闭批量开启excel弹窗 */
  closeExcel = () => {
    this.props.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        excelDialogVisible: false
      }
    })
  }
  handleImportChange = info => {
    const { status, response, name } = info.file
    if (status === 'done') {
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data })
        message.success(`${name} 文件上传成功`)
      } else {
        message.error(`${response.message}`)
      }
    } else if (status === 'error') {
      message.error(`${name} 文件上传错误.`)
    }
  };
  handleDownload = () => {
    download('https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551576916792656.xlsx', '授信金额模板')
  }
  render () {
    const { form: { getFieldDecorator }, currentUserInfo } = this.props
    const { importRes } = this.state
    return (
      <>
        <Modal
          visible={this.props.visible}
          onCancel={this.onCancel}
          onOk={this.onOk}
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <FormItem label='会员名称'>
              {
                getFieldDecorator('nickName', {
                  initialValue: currentUserInfo.nickName || '喜团会员'
                })(
                  <Input disabled />
                )
              }
            </FormItem>
            <FormItem label='会员账号'>
              {
                getFieldDecorator('phone', {
                  initialValue: currentUserInfo.phone
                })(
                  <Input disabled />
                )
              }
            </FormItem>

            <FormItem label='会员等级'>
              {
                getFieldDecorator('memberType', {
                  initialValue: currentUserInfo.memberTypeDO ? currentUserInfo.memberTypeDO.value : ''
                })(
                  <Input disabled />
                )
              }
            </FormItem>
            <FormItem label='发码数量'>
              {
                getFieldDecorator('num', {
                  initialValue: '',
                  rules: [{
                    pattern: /^[1-9]\d{0,3}$/,
                    message: '发码数量为1~9999'
                  }]
                })(
                  <Input addonAfter='个' />
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={this.props.excelDialogVisible}
          title='批量开启权限、设置额度'
          footer={null}
          onCancel={this.closeExcel}
        >
          <div>
            <Upload
              className='mr10'
              name='file'
              accept='.xls,.xlsx'
              showUploadList={false}
              withCredentials={true}
              action={prefix('/member/account/groupBuy/import')}
              headers={getHeaders({})}
              onChange={this.handleImportChange}
              style={{ margin: '0 10px' }}
            >
              <Button type='primary'>导入excel表</Button>
            </Upload>
            <span
              className={styles.download}
              onClick={this.handleDownload}
            >
              下载模板
            </span>
          </div>
          <div style={{ padding: 10 }}>
            <div style={{ marginBottom: 8 }}>最多添加1000条</div>
            {importRes && <div>
              <div style={{ marginBottom: 8 }}>
                <span>成功添加</span>
                <span style={{ color: 'red' }}>{importRes.successNum}</span>
                <span>条用户数据</span>
              </div>
              <div>
                <a href={replaceHttpUrl(importRes.excelAddress)} target='_blank' rel='noopener noreferrer'>
                  失败用户清单
                </a>
              </div>
            </div>}
          </div>
        </Modal>
      </>
    )
  }
}