import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isFunction, filter } from 'lodash';
import { getStsPolicy } from './api';
import { createClient, ossUploadBlob } from './oss.js';

const uploadButton = props => (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">{props}</div>
  </div>
);

async function ossUpload(file) {
  const res = await getStsPolicy();
  if (res) {
    const client = createClient(res);
    try {
      const urlList = await ossUploadBlob(client, file, 'crm');
      return urlList;
    } catch (error) {
      message.error('上传失败，请重试', 'middle');
    }
  }
}

class UploadView extends Component {
  count = 0
  constructor(props) {
    super(props);
    this.state = {
      fileList: this.initFileList(props.value || []),
      visible: false,
      url: ''
    };
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillReceiveProps (props) {
    this.setState({
      fileList: this.initFileList(props.value)
    });
  }

  replaceUrl (url) {
    if (!url) {
      return url
    }
    url = url.replace(/^https?:\/\/.+?\//, '')
    return url
  }
  getViewUrl (url) {

    if (!url) {
      return url
    }
    return 'https://assets.hzxituan.com/' + url.trim().replace(/^https?:\/\/.+?\//, '')
  }
  initFileList(fileList = []) {
    fileList = fileList || []
    const { fileType } = this.props;
    fileList = Array.isArray(fileList) ? fileList : (Array.isArray(fileList.fileList) ? fileList.fileList : [])
    this.count = fileList.length
    return fileList.map(val => {
      val.durl = val.url
      if (fileType == 'video') {
        val.url = val.url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_100,h_100,m_fast';
        val.thumbUrl = val.url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_100,h_100,m_fast';
      }
      val.durl = this.getViewUrl(val.durl)
      val.url = this.getViewUrl(val.url)
      val.thumbUrl = this.getViewUrl(val.thumbUrl)
      return val;
    });
  }
  // 获取图片像素大小
  getImgSize (file) {
    const el = document.createElement('img')
    return new Promise((resolve, rejet) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        el.setAttribute('src', e.target.result)
        el.onload = () => {
          const width = el.naturalWidth || el.width
          const height = el.naturalHeight || el.height
          resolve({
            width,
            height
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  beforeUpload = async (file, fileList) => {
    const { fileType, size = 10, pxSize, listNum } = this.props;
    if (fileType && file.type.indexOf(fileType) < 0) {
      message.error(`请上传正确${fileType}格式文件`);
      return Promise.reject()
    }
    const isLtM = file.size / 1024 / 1024 < size;
    if (!isLtM) {
      message.error(`请上传小于${size * 1000}kB的文件`);
      return Promise.reject()
    }
    //pxSize: [{width:100, height:100}] 限制图片上传px大小
    if (pxSize && pxSize.length) {
      const imgSize = await this.getImgSize(file) || {width:0, height:0}
      let result = pxSize.filter((item, index, arr) => {
        return item.width == imgSize.width && item.height == imgSize.height;
      })
      if (result.length === 0 ) {
        message.error(`图片尺寸不正确`);
        return Promise.reject()
      }
    }
    this.count++
    if (listNum !== undefined && this.count > listNum) {
      if (this.count === listNum + 1) {
        message.error(`上传图片超出最大限制`);
      }
      return Promise.reject()
    }
    return Promise.resolve(file)
  };
  customRequest(e) {
    const file = e.file;
    console.log(e, 'customRequest')
    ossUpload(file).then(urlList => {
      const { fileList } = this.state;
      const { onChange } = this.props;
      file.url = urlList && urlList[0];
      file.durl = file.url;
      fileList.push({
        ...file,
        name: file.name
      });
      this.setState({
        fileList: fileList,
      });
      const value = fileList.map((item) => {
        return {
          ...item,
          url: this.replaceUrl(item.url),
          durl: this.replaceUrl(item.durl),
          // name: file.name
        }
      })
      isFunction(onChange) && onChange(value);
    });
  }
  handleRemove = e => {
    const { fileList } = this.state;
    const { onChange } = this.props;
    const newFileList = filter(fileList, item => item.uid !== e.uid);
    this.setState({ fileList: newFileList });
    if (onChange) {
      onChange(newFileList);
    }
  };
  onPreview = file => {
    this.setState({
      url: file.durl,
      visible: true,
    })
  };
  render() {
    const {
      placeholder,
      listType,
      listNum = 1,
      showUploadList,
      children,
      accept,
      ...attributes
    } = this.props;
    const { fileList } = this.state;
    delete attributes.onChange
    return (
      <>
        <Upload
          accept={accept}
          listType={listType}
          fileList={fileList}
          showUploadList={showUploadList}
          // onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          onRemove={this.handleRemove}
          customRequest={(e) => this.customRequest(e)}
          onPreview={this.onPreview}
          {...attributes}
          // onChange={(e) => {
          //   console.log(e, 'onchange')
          // }}
        >
          {children ? children : fileList.length >= listNum ? null : uploadButton(placeholder)}
        </Upload>
        <Modal
          title="预览"
          style={{ textAlign: 'center' }}
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
        >
          {this.props.fileType == 'video' ? <video width="100%" controls="controls">  <source src={this.state.url} type="video/mp4" /></video> : <img src={this.state.url} alt=""/>}
        </Modal>
      </>
    );
  }
}

UploadView.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  listType: PropTypes.oneOf(['text', 'picture', 'picture-card']),
  listNum: PropTypes.number,
  size: PropTypes.number,
  showUploadList: PropTypes.bool,
};

UploadView.defaultProps = {
  showUploadList: true,
  listType: 'text',
};

export default UploadView;
