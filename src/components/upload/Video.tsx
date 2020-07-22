import React, { VideoHTMLAttributes } from 'react'
import { Modal, Upload, Icon } from 'antd'
import { getStsPolicy, getStsCos } from './api'
import { createClient, ossUploadBlob, createCosClient, cosUpload } from './oss.js'
import { getUniqueId } from '@/packages/common/utils/index'
import { UploadFile, RcCustomRequestOptions, RcFile } from 'antd/lib/upload/interface'
import { ossUpload, getStorageUnit } from './helper'
import FileTypeBrowser from 'file-type/browser'

interface Props {
  accept?: string
  /** 支持的扩展名 多个,分割 */
  extname?: string
  placeholder?: string
  /** 视频上传最大个数 */
  maxCount?: number
  /** 视频大小限制，单位字节 */
  maxSize?: number
  onChange?: (value?: UploadFile[]) => void
  value?: UploadFile[]
  disabled?: boolean
}

interface State {
  visible: boolean
  fileList: any[]
  url?: string
  value: UploadFile[]
}

const defaultExtname = 'mp4'

/** 获取文件真实类型 */
function getRealFileType (file: File) {
  return FileTypeBrowser.fromBlob(file)
}

const uploadButton = (props: any) => (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>
      {props}
    </div>
  </div>
)

class VideoUpload extends React.Component<Props, State> {
  public state: State = {
    visible: false,
    fileList: [],
    url: '',
    value: this.initValue()
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: this.initValue(props.value)
    })
  }
  public getViewUrl (url: string) {
    if (!url) {
      return url
    }
    url = APP.fn.deleteOssDomainUrl(url)
    url = APP.fn.fillOssDomainUrl(url)
    return url
  }
  public initValue (value = this.props.value) {
    const res = value?.map((item) => {
      let url = item.url || ''
      const thumbUrl = this.getViewUrl(url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_100,h_100,m_fast,ar_auto')
      return {
        ...item,
        url,
        uid: item.uid || getUniqueId(),
        thumbUrl
      }
    }) || []
    return res
  }
  public customRequest = (e: RcCustomRequestOptions) => {
    const file = e.file as any
    const { onChange } = this.props
    ossUpload(file).then((urlList) => {
      let fileList = this.state.value || []
      file.url = APP.fn.deleteOssDomainUrl(urlList?.[0])
      fileList.push({
        ...file,
        size: file.size,
        uid: getUniqueId()
      })

      this.setState({
        value: this.initValue(fileList)
      })
      onChange?.([...fileList])
    })
  }
  beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    const fileSize = file.size
    const maxSize = this.props.maxSize
    const extname = this.props.extname || defaultExtname
    const extnames = extname.split(',')

    /** 校验数据大小 */
    if (maxSize && fileSize > maxSize) {
      APP.error(`视频大小不得超过${getStorageUnit(maxSize)}`)
      return Promise.reject()
    }
    /** 校验视频格式 */
    const fileRealType = await getRealFileType(file)
    if (!extnames.includes(fileRealType?.ext || '')) {
      APP.error(`视频格式仅支持${extnames.join('、')}`)
      return Promise.reject()
    }
    return Promise.resolve()
  }
  public handleRemove = (e: UploadFile) => {
    const value = this.state.value || []
    const { onChange } = this.props
    const newFileList = value.filter(item => item.uid !== e.uid)
    this.setState({ value: newFileList })
    if (onChange) {
      onChange(newFileList)
    }
  }
  public onPreview = (file: UploadFile) => {
    this.setState({
      url: file.url,
      visible: true
    })
  }
  public onModalHide () {
    this.setState({ visible: false })
    const video = this.refs.video as any
    video?.pause?.()
  }
  public render () {
    const {
      children,
      disabled
    } = this.props
    const placeholder = this.props.placeholder || '上传视频'
    const maxCount = this.props.maxCount || 1
    const { value } = this.state
    const accept = this.props.accept || 'video/mp4'
    console.log(disabled, value, 'disableddisableddisableddisableddisabled')
    return (
      <>
        <Upload
          accept={accept}
          listType={'picture-card'}
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
          onRemove={this.handleRemove}
          onPreview={this.onPreview}
          fileList={this.state.value}
          disabled={disabled}
        >
          {children ? children : (value.length >= maxCount ? null : uploadButton(placeholder))}
        </Upload>
        <Modal
          title='预览'
          style={{ textAlign: 'center' }}
          visible={this.state.visible}
          onOk={() => {
            this.onModalHide()
          }}
          onCancel={() => {
            this.onModalHide()
          }}
        >
          {(
            <video
              width='100%'
              ref='video'
              controls={true}
            >
                <source
                  src={this.state.url}
                  type='video/mp4'
                />
            </video>
          )}
        </Modal>
      </>
    )
  }
}

export default VideoUpload