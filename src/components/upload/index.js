import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isFunction, filter } from 'lodash';
import { getStsPolicy, getStsCos } from './api';
import { createClient, ossUploadBlob, createCosClient, cosUpload } from './oss.js';
import { getUniqueId } from '@/packages/common/utils/index'

const uploadButton = props => (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">{props}</div>
  </div>
);

export async function ossUpload (file, dir = 'crm', ossType = 'oss') {
  if (ossType === 'oss') {
    const res = await getStsPolicy()
    if (res) {
      const client = createClient(res)
      try {
        console.log(file, 'fileoss')
        const urlList = await ossUploadBlob(client, file, dir);
        return urlList
      } catch (error) {
        message.error('上传失败，请重试', 'middle');
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  } else if (ossType === 'cos') {
    const res = await getStsCos()
    if (res) {
      const cosClient = createCosClient(res)
      try {
        console.log(file, 'filecos')
        const res = await cosUpload(cosClient, file, dir)
        console.log(res, 'cosUpload')
        const url = 'https://' + res.Location
        const urlList = [url]
        return urlList
      } catch (error) {
        message.error('上传失败，请重试', 'middle')
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  }
}

export function formatValue (value) {
  if (value instanceof Array) {
    return value.map((item) => (item.rurl || '')).join(',')
  }
  return ''
}

/**
 * @param {number} size - 文件大小 初始单位 1 === 1MB
 * @returns {string}
 */
function computedFileSize (size) {
  if (size >= 1) {
    return size + 'MB'
  } else {
    return size * 1000 + 'KB'
  }
}

/** 获取文件扩展名 */
export function getFileExtName (url) {
  const result = url.match(/.+(\.(.+?))(\?.+)?$/)
  if (result && result[1]) {
    return (result[1].slice(1) || '').trim().toLocaleLowerCase()
  } else {
    throw Error('get the expanded-name of the file error')
  }
}

/**
 * 文件类型是否匹配 true-匹配，false-不匹配
 * @param {File} file - 文件名
 * @param {string[]}  list - 匹配的集合
 * @param {'mime'|'ext'} type - 匹配类型 mime-文件mime类型匹配 ext-文件扩展名匹配
 * @returns {boolean} true-匹配 false-不匹配
 */
function isMatchFileType (file, list, type = 'ext') {
  const fileType = file.type
  if (list.length === 0) {
    return false
  }
  let isSupport = false
  if (type === 'ext') {
    const extName = getFileExtName(file.name)
    if (extName) {
      isSupport = list.findIndex((item) => {
        return extName === item.toLocaleLowerCase()
      }) !== -1
    }
  } else {
    isSupport = list.findIndex((item) => {
      return fileType.indexOf(item) > -1
    }) !== -1
  }
  return isSupport
}

class UploadView extends Component {
  count = 0
  constructor (props) {
    super(props);
    this.state = {
      fileList: this.initFileList(props.value || []),
      visible: false,
      url: ''
    };
    this.handleRemove = this.handleRemove.bind(this);
  }
  /** 支持的文件扩展名集合 */
  extnameList = !this.props.extname ? [] : this.props.extname.split(',')
  componentWillReceiveProps (props) {
    // console.log(props, 'props')
    this.setState({
      fileList: this.initFileList(props.value)
    });
  }

  replaceUrl (url) {
    if (!url) {
      return url
    }
    url = APP.fn.deleteOssDomainUrl(url)
    return url
  }
  getViewUrl (url) {
    if (!url) {
      return url
    }
    url = APP.fn.deleteOssDomainUrl(url)
    url = APP.fn.fillOssDomainUrl(url)
    return url
  }
  initFileList (fileList = []) {
    if (typeof fileList === 'string') {
      fileList = [{
        url: fileList,
        uid: getUniqueId()
      }]
    }
    fileList = (fileList || []).filter(item => !!item) || []
    const { fileType } = this.props;
    fileList = Array.isArray(fileList) ? fileList : (Array.isArray(fileList.fileList) ? fileList.fileList : [])
    this.count = fileList.length
    return fileList.map(val => {
      let durl = val.url || ''
      let url = val.url || ''
      let thumbUrl = val.url || ''
      if (fileType == 'video') {
        url = url.replace(/\?x-oss-process=video\/snapshot,t_7000,f_jpg,w_100,h_100,m_fast/g, '');
        thumbUrl = url+ '?x-oss-process=video/snapshot,t_7000,f_jpg,w_100,h_100,m_fast';
      }
      durl = this.getViewUrl(durl)
      url = this.getViewUrl(url)
      thumbUrl = this.getViewUrl(thumbUrl)
      const result = {
        ...val,
        uid: val.uid || getUniqueId(),
        durl,
        url,
        thumbUrl
      };
      val.durl = result.durl;
      val.uid = result.uid;
      val.url = result.url;
      val.size = val.size;
      val.thumbUrl = result.thumbUrl
      val.rurl = this.replaceUrl(result.url)
      val.name = result.name || val.url
      return val
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

  //检测图片格式是否符合预期
  checkFileType = (file, fileType) => {
    let isFileType = true;
    if(Object.prototype.toString.call(fileType) === '[object Array]'){
      let checkResults = fileType.filter(item => {
        return file.type.indexOf(item) > 0
      });
      if(!checkResults.length){
        isFileType = false;
      }
    } else {
      isFileType = file.type.indexOf(fileType) < 0 ? false : true;
    }
    return isFileType;
  }

  beforeUpload = async (file, fileList) => {
    console.log(fileList, 'file')
    const { fileType, size = 10, pxSize, listNum, fileTypeErrorText } = this.props;

    /** 判断文件扩展名是否支持 不传就不限制 */
    let extNameIsSupport = true
    /** 判断文件MIMT-TYPE是否支持 不传就不限制 */
    let mimeTypeIsSupport = true
    const extnameList = this.extnameList
    const fileTypeList = fileType instanceof Array ? fileType : fileType ? [fileType] : []
    if (this.extnameList.length > 0 && !isMatchFileType(file, this.extnameList, 'ext')) {
      extNameIsSupport = false
    }
    if (fileTypeList.length > 0 && !this.checkFileType(file, fileType)) {
      mimeTypeIsSupport = false
    }
    if (extnameList.length === 0 && !mimeTypeIsSupport) {
      APP.error(fileTypeErrorText || '上传格式不支持')
      return Promise.reject()
    }
    if (fileTypeList.length === 0 && !extNameIsSupport) {
      APP.error(fileTypeErrorText || '上传格式不支持')
      return Promise.reject()
    }
    /** 扩展名和MIME-TYPE同时存在取交集 */
    if (fileTypeList.length > 0 && extnameList.length > 0 && (!mimeTypeIsSupport || !extNameIsSupport)) {
      APP.error(fileTypeErrorText || '上传格式不支持')
       return Promise.reject()
    }

    /** size为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置 */
    const sizeOverflow = (file.size / 1024 / 1024) > (size < 1 ? size / 1.024 : size)
    if (sizeOverflow) {
      message.error(`请上传小于${computedFileSize(size)}的文件`);
      return Promise.reject()
    }
    //pxSize: [{width:100, height:100}] 限制图片上传px大小
    if (pxSize && pxSize.length) {
      const imgSize = await this.getImgSize(file) || {width:0, height:0}
      let result = pxSize.filter((item, index, arr) => {
        return item.width === imgSize.width && item.height === imgSize.height
      })
      if (result.length === 0 ) {
        message.error(`图片尺寸不正确`)
        return Promise.reject()
      }
    }
    /** 限制判断一定要放到最后 */
    this.count++
    const typeName = this.props.listType !== 'text' ? '图片' : '文件'
    if (listNum !== undefined && this.count > listNum) {
      /** 多文件上传只提示一次 */
      if (this.count >= listNum + 1 && fileList.length > 0) {
        if (file === fileList[fileList.length - 1]) {
          message.error(`上传${typeName}数量超出最大限制`)
        }
      }
      this.count = listNum
      return Promise.reject()
    }
    return Promise.resolve(file)
  };
  customRequest(e) {
    const file = e.file;
    const { onChange, formatOrigin, ossDir, ossType } = this.props;
    
    ossUpload(file, ossDir, ossType).then((urlList) => {
      let { fileList } = this.state;
      console.log(file, 'customRequest')
      file.url = urlList && urlList[0];
      file.durl = file.url;
      fileList.push({
        ...file,
        size: file.size,
        name: file.name
      });
      fileList = this.initFileList(fileList)
      this.setState({
        fileList: fileList
      });
      const value = fileList.map((item) => {
        return formatOrigin ? {
          ...item,
          url: this.replaceUrl(item.url),
          durl: this.replaceUrl(item.durl),
          thumbUrl: this.replaceUrl(item.thumbUrl),
        } : item
      })
      console.log('change --------', value)
      isFunction(onChange) && onChange([...value]);
    }, () => {
      this.count--
      if (this.count <= 0) {
        this.count = 0
      }
      console.log(this.count, 'upload error')
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
    if (this.props.listType === 'text') {
      APP.fn.download(file.url, file.name)
      return
    }
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
          beforeUpload={this.beforeUpload}
          onRemove={this.handleRemove}
          customRequest={(e) => this.customRequest(e)}
          onPreview={this.onPreview}
          {...attributes}
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
  ossDir: PropTypes.string,
  ossType: PropTypes.string 
};

UploadView.defaultProps = {
  showUploadList: true,
  listType: 'text',
  ossType: 'oss'
};

export default UploadView;
