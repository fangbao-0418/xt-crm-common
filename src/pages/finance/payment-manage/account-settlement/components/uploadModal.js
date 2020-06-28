import React, { Component } from 'react'
import { Form, Modal, Button, Upload, message } from 'antd'
import { getHeaders, prefix, replaceHttpUrl } from '@/util/utils'
import If from '@/packages/common/components/if'
import * as api from '../api'

@Form.create()
export default class extends Component {
  state = {
    importRes: null,
    errorUrl: '',
    loading: false
  }

  handleImportChange = info => {
    const { status, response, name } = info.file
    if (status === 'done') {
      this.setState({
        loading: false
      })
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data })
        message.success(`${name} 文件上传成功`)
      } else if ((/^url:/).test(response.message)) {
        message.error('上传失败')
        const errorUrl = response.message.replace('url:', '')
        this.setState({
          errorUrl
        })
      } else {
        message.error(`${response.message}`)
      }
    } else if (status === 'error') {
      this.setState({
        loading: false
      })
      message.error(`${name} 文件上传错误.`)
    }
  };

  handBeforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 10) {
      message.warn('上传文件不能超过10M')
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

  render () {
    const { importRes, loading } = this.state
    const { modalProps = {} } = this.props

    return (
      <Modal
        {...modalProps}
        title='批量创建财务结算单'
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
            action={prefix('/mcweb/account/financial/disposable/settlement/apply/import/v1')}
            headers={getHeaders({})}
            onChange={this.handleImportChange}
            style={{ margin: '0 10px' }}
            beforeUpload={this.handBeforeUpload}
          >
            <Button loading={loading} type='primary'>导入excel表</Button>
          </Upload>
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ marginBottom: 8 }}>（请控制文件大小在10mb内）</div>
          {
            importRes && (
              <div>
                <If condition={importRes.successNum}>
                  <div style={{ marginBottom: 8 }}>
                    <span>成功导入</span>
                    <span style={{ color: 'red' }}>{importRes.successNum}</span>
                    <span>条数据</span>
                  </div>
                </If>
                <If condition={importRes.excelAddress}>
                  <div>
                    <a
                      href={replaceHttpUrl(importRes.excelAddress)}
                      target='_blank' rel='noopener noreferrer'>
                      上传失败清单下载
                    </a>
                  </div>
                </If>
              </div>
            )
          }
        </div>
        <If condition={this.state.errorUrl}>
          <div>
            <span style={{ color: 'red' }}>上传失败{' '}</span>
            <span
              className='href'
              onClick={() => {
                APP.fn.download(this.state.errorUrl, '批量创建账务结算单模版')
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