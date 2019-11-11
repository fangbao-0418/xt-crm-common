import React, { Component } from 'react';
import UploadView from '@/components/upload';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash';
import { Radio, Row, Col, Form, Checkbox, Button, Spin, Input, Icon, Modal, Table, Tree } from 'antd';
import './index.scss'

let dragingIndex = -1;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};


const titleRender = (title) => {
  return<div><span style={{color: 'red'}}>*</span>{title}</div>
}

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);


export default class extends Component {

  state = {
    initialData: {
      id: null,
      name: '',
      icon: null,
      productCategoryVOS: null,
      sort: null,
      type: 2,
      url: '',
    },
    dataSource: []
  }

  componentDidMount(){
    const { dataSource } = this.props;
    const { initialData } = this.state;

    if(dataSource){
      this.setState({
        dataSource: dataSource
      })
    } else {
      this.setState({
        dataSource: [
          _.cloneDeep(initialData),
          _.cloneDeep(initialData),
          _.cloneDeep(initialData),
          _.cloneDeep(initialData)
      ]
      })
    }
  }

  componentWillReceiveProps(newProps){
    console.log(newProps, 'newProps')
    console.log(this.props, 'nowProps')
    const { secondaryIndex, secondaryActText } = newProps;
    if(secondaryIndex !== null && !_.isEqual(newProps, this.props)){
      let { dataSource } = this.state;

      dataSource[secondaryIndex].productCategoryVOS =  secondaryActText;
      this.setState({
        dataSource
      })
    }
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  //拖动事件
  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];

    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  };

  //修改名字
  nameChange = (val, index) => {
    let { dataSource } = this.state
    console.log(dataSource, '111')

    dataSource[index].name = val;
    this.setState({
      dataSource: dataSource
    })
  }

  //更新url
  updateUrl = (val, index) => {
    let { dataSource } = this.state
    dataSource[index].url = val;
    console.log(dataSource, '2222')
    this.setState({
      dataSource: dataSource
    })
  }

  //单选按钮变化
  radioChange = (val, record, index )=> {
    console.log('radio checked', val);
    let { dataSource } = this.state
    let { productCategoryVOS } = dataSource[index];

    console.log(val, index, 'readio')
    //单选，需要删除另一项的数据
    if(val === 2){
      dataSource[index].url = '';
    } else if(val === 4){
      productCategoryVOS = null;
    }

    console.log(dataSource, 'dataSource')
    //同步productCategoryVOS的type字段
    if(productCategoryVOS){
      productCategoryVOS = productCategoryVOS.map(item => {
        item.type = val;
        return item;
      })
    }

    //更新最外层的type 类型（2：活动，4：链接）
    dataSource[index].type = val;
    dataSource[index].productCategoryVOS = productCategoryVOS;
    console.log(dataSource, '222')

    this.setState({
      dataSource: dataSource
    });
  };

  //新增一个二级类目
  addRow = () => {
    let { dataSource, initialData } = this.state;
      
    dataSource.push(_.cloneDeep(initialData))
    this.setState({
      dataSource
    })
  }

  //删除一个二级类目
  deleteRow = (index) => {
    let { dataSource } = this.state;
    if(dataSource.length > 4){
      dataSource.splice(index, 1)
      this.setState({
        dataSource
      })
    }
  }

  //图片上传后的回调
  imgUpload = (file, index) => {
    console.log(file, 'file')
    let { dataSource } = this.state;
    dataSource[index].icon = file || null;
    console.log(dataSource, 'dataSource')
    this.setState({
      dataSource
    })
  }

  render() {
    const { handleClickModal, secondaryActText } = this.props;

    console.log(secondaryActText, 'secondaryActText')
    console.log(this.state.dataSource, 'dataSource')
    const columns = [
      {
        title: titleRender('图片'),
        dataIndex: 'icon',
        render: (val, record, index) => {
          return <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{cursor: 'pointer', marginRight: '6px'}}>
              <Icon onClick={() => this.deleteRow(index)} type="delete" />
            </span>
            <UploadView value={val ? [val] : []}  onChange={file => this.imgUpload(file, index)} className="secondary-category" listType="picture-card" listNum={2} size={0.3}>
            </UploadView>
          </div>
        } 
      },
      {
        title: titleRender('名称'),
        dataIndex: 'name',
        render: (val, record, index) => {
          return <>
            <Input
              placeholder="请输入类目名称"
              value={val}
              onChange={(e) => this.nameChange(e.target.value, index)}
            />
          </>
        } 
      },
      {
        title: titleRender('内容'),
        dataIndex: 'productCategoryVOS',
        width: 400,
        render: (val, record, index) => {
          console.log(val, 'val')
          const { type, url } = record;
          return <div>
            <Radio.Group onChange={(e) => this.radioChange(e.target.value, record, index)} value={type}>
              <Radio style={radioStyle} value={2}></Radio>
              <div>
                {
                  val && val.map((val, i) => {
                    return <div className="intf-cat-reitem" key={i}>{val.title} <span className="close" onClick={() => {
                      const actText = this.state.actText;
                      actText.splice(i, 1);
                      this.setState({ actText })
                    }}><Icon type="close" /></span></div>
                  })
                }
                { type === 2 && (<div className="intf-cat-rebox">
                  <Button type="link" onClick={() => handleClickModal({type: 'secondary', index, secondaryActText: val})}>+添加活动</Button></div>)
                }
              </div>
              <Radio style={radioStyle} value={4}></Radio>
              { type === 4 &&  <Input value={url} onChange={(e) => this.updateUrl(e.target.value, index)} style={{ width: '100%', marginLeft: 10 }} />}

            </Radio.Group>
          </div>
        } 
      },
      
    ];
    return (
      <div>
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={this.state.dataSource}
            components={this.components}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
            bordered={true}
            pagination={false}
          />
        </DndProvider>
        <Button type="primary" onClick={this.addRow}>新增</Button>
      </div>
    )
  }
}