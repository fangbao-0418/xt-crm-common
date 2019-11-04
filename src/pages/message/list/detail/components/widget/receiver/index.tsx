import React from 'react'
import { Input, Button } from 'antd'
import styles from './style.module.styl'
const TextArea = Input.TextArea

interface Props {
  readonly?: boolean
}

interface State {
  file: File
  text: string
  len: number
}
class Main extends React.Component<{}, State> {
  public state: State = {
    file: new File([], ''),
    text: '',
    len: 0
  }
  public constructor (props: {}) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this)
    this.removeFile = this.removeFile.bind(this)
  }
  public uploadFile () {
    const el = document.createElement('input')
    el.setAttribute('type', 'file')
    el.click()
    el.onchange = (e: any) => {
      console.log(e.target.files)
      this.setState({
        file: e.target.files[0]
      })
    }
  }
  public removeFile () {
    this.setState({
      file: new File([], '')
    })
  }
  public onChange (value: {
    text?: string
    file?: File
  }) {
    const state = Object.assign({}, this.state, value)
    this.setState({
      text: state.text,
      file: state.file
    })
  }
  public render () {
    const { file, text } = this.state
    console.log(this.state.len, 'len render')
    return (
      <div className={styles.container}>
        <TextArea
          style={{
            height: 120
          }}
          placeholder='请正确输入会员ID，每行一个号码'
          value={text}
          onPressEnter={(e) => {
            if (this.state.len >= 4) {
              e.preventDefault()
            }
          }}
          onChange={(e: any) => {
            const text = e.target.value || ''
            let len = text.match(/\n/g) ? text.match(/\n/g).length : 0
            if (!/\n$/.test(text)) {
              console.log('0000000000')
              len++
            }
            if (len <= 4) {
              this.setState({
                len
              })
              this.onChange({
                text
              })
            } else {
              e.preventDefault()
            }
          }}
        />
        <div className='text-right'>
          <span>共{this.state.len}条</span>
        </div>
        <div>
          <Button
            type='primary'
            onClick={this.uploadFile}
          >
            批量上传号码
          </Button>
          {file.size > 0 && (
            <p>
              <span className={styles.download}>{file.name}</span>
              <span
                className='ml10 href'
                onClick={this.removeFile}
              >
                删除
              </span>
            </p>
          )}
          <p>
            点击 <span className={styles.download}>下载模板</span> 下载正确的会员ID模板，请确保会员ID格式与模板一致，超过<span style={{color: 'red'}}>100</span>条数据时，请使用模板上传
          </p>
        </div>
      </div>
    )
  }
}
export default Main
