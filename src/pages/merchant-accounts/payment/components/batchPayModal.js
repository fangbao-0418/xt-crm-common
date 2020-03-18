import React, { Component } from 'react';
import { Form, Modal, Button, Upload, message } from 'antd';
import { getHeaders, prefix, replaceHttpUrl, download } from '@/util/utils'

@Form.create()
export default class extends Component {
  state = {
    importRes: null
  }

  handleImportChange = info => {
    const { status, response, name } = info.file;
    if (status === 'done') {
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data })
        message.success(`${name} 文件上传成功`);
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

  render() {
    const { importRes } = this.state
    const { modalProps = {} } = this.props;

    return (
      <Modal
        {...modalProps}
        title='批量支付'
        footer={null}
        destroyOnClose
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
            <Button type='primary'>导入excel表</Button>
          </Upload>
          <span
            className="href"
            onClick={() => {
              download('/assets/files/批量支付成功模版.xlsx', '批量支付模版')
            }}
          >
            下载模板
            </span>
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ marginBottom: 8 }}>（请控制文件大小在2mb内）</div>
          {importRes && <div>
            <div style={{ marginBottom: 8 }}>
              <span>成功添加</span>
              <span style={{ color: 'red' }}>{importRes.successNum}</span>
              <span>条用户数据</span>
            </div>
            <div>
              <a href={replaceHttpUrl(importRes.excelAddress)} target="_blank" rel="noopener noreferrer">
                支付失败清单下载
              </a>
            </div>
          </div>}
        </div>
      </Modal>
    )
  }
}