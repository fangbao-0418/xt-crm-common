import React, { Component } from 'react';
import { Form, Modal, Button, Input, Radio, message } from 'antd';
import If from '@/packages/common/components/if';
import UploadView from '@/components/upload';
import { exportFile } from '@/util/fetch';
import * as api from '../../api'

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class extends Component {
  state = {
    importRes: null,
    errorUrl: ''
  }

  handleImportChange = info => {
    const { status, response, name } = info.file;
    if (status === 'done') {
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data })
        message.success(`${name} 文件上传成功`);
      } else if (/^url:/.test(response.message)) {
        const errorUrl = response.message.split(':')[1]
        this.setState({
          errorUrl
        })
      } else {
        message.error(`${response.message}`);
      }
    } else if (status === 'error') {
      message.error(`${name} 文件上传错误.`);
    }
  };

  handBeforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 2) {
      message.warn('上传文件不能超过2M');
      return false
    }
  }

  handlePayConfirm = (id) => () => {
    const {
      form: { validateFields },
      handleFailConfirm,
      isBatchFail
    } = this.props;
    validateFields((err, { files, remark, sendMsg }) => {
      if (err) return
      const params = {
        id,
        remark,
        sendMsg
      }

      let fn = 'paymentFail'

      if (isBatchFail) {
        // 批量支付
        params.fileUrl = files[0].url.replace('https://assets.hzxituan.com/finance/payment/', '')
        params.fileName = files[0].name
        fn = 'paymentBatchFail'
      }
      api[fn](params).then(res => {
        res && handleFailConfirm()
      })
    });
  }

  render() {
    const { modalProps = {}, form: { getFieldDecorator }, isBatchFail, record } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Modal
        {...modalProps}
        title='支付失败'
        footer={null}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <If condition={isBatchFail}>
            <FormItem label="上传文件" extra="(请控制文件大小在2mb内)">
              {getFieldDecorator('files', {
                rules: [
                  {
                    required: isBatchFail,
                    message: '请上传文件',
                  },
                ],
              })(
                <UploadView
                  placeholder='请上传文件'
                  listNum={1}
                  size={2}
                  ossDir="finance/payment"
                >
                  <Button type='primary'>导入excel表</Button>{' '}
                  <span
                    className="href"
                    onClick={(e) => {
                      e.stopPropagation()
                      APP.fn.download(require('@/assets/files/批量支付失败模板.xlsx'), '批量失败模版')
                    }}
                  >
                    下载模板
                  </span>
                </UploadView>
              )}
              <If condition={this.state.errorUrl}>
                <div>上传失败 <span className="href" onClick={() => {
                  exportFile(this.state.errorUrl)
                }}>下载</span></div>
              </If>
            </FormItem>
          </If>
          <FormItem label="失败原因">
            {getFieldDecorator('remark', {
              rules: [
                {
                  validator: (rule, value, cb) => {
                    if (!value) {
                      cb('请输入至少一个字符')
                      return
                    }
                    if (value.trim().length > 30) {
                      cb('不能超过30个字符')
                      return
                    }
                    cb()
                  }
                },
              ],
            })(
              <TextArea
                placeholder="请输入失败原因，30字内"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            )}
          </FormItem>
          <FormItem label="发送短信">
            {getFieldDecorator('sendMsg', {
              rules: [
                {
                  required: true,
                  message: '请选择是否发送短信',
                },
              ],
            })(
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: '20px'
            }}
          >
            <Button
              type="primary"
              onClick={this.handlePayConfirm(record?.id)}
            >
              确认
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}