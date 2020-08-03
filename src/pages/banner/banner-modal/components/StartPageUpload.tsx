import React from 'react'
import UploadView from '@/components/upload'
import styles from './style.module.styl'

interface ValueProps {
  url: string,
  uid?: any,
  /** 文件相对地址 */
  rurl?: string
}

interface Props {
  value?: ValueProps[]
  onChange?: (value: ValueProps[]) => void
}

interface State {
  value: ValueProps[]
  onChange?: (value: ValueProps[]) => void
}

class Upload extends React.Component<Props, State> {
  public state: State = {
    value: this.props.value||[]
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value || []
    })
  }
  public onChange (value: ValueProps[]) {
    console.log(value[0]?.rurl, 'on change')
    this.props?.onChange?.(value)
  }
  public render () {
    const { value } = this.state
    return (
      <div className={styles['start-page-upload']}>
        <div>
          <UploadView
            pxSize={[{width: 1080, height: 1920}]}
            placeholder='上传主图'
            listType='picture-card'
            fileType={['jpg', 'jpeg', 'gif', 'png']}
            listNum={1}
            size={0.5}
            value={value?.[0] && [value?.[0]]}
            onChange={(val) => {
              const url = val?.[0]?.url
              if (url) {
                val[0].rurl = APP.fn.deleteOssDomainUrl(url)
              }
              value[0] = val[0]
              this.onChange(value)
            }}
          />
          <div className={styles['start-page-text']}>
            1080*1920 
            <div>500k以下</div>
          </div>
        </div>
        <div>
          <UploadView
            pxSize={[{width: 1125, height: 2436}]}
            placeholder='上传主图'
            listType='picture-card'
            fileType={['jpg', 'jpeg', 'gif', 'png']}
            listNum={1}
            size={0.5}
            value={value?.[1] && [value?.[1]]}
            onChange={(val) => {
              const url = val?.[0]?.url
              if (url) {
                val[0].rurl = APP.fn.deleteOssDomainUrl(url)
              }
              value[1] = val[0]
              this.onChange(value)
            }}
          />
          <div className={styles['start-page-text']}>
            1125*2436  
            <div>500k以下</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Upload