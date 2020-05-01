import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isFunction, filter } from 'lodash';

const uploadButton = props => (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">{props}</div>
  </div>
);

export function formatValue(value) {
  if (value instanceof Array) {
    return value.map((item) => (item.rurl || '')).join(',')
  }
  return ''
}

/**
 * @param {number} size - 文件大小 初始单位 1 === 1MB
 * @returns {string}
 */
function computedFileSize(size) {
  if (size >= 1) {
    return size + 'MB'
  } else {
    return size * 1000 + 'KB'
  }
}

/** 获取文件扩展名 */
export function getFileExtName(url) {
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
function isMatchFileType(file, list, type = 'ext') {
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
  constructor(props) {
    super(props);
    this.state = {
      fileList: (props.value || []).map(val => {
        val.uid =  Math.random();
        return val;
      }),
      visible: false,
      url: ''
    };
    this.handleRemove = this.handleRemove.bind(this);
  }
  /** 支持的文件扩展名集合 */
  extnameList = !this.props.extname ? [] : this.props.extname.split(',')
  componentWillReceiveProps(props) {
    // console.log(props, 'props')
    this.setState({
      fileList: props.value
    });
  }

  //检测图片格式是否符合预期
  checkFileType = (file, fileType) => {
    let isFileType = true;
    if (Object.prototype.toString.call(fileType) === '[object Array]') {
      let checkResults = fileType.filter(item => {
        return file.type.indexOf(item) > 0
      });
      if (!checkResults.length) {
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
    const { onChange } = this.props;
    let { fileList } = this.state;
    console.log(file, 'customRequest')
    fileList = fileList || []
    fileList.push({
      file: file,
      name: file.name,
      uid: Math.random()
    });
    this.setState({
      fileList: fileList
    });
    console.log('change --------', fileList)
    isFunction(onChange) && onChange(fileList);

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
      file.url && APP.fn.download(file.url)
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
