import React from 'react'
import { Button } from 'antd'
import Uplaod from '@/components/upload'
import styles from './style.module.styl'
interface Props {
  detail: UliveStudio.ItemProps
  hide?: () => void
  onOk?: (value: string) => void
}
interface State {
  value: {url: string}[]
}
class Main extends React.Component<Props> {
  public state: State = {
    value: this.props.detail.liveBannerUrl ? [{
      url: this.props.detail.liveBannerUrl
    }] : []
  }
  public hide = () => {
    if (this.props.hide) {
      this.props.hide()
    }
  }
  public onOk = () => {
    if (this.props.onOk) {
      const value = this.state.value
      this.props.onOk(value && value[0] && value[0].url)
    }
  }
  public render () {
    const detail = this.props.detail
    return (
      <div>
        <div className='text-center'>
          <Uplaod
            formatOrigin
            value={this.state.value}
            className={styles['cover-upload']}
            style={{display: 'inline-block', width: 'auto'}}
            listType='picture-card'
            onChange={(value: any) => {
              this.setState({
                value: value
              })
              console.log(value, 'value')
            }}
          />
        </div>
        <div className='text-center mt20'>
          <Button onClick={this.onOk} type='primary'>确定</Button>
        </div>
      </div>
    )
  }
}
export default Main
