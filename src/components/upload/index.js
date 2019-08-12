import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
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
      console.log('已上传的url', urlList);
      return urlList;
    } catch (error) {
      message.error('上传失败，请重试', 'middle');
    }
  }
}

class UploadView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.value || [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        fileList: this.props.value,
      });
    }
  }

  beforeUpload = size => (file, fileList) => {
    const isLtM = file.size / 1024 / 1024 < size;
    if (!isLtM) {
      message.error(`请上传小于${size*1000}kB的文件`);
      return false;
    }
    return true;
  };


  customRequest = e => {
    const file = e.file;
    ossUpload(file).then(urlList => {
      const { fileList } = this.state;
      const { onChange } = this.props;
      file.url = urlList && urlList[0];
      fileList.push(file)
      this.setState({
        fileList: fileList,
      });
      isFunction(onChange) && onChange(fileList);
    });
  }
  handleRemove = e => {
    console.log(e)
    const { fileList } = this.state;
    this.setState({ fileList: filter(fileList, item => item.uid !== e.uid) });
  };
  render() {
    const {
      placeholder,
      listType,
      listNum = 1,
      onChange,
      size = 10,
      showUploadList,
      children,
      // value,
    } = this.props;
    const { fileList } = this.state;
    return (
      <Upload
        listType={listType}
        fileList={fileList}
        showUploadList={showUploadList}
        // onPreview={this.handlePreview}
        beforeUpload={this.beforeUpload(size)}
        onRemove={this.handleRemove}
        customRequest={this.customRequest}
      >
        {children ? children : fileList.length >= listNum ? null : uploadButton(placeholder)}
      </Upload>
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
