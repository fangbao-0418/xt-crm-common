import React, { Component } from 'react';
import { Form, Modal, Button, Upload, message } from 'antd';
import { getHeaders, prefix, replaceHttpUrl } from '@/util/utils'
import If from '@/packages/common/components/if';

@Form.create()
export default class extends Component {
  state = {
    importRes: null,
    errorUrl: '',
    loading: false
  }

  handleImportChange = info => {
    const { status, response, name } = info.file;
    if (status === 'done') {
      this.setState({
        loading: false
      })
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data })
        message.success(`${name} 文件上传成功`);
      } else if (/^url:/.test(response.message)) {
        message.error(`上传失败`);
        const errorUrl = response.message.replace('url:', '')
        this.setState({
          errorUrl
        })
      } else {
        message.error(`${response.message}`);
      }
    } else if (status === 'error') {
      this.setState({
        loading: false
      })
      message.error(`${name} 文件上传错误.`);
    }
  };

  handBeforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 2) {
      message.warn('上传文件不能超过2M');
      return false
    }
    this.setState({
      loading: true
    })
  }

  handleAfterClose = () => {
    this.setState({
      errorUrl: ''
    })
  }

  render() {
    const { importRes, loading } = this.state
    const { modalProps = {} } = this.props;

    return (
      <Modal
        {...modalProps}
        title='批量支付'
        footer={null}
        destroyOnClose
        afterClose={this.handleAfterClose}
      >
        <div>
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
            <Button loading={loading} type='primary'>导入excel表</Button>
          </Upload>
          <span
            className="href"
            onClick={() => {
              APP.fn.download(require('@/assets/files/批量支付成功模版.xlsx'), '批量支付模版')
            }}
          >
            下载模板
            </span>
        </div>
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
          <div>
            <span style={{ color: 'red' }}>上传失败{' '}</span>
            <span
              className="href"
              onClick={() => {
                APP.fn.download(this.state.errorUrl, '批量支付模版')
              }}
            >
              下载
            </span>
          </div>
        </If>
      </Modal>
    )
  }
}