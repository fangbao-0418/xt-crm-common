import React from 'react'
import { Button } from 'antd'

interface Props {
  onSelect?: (file: File, cb: (data: {
    successNum: number
    failNum: number
    url: string
  }) => void) => void
  onDownload?: () => void
  accept?: string
}

interface State {
  /** 导入结果状态 -1-待导入，0-导入失败，1-导入成功 */
  status: -1 | 0 | 1
  /** 错误文件地址 */
  errorFileUrl: string
  /** 导入成功数 */
  successNum: number
  failNum: number
}

class Main extends React.Component<Props, State> {
  public state: State = {
    status: -1,
    errorFileUrl: '',
    successNum: 0,
    failNum: 0
  }
  public selectFile () {
    return new Promise<File>((resolve) => {
      const el = document.createElement('input')
      el.setAttribute('type', 'file')
      if (this.props.accept) {
        el.setAttribute('accept', this.props.accept)
      }
      el.onchange = function () {
        if (el) {
          const file = el.files && el.files[0]
          if (file) {
            resolve(file)
          }
        }
      }
      el.click()
    })
  }
  public onSelect () {
    this.selectFile().then((file) => {
      if (this.props.onSelect) {
        this.props.onSelect(file, this.callBack.bind(this))
      }
    })
  }
  public callBack (data: {
    successNum: number
    url: string
    failNum: number
  }) {
    const { url, successNum, failNum } = data
    this.setState({
      status: url ? 0 : 1,
      successNum: successNum || 0,
      failNum: failNum || 0,
      errorFileUrl: url
    })
  }
  public render () {
    console.log(this.state, 'render')
    return (
      <div>
        <div>
          <Button
            type='primary'
            size='small'
            onClick={() => {
              this.onSelect()
            }}
          >
            导入文件
          </Button>
          {this.props.onDownload && (
            <span
              className='ml10 download'
              onClick={() => {
                if (this.props.onDownload) {
                  this.props.onDownload()
                }
              }}
            >
              下载模版
            </span>
          )}
        </div>
        {this.state.status !== -1 && (
          <div className='mt10'>
            <span className='mr10'>导入结果:</span>
            导入成功
            <span className='success'>
            &nbsp;{this.state.successNum}&nbsp;
            </span>
            条，失败
            <span className='error'>
              &nbsp;{this.state.failNum}条&nbsp;
            </span>
            <span
              className='ml10 download'
              onClick={() => {
                APP.fn.download(this.state.errorFileUrl, '导入错误信息')
              }}
            >
              下载失败文件
            </span>
          </div>
        )}
      </div>
    )
  }
}
export default Main
