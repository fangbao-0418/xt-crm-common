import React from 'react'
import { Button } from 'antd'

interface Props {
  onSelect?: (file: File, resolve: () => void, reject: () => void) => void
  onDownload?: () => void
  accept?: string
}

interface State {
  /** 导入结果状态 -1-待导入，0-导入失败，1-导入成功 */
  status: -1 | 0 | 1
}

class Main extends React.Component<Props, State> {
  public state: State = {
    status: -1
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
        this.props.onSelect(file, this.onSuccess.bind(this), this.onFailed.bind(this))
      }
    })
  }
  public onSuccess () {
    this.setState({
      status: 1
    })
  }
  public onFailed () {
    this.setState({
      status: 0
    })
  }
  public render () {
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
            {[
              <span className='error' key={0}>
                执行失败
                <span className='ml10 download'>
                  下载失败文件
                </span>
              </span>,
              <span className='success' key={1}>
                执行成功
              </span>
            ][this.state.status]}
          </div>
        )}
      </div>
    )
  }
}
export default Main
