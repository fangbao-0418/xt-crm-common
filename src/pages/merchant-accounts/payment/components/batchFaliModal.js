import React, { Component } from 'react';
import { Form, Modal, Button, Input, Radio, message, Upload } from 'antd';
import If from '@/packages/common/components/if';
import { getHeaders, prefix, replaceHttpUrl } from '@/util/utils'
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
      handleFailConfirm
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        api.paymentFail({
          ...vals,
          id
        }).then(res => {
          res && handleFailConfirm()
        })
      }
    });
  }

  render() {
    const { importRes } = this.state
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
            <FormItem label="上传文件">
              <Upload
                className='mr10'
                name='file'
                accept='.xls,.xlsx'
                showUploadList={false}
                withCredentials={true}
                action={prefix('/finance/payment/batch/pay')}
                headers={getHeaders({})}
                onChange={this.handleImportChange}
                style={{ margin: '0 10px' }}
                beforeUpload={this.handBeforeUpload}
              >
                <Button type='primary'>导入excel表</Button>
              </Upload>
              <span
                className="href"
                onClick={() => {
                  APP.fn.download(require('@/assets/files/批量支付失败模板.xlsx'), '批量失败模版')
                }}
              >
                下载模板
              </span>
              <div style={{ padding: 10 }}>
                <div style={{ marginBottom: 8 }}>（请控制文件大小在2mb内）</div>
                {importRes && <div>
                  <div style={{ marginBottom: 8 }}>
                    <span>成功导入</span>
                    <span style={{ color: 'red' }}>{importRes.successNum}</span>
                    <span>条数据</span>
                  </div>
                  <div>
                    <a href={replaceHttpUrl(importRes.excelAddress)} target="_blank" rel="noopener noreferrer">
                      支付失败清单下载
              </a>
                  </div>
                </div>}
              </div>
              <If condition={this.state.errorUrl}>
                <div>上传失败 <span className="href" onClick={() => {
                  exportFile(this.state.errorUrl)
                }}>下载</span></div>
              </If>
            </FormItem>
          </If>
          <FormItem label="失败原因">
            {getFieldDecorator('remark')(
              <TextArea
                placeholder="请输入失败原因，30字内"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            )}
          </FormItem>
          <FormItem label="发送短信">
            {getFieldDecorator('sendMsg')(
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
              onClick={this.handlePayConfirm(record.id)}
            >
              确认
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}