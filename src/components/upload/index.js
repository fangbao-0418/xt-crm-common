import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isFunction, filter } from 'lodash';
import { getStsPolicy } from './api';
import { createClient, ossUploadBlob } from './oss.js';
import { resolve } from 'url';
import { reject } from 'q';

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
      fileList: this.initFileList(props.value || []),
      visible: false,
      url: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        fileList: this.initFileList(this.props.value),
      });
    }
  }

  initFileList(fileList) {
    const { fileType } = this.props;
    return fileList.map(val=>{
      val._url = val.url
      if (fileType == 'video') {
        val.url = val.url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_100,h_100,m_fast';
      }
      return val;
    });
  }

  beforeUpload = size => (file, fileList) => {
    const isLtM = file.size / 1024 / 1024 < size;
    if (!isLtM) {
      message.error(`请上传小于${size * 1000}kB的文件`);
      return false;
    }
    return true;
  };


  customRequest(e) {
    const file = e.file;
    
    ossUpload(file).then(urlList => {
      const { fileList } = this.state;
      const { onChange } = this.props;
      file.url = urlList && urlList[0];
      file._url = file.url;
      fileList.push(file);
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
  onPreview = file => {
    this.setState({
      url: file._url,
      visible: true,
    })
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
      <>
        <Upload
          listType={listType}
          fileList={fileList}
          showUploadList={showUploadList}
          // onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload(size)}
          onRemove={this.handleRemove}
          customRequest={(e) => this.customRequest(e)}
          onPreview={this.onPreview}
        >
          {children ? children : fileList.length >= listNum ? null : uploadButton(placeholder)}
        </Upload>
        <Modal
          title="预览"
          style={{ textAlign: 'center' }}
          visible={this.state.visible}
          onOk={() => this.setState({visible:false})}
          onCancel={() => this.setState({visible:false})}
        >
          {this.props.fileType == 'video' ? <video width="100%" controls="controls">  <source src={this.state.url} type="video/mp4" /></video>: <img src={this.state.url} />}
        </Modal>
      </>
    );
  }
}

// const UploadView = props => {
//   const {
//     placeholder,
//     listType,
//     listNum = 1,
//     onChange,
//     size = 10,
//     showUploadList,
//     children,
//     value,
//   } = props;
//   const [fileList, setFileList] = useState(value || []);
//   console.log('upload value', value);
//   console.log('upload fileList', fileList);
//   const beforeUpload = size => file => {
//     const isLtM = file.size / 1024 / 1024 < size;
//     if (!isLtM) {
//       message.error(`请上传小于${size}M的文件`);
//     }
//     // TODO: 这里还需要优化一下
//     debugger;
//     ossUpload(file).then(urlList => {
//       const newUploadedFileList = fileList.map(item => {
//         if (item.uid === file.uid) {
//           item.url = urlList && urlList[0];
//         }
//         return item;
//       });

//       setFileList(newUploadedFileList);
//       isFunction(onChange) && onChange(fileList);
//     });
//     return false;
//   };

//   // const
//   return (
//     <>
//       <Upload
//         action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
//         listType={listType}
//         fileList={fileList}
//         showUploadList={showUploadList}
//         // onPreview={this.handlePreview}
//         beforeUpload={beforeUpload(size)}
//         onChange={({ fileList }) => {
//           console.log('upload-inner-fileList', fileList);
//           setFileList(fileList);
//           isFunction(onChange) && onChange(fileList);
//         }}
//         onRemove={e => {
//           setFileList(filter(fileList, item => item.uid === e.uid));
//         }}
//       >
//         {children ? children : fileList.length >= listNum ? null : uploadButton(placeholder)}
//       </Upload>
//     </>
//   );
// };

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
