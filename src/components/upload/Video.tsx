import React from 'react'
import { Modal, Upload, Icon } from 'antd'
import { getStsPolicy, getStsCos } from './api'
import { createClient, ossUploadBlob, createCosClient, cosUpload } from './oss.js'
import { UploadFile, RcCustomRequestOptions, RcFile } from 'antd/lib/upload/interface'
import { ossUpload } from './helper'

interface Props {
  accept?: string
  placeholder?: string
  /** 视频上传最大个数 */
  maxCount?: number
  /** 视频大小限制，单位kb */
  maxSize?: number
  onChange?: (value?: UploadFile[]) => void
}

interface State {
  visible: boolean
  fileList: any[]
  url: string
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
    url: ''
  }
  public customRequest (e: RcCustomRequestOptions) {
    const file = e.file
    const { onChange } = this.props
    ossUpload(file).then((urlList) => {
      let { fileList } = this.state
      // file.url = urlList && urlList[0]
      // file.durl = file.url
      fileList.push({
        ...file,
        size: file.size,
        name: file.name
      })
      // fileList = this.initFileList(fileList)
      this.setState({
        fileList: fileList
      })
      // const value = fileList.map((item) => {
      //   return formatOrigin ? {
      //     ...item,
      //     url: this.replaceUrl(item.url),
      //     durl: this.replaceUrl(item.durl),
      //     thumbUrl: this.replaceUrl(item.thumbUrl),
      //   } : item
      // })
      // console.log('change --------', value)
      // isFunction(onChange) && onChange([...value]);
    }, () => {
      // this.count--
      // if (this.count <= 0) {
      //   this.count = 0
      // }
    })
  }
  beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    const fileSize = file.size
    const maxCount = this.props.maxCount
    /** 校验数据大小 */
    if (maxCount && fileSize > maxCount) {
      APP.error('视频最大不得超过100MB')
    }
  }
  // public handleRemove = e => {
  //   const { fileList } = this.state
  //   const { onChange } = this.props
  //   const newFileList = filter(fileList, item => item.uid !== e.uid)
  //   this.setState({ fileList: newFileList })
  //   if (onChange) {
  //     onChange(newFileList)
  //   }
  // };
  // public onPreview = file => {
  //   if (this.props.listType === 'text') {
  //     APP.fn.download(file.url, file.name)
  //     return
  //   }
  //   this.setState({
  //     url: file.durl,
  //     visible: true
  //   })
  // };
  public render () {
    const {
      children,
      placeholder,
      maxCount
    } = this.props
    const { fileList } = this.state
    return (
      <>
        <Upload
          accept={this.props.accept}
          listType={'picture-card'}
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
        >
          {children ? children : fileList.length >= maxCount ? null : uploadButton(placeholder)}
        </Upload>
        <Modal
          title='预览'
          style={{ textAlign: 'center' }}
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
        >
          <video
            width='100%'
            controls={true}
          >
              <source
                src={this.state.url}
                type='video/mp4'
              />
          </video>
        </Modal>
      </>
    )
  }
}

export default VideoUpload