import React, { Component } from 'react'
import UploadView from '@/components/upload'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import _ from 'lodash'
import { Radio, Row, Col, Form, Checkbox, Button, Spin, Input, Icon, Modal, Table, Tree, message } from 'antd';
import './index.scss'

let dragingIndex = -1
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
}

const titleRender = (title) => {
  return <div><span style={{ color: 'red' }}>*</span>{title}</div>
}

class BodyRow extends React.Component {
  render () {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props
    const style = { ...restProps.style, cursor: 'move' }

    let { className } = restProps
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
  beginDrag (props) {
    dragingIndex = props.index
    return {
      index: props.index
    }
  }
}

const rowTarget = {
  drop (props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
}

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
)

export default class extends Component {
  state = {
    initialData: {
      id: null,
      name: '',
      icon: null,
      productCategoryVOS: null,
      sort: null,
      type: 2,
      url: ''
    },
    dataSource: [],
    noValue: false
  }

  componentDidMount () {
    const { secondCategoryVOS } = this.props
    const { initialData } = this.state
    if (secondCategoryVOS && secondCategoryVOS.length) {
      this.setState({
        dataSource: secondCategoryVOS
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

  componentWillReceiveProps (newProps) {
    console.log('will receive props')
    const { dataSource } = this.state
    const { secondaryIndex, secondaryActText } = newProps
    if (secondaryIndex !== null && dataSource[secondaryIndex].type !== 4 && !_.isEqual(newProps, this.props)) {
      dataSource[secondaryIndex].productCategoryVOS = secondaryActText
      this.setState({
        dataSource
      }, () => {
        this.submitToForm()
      })
    }
  }

  components = {
    body: {
      row: DragableBodyRow
    }
  }

  // 拖动事件
  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];

    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
      () => {
      this.submitToForm();
    });
  };

  // 修改名字
  nameChange = (val, index) => {
    const { dataSource } = this.state

    dataSource[index].name = val
    this.setState({
      dataSource: dataSource
    }, () => this.submitToForm())
  }

  //更新url
  updateUrl = (val, index) => {
    const { dataSource } = this.state
    dataSource[index].url = val
    this.setState({
      dataSource: dataSource
    }, () => this.submitToForm())
  }

  //单选按钮变化
  radioChange = (val, record, index)=> {
    console.log(val, 'val')
    const { dataSource } = this.state
    let { productCategoryVOS } = dataSource[index]

    //单选，需要删除另一项的数据
    if (val === 2) {
      dataSource[index].url = ''
    } else if (val === 4) {
      productCategoryVOS = null
    }

    //同步productCategoryVOS的type字段
    if (productCategoryVOS) {
      productCategoryVOS = productCategoryVOS.map(item => {
        item.type = val
        return item
      })
    }

    //更新最外层的type 类型（2：活动，4：链接）
    dataSource[index].type = val
    dataSource[index].productCategoryVOS = productCategoryVOS
    dataSource[index] = {
      ...dataSource[index]
    }
    console.log(dataSource, 'dataSource')
    this.setState({
      dataSource: dataSource
    }, () => {
      this.submitToForm()
    })
  };

  //新增一个二级类目
  addRow = () => {
    const { dataSource, initialData } = this.state

    dataSource.push(_.cloneDeep(initialData))
    this.setState({
      dataSource
    }, () => this.submitToForm())
  }

  //删除一个二级类目
  deleteRow = (index) => {
    const { dataSource } = this.state
    if (dataSource.length > 4) {
      dataSource.splice(index, 1)
      this.setState({
        dataSource
      }, () => this.submitToForm())
    }
  }

  //图片上传后的回调
  imgUpload = (file, index) => {
    const { dataSource } = this.state
    dataSource[index].icon = file.length ? file : null
    this.setState({
      dataSource
    }, () => this.submitToForm())
  }

  /**
   * @param {(1|2)} type - 类型 1-类目 2-活动
   */
  deleteActivity = (record, i, index, type) => {
    const { dataSource } = this.state
    if (type === 1) {
      record.categoryVOS.splice(i, 1)
    } else {
      record.productCategoryVOS.splice(i, 1)
    }
    dataSource[index] = record
    this.setState({
      dataSource
    }, () => this.submitToForm())
  }

  //提交信息到外层form
  submitToForm = () => {
    const { updateSecondtegoryVOS } = this.props
    const { dataSource } = this.state
    const noValue = dataSource.filter(item => {
      if (item.type === 2) {
        if (!item.productCategoryVOS || !item.productCategoryVOS.length) {
          return item
        }
      }
      if (item.type === 4 && !item.url) {
        return item
      }
      if (!item.name || !item.icon) {
        return item
      }
    })

    updateSecondtegoryVOS(dataSource)
    if (!noValue || !noValue.length) {
      this.setState({
        noValue: false
      })
    } else {
      this.setState({
        noValue: true
      })
    }
  }

  render () {
    const { handleClickModal, handleClickModalC } = this.props
    const { noValue, dataSource } = this.state
    console.log(dataSource, 'secondary rener')
    const columns = [
      {
        title: titleRender('图片'),
        dataIndex: 'icon',
        render: (val, record, index) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ cursor: 'pointer', marginRight: '6px' }}>
                <Icon onClick={() => this.deleteRow(index)} type="delete" />
              </span>
              <UploadView
                value={ val && val.length ? val : [] }
                onChange={file => this.imgUpload(file, index)}
                className='secondary-category'
                listType='picture-card'
                fileType={['jpg', 'jpeg', 'gif', 'png']}
                pxSize={[{ width: 150, height: 150 }]}
                listNum={1}
              >
              </UploadView>
            </div>
          )
        }
      },
      {
        title: titleRender('名称'),
        dataIndex: 'name',
        render: (val, record, index) => {
          return (
            <>
              <Input
                maxLength={5}
                placeholder='请输入类目名称'
                value={val}
                onChange={(e) => this.nameChange(e.target.value, index)}
              />
            </>
          )
        }
      },
      {
        title: titleRender('内容：提供单选功能：活动和自定义链接'),
        dataIndex: 'productCategoryVOS',
        width: 400,
        render: (val, record, index) => {
          const { url } = record
          const type = record.type instanceof Array ? type : [type]
          console.log(record, type, index, 'type type')
          /** 所选类目 */
          const categoryVOS = record.categoryVOS || []
          const productCategoryVOS = record.productCategoryVOS || []
          return (
            <div>
              <Checkbox.Group
                onChange={(e) => {
                  this.radioChange(e, record, index)
                }}
                // value={type}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* <Checkbox style={radioStyle} value={2}>添加活动</Checkbox> */}
                  {
                    (1 || type === 2) ? (
                      <div>
                        <div>
                          <Button
                            type='link'
                            onClick={() => handleClickModal({ type: 'secondary', index, secondaryActText: productCategoryVOS })}
                          >
                            +添加活动
                          </Button>
                        </div>
                        {
                          productCategoryVOS.map((item, i) => {
                            return (
                              <div className='intf-cat-reitem' key={i}>
                                {item.title || item.name}
                                <span
                                  className='close'
                                  onClick={() => {
                                    this.deleteActivity(record, i, index, 2)
                                  }}
                                >
                                  <Icon type='close' />
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) : null
                  }
                </div>
                <div style={{ display: 'flex' }}>
                  {/* <Checkbox style={radioStyle} value={1}>添加类目</Checkbox> */}
                  {
                    (1 || type === 1) ? (
                      <div>
                        <div>
                          <Button
                            type='link'
                            onClick={() => {
                              handleClickModal({ type: 'category', index, secondaryActText: val, categoryVOS })
                            }}
                          >
                            +添加类目
                          </Button>
                        </div>
                        {
                          categoryVOS.map((item, i) => {
                            return (
                              <div className='intf-cat-reitem' key={i}>{item.title || item.name}
                                <span
                                  className='close'
                                  onClick={() => {
                                    this.deleteActivity(record, i, index, 1)
                                  }}
                                >
                                  <Icon type='close' />
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) : null
                  }
                </div>
                {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Radio style={radioStyle} value={4}>自定义链接</Radio>
                  {
                    type === 4 ? <Input value={url} onChange={(e) => this.updateUrl(e.target.value, index)} style={{ width: '100%', marginLeft: 10 }} /> : null
                  }
                </div> */}
              </Checkbox.Group>
            </div>
          )
        }
      }
    ]
    return (
      <div>
        <p style={{ color: 'red' }}>
          1.图片尺寸为150*150px，支持jpg/png/gif<br />
          2.二级类目最少配置4个，数量尽量控制为4的倍数<br />
          3.可拖动内容模块进行排序
        </p>
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={dataSource}
            components={this.components}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow
            })}
            bordered={true}
            pagination={false}
          />
        </DndProvider>
        {
          noValue && <p style={{ color: 'red' }}>请填写全部规则内容</p>
        }
        <Button type='primary' onClick={this.addRow}>新增</Button>
      </div>
    )
  }
}