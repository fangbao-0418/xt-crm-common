import React, { Component } from 'react';
import { connect } from '@/util/utils';
import { Row, Col, Icon, Popconfirm, Modal, Input, Form } from 'antd';
import CategorySelect from '@/components/categorySelect';

// function setTitle(item, level) {
//     let titleConfig = {
//         text: '类目删除后不可回复，确认删除？',
//         canDel: true,
//     };
//     if (level !== 'third' && item.childs) { // 为第一第二类目则判断子类目是否为空
//         titleConfig.text = '当前类目下子类目不为空, 不能删除!';
//         titleConfig.canDel = false;
//     } else { // 三级类目判断商品是否为空
//         if (item.nums) {
//             titleConfig.text = '当前类目下商品不为空, 不能删除!';
//             titleConfig.canDel = false;
//         }
//     }
//     return titleConfig;
// }

const levelMap = {
  first: 1,
  second: 2,
  third: 3
};
const FormItem = Form.Item;

@connect(state => ({
  level1List: state['shop.commission'].level1List,
  level2List: state['shop.commission'].level2List,
  level3List: state['shop.commission'].level3List
}))
@Form.create()
export default class extends Component {

  state = {
    first: {},
    second: {},
    third: {},
    visible: false,
    editVisible: false,
    currentLevel: '', // 新增的时候保存level
    currentLevel1: {},
    currentLevel2: {},
    parentItem: {},
    currentItem: {} // 当前被编辑的item
  }

  componentDidMount() {
    const payload = {
      level: 1
    }
    this.handleSearch(payload);
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch['shop.commission'].getList(params);
  }

  // 查询
  onSearch = (name, level) => {
    const num = levelMap[level];
    const parent = this.state[`currentLevel${num - 1}`] || {};
    const payload = {
      level: num,
      name,
      parentId: parent.id
    };
    // this.setState({
    //     [`currentLevel${levelMap[level]}`]: {}
    // })
    this.handleSearch(payload);
  }

  onItemClick = (key, item) => {
    if (!key) return;
    const num = levelMap[key];
    this.setState({
      [`currentLevel${num}`]: item // 点击新增的时候获取parentId
    });
    if (num === 1) {
      this.setState({
        currentLevel2: {}
      })
    }
    const payload = {
      parentId: item.id,
      level: num + 1 // 点击一级，获取二级数据；点击二级，获取三级数据
    };
    this.handleSearch(payload);
  }

  onShowEditModal = (item) => {
    this.setState({
      currentItem: item,
      editVisible: true
    })
  }

  onConfirm = (item) => {
    const { dispatch } = this.props;
    dispatch['shop.commission'].delCategory(item, () => {
      const { level, id } = item;
      const obj = this.state[`currentLevel${level}`] || {};
      if (id === obj.id) {
        if (level === 2) {
          this.setState({
            [`currentLevel${level}`]: {}
          })
        }
        if (level === 1) {
          this.setState({
            currentLevel1: {},
            currentLevel2: {}
          })
        }
      }
    });

  }

  onShowModal = (currentLevel) => {
    const level = levelMap[currentLevel];
    this.setState({
      visible: true,
      currentLevel: level,
      parentItem: this.state[`currentLevel${level - 1}`] || {}
    });
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  }

  // 新增的时候
  onOk = () => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const payload = {
          name: values.name,
          parentId: this.state.parentItem.id,
          level: this.state.currentLevel
        };
        dispatch['shop.commission'].addCategory(payload);
        this.setState({
          visible: false
        })
      }
    })
  }

  onEdit = () => {
    const { form: { validateFields }, dispatch } = this.props;
    const { currentItem } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const payload = {
          name: values.name,
          parentId: currentItem.parentId,
          id: currentItem.id,
          level: currentItem.level
        };
        dispatch['shop.commission'].editCategory(payload, { level: currentItem.level, parentId: currentItem.parentId });
        this.setState({
          editVisible: false
        })
      }
    })
  }

  onEditCancel = () => {
    this.setState({
      editVisible: false
    })
  }

  renderActions = (item, level) => {
    return (
      <div>
        <Icon type="edit" onClick={() => this.onShowEditModal(item)} />
        <Popconfirm title="类目删除后不可恢复，确认删除?" onConfirm={() => this.onConfirm(item)}>
          <Icon type="delete" />
        </Popconfirm>
      </div>
    )
  }

  render() {
    const { form: { getFieldDecorator }, level1List, level2List, level3List } = this.props;
    const { currentItem } = this.state;
    return (
      <Row gutter={16}>
        <Col span={8}>
          <CategorySelect
            buttonText="添加一级类目"
            data={level1List}
            onSearch={(value) => this.onSearch(value, 'first')}
            onItemClick={(item) => this.onItemClick('first', item)}
            renderActions={(item) => this.renderActions(item, 'first')}
            onBtnClick={() => this.onShowModal('first')}
          />
        </Col>
        {
          this.state.currentLevel1.name ?
            <Col span={8}>
              <CategorySelect
                buttonText="添加二级类目"
                data={level2List}
                onItemClick={(item) => this.onItemClick('second', item)}
                onSearch={(value) => this.onSearch(value, 'second')}
                renderActions={(item) => this.renderActions(item, 'second')}
                onBtnClick={() => this.onShowModal('second')}
              />
            </Col> : ''
        }
        {
          this.state.currentLevel2.name ?
            <Col span={8}>
              <CategorySelect
                buttonText="添加三级类目"
                data={level3List}
                onItemClick={(item) => this.onItemClick(null, item)}
                onSearch={(value) => this.onSearch(value, 'third')}
                renderActions={(item) => this.renderActions(item, 'third')}
                onBtnClick={() => this.onShowModal('third')}
              />
            </Col> : null
        }
        {
          this.state.visible ?
            <Modal
              destroyOnClose
              onCancel={this.onCancel}
              onOk={this.onOk}
              title="新增"
              visible={this.state.visible}
            >
              <Form layout="inline">
                <FormItem label="名称">
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        message: '类目名称必填!'
                      }]
                    })(
                      <Input />
                    )
                  }
                </FormItem>
                {
                  this.state.parentItem.name ?
                    <FormItem label="父类目">
                      {
                        getFieldDecorator('parentId', {
                          initialValue: this.state.parentItem.name
                        })(
                          <Input disabled />
                        )
                      }
                    </FormItem> : ''
                }
              </Form>
            </Modal> : ''
        }
        {
          this.state.editVisible ?
            <Modal
              destroyOnClose
              onCancel={this.onEditCancel}
              onOk={this.onEdit}
              title="编辑"
              visible={this.state.editVisible}
            >
              <Form layout="inline">
                <FormItem label="名称">
                  {
                    getFieldDecorator('name', {
                      initialValue: currentItem.name,
                      rules: [{
                        required: true,
                        message: '类目名称必填!'
                      }]
                    })(
                      <Input />
                    )
                  }
                </FormItem>
                {
                  currentItem.parentName ?
                    <FormItem label="父类目">
                      {
                        getFieldDecorator('parentId', {
                          initialValue: currentItem.parentName
                        })(
                          <Input disabled />
                        )
                      }
                    </FormItem> : ''
                }
              </Form>
            </Modal> : ''
        }
      </Row>
    )
  }
}
