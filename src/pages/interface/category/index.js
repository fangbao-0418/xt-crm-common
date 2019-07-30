import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox, Button, Spin, Input, Icon, Modal, Table, Tree, message } from 'antd';
import './category.scss';
import DateFns from 'date-fns';
import { getPromotionList } from '../../activity/api';
import { getFrontCategorys, getCategorys, getCategory, delCategory, saveFrontCategory, updateFrontCategory } from './api';
import Ctree from './tree';
import activityType from '../../../enum/activityType'
const FormItem = Form.Item;
const { TreeNode } = Tree;
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

class InterFaceCategory extends Component {

  state = {
    checkCate: false,
    checkAct: false,
    visible1: false,
    visible2: false,
    cateText: [],
    actText: [],
    selectedRows: [],
    cateList: [],
    selectedRowKeys: [],
    selectedKeys: [],
    modalPage: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    actList: [],
    currId: 0,
    productCategoryVOS: [],
    checkData: []
  }

  selectedRows = []
  cateText = []
  constructor(params) {
    super(params);
    //  this.initState();
  }

  initState() {
    this.setState({
      checkCate: false,
      checkAct: false,
      cateText: [],
      actText: [],
      currId: 0,
      productCategoryVOS: [],
      checkData: [],
      isShow: true
    })
  }


  handleClickModal = () => {
    if (this.state.actList.length == 0) this.getPromotionList();
    this.setState({
      visible1: true,
      selectedRowKeys: this.state.actText.map(val => val.id),
      selectedRows: this.state.actText
    });
  };
  handleClickModalC = () => {
    this.setState({
      visible2: true,
      checkData: this.state.cateText
    });
  };
  handleCancelModal = () => {
    this.setState({
      visible1: false,
    });
  };

  componentDidMount() {
    this.getCategorys()
  }

  getCategorys(id) {
    getFrontCategorys().then(data => {
      this.setState({
        cateList: data.records,
        currId: id || 0
      })
    });
  }
  addCategory() {
    this.props.form.setFieldsValue({
      name: '',
      sort: '',
    });
    this.initState();
  }
  getCategory(id) {
    getCategory(id).then(data => {
      const actText = [], cateText = [];
      data.productCategoryVOS.forEach(val => {
        if (val.type == 1) cateText.push(val)
        else if (val.type == 2) actText.push({
          id: val.id,
          title: val.name,
        })
      })
      const productCategoryVOS = [...actText, ...cateText];
      this.props.form.setFieldsValue({
        name: data.name,
        sort: data.sort,
      });
      this.setState({
        checkCate: cateText.length !== 0,
        checkAct: actText.length !== 0,
        cateText,
        actText,
        currId: id,
        productCategoryVOS,
        isShow: true
      })
    })
  }

  delCategory() {
    Modal.confirm({
      title: '系统提示',
      content: '确定要删除该类目吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delCategory(this.state.currId).then(data => {
          data && message.success('删除成功');
          this.getCategorys();
          this.addCategory();
        });
      }
    });

  }

  handleSave() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const list = [];
        this.state.checkAct && this.state.actText.forEach(val => {
          list.push({
            id: val.id,
            name: val.title,
            type: 2
          })
        });
        this.state.checkCate && this.state.cateText.forEach(val => {
          list.push({
            id: val.id,
            name: val.name,
            type: 1
          })
        });
        const data = {
          name: vals.name,
          sort: vals.sort,
          productCategoryVOS: list
        }
        if (this.state.currId) data.id = this.state.currId;
        (this.state.currId ? updateFrontCategory : saveFrontCategory)(data).then(data => {
          if(data.id) {
            message.success('保存成功');
            this.getCategorys(data.id);
          }
        })
      }
    })

  }
  getPromotionList = params => {
    params = params || {}
    const { modalPage } = this.state;
    // page.current += 1;
    getPromotionList({ 
      page: modalPage.current, 
      pageSize: modalPage.pageSize,
      ...params
    }).then(res => {
      modalPage.total = res.total;

      this.setState({
        actList: res.records,
      //  selectedRowKeys: [],
        modalPage,
      });
    });
  };

  handlenChanageSelectio = (selectedRowKeys, selectedRows) => {
    const objKeys = {};
    let currSelectedRows = [];
    console.log(this.state.selectedRows)
    this.state.selectedRows.forEach(val => {
      objKeys[val.id] = val;
    })
    selectedRows.forEach(val => {
      objKeys[val.id] = val;
    })
    for (const key in objKeys) {
      currSelectedRows.push(objKeys[key]);
    }
    currSelectedRows = currSelectedRows.filter(val => {
      return selectedRowKeys.includes(val.id)
    })
    this.setState({
      selectedRowKeys,
      selectedRows: currSelectedRows
    });
  };

  handleTabChangeModal = e => {
    this.setState(
      {
        modalPage: e,
      },
      () => {
        this.getPromotionList();
      },
    );
  };

  handleOkModal = e => {
    this.setState({
      actText: this.state.selectedRows,
      productCategoryVOS: [...this.state.cateText, ...this.state.selectedRows],
      visible1: false
    })
  }

  handleSearchModal = e => {
    this.getPromotionList({ name: e, page: 1 });
  };

  setCateText() {
    this.setState({
      cateText: this.cateText,
      productCategoryVOS: [...this.cateText, ...this.state.selectedRowKeys],
      visible2: false
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { modalPage, visible1, visible2, selectedRowKeys, actList, productCategoryVOS } = this.state;
    return (
      <div className="intf-cat-box">
        <Card>
          <Row className="intf-cat-list">
            {this.state.cateList.map((val, i) => {
              return <Col className={this.state.currId == val.id ? 'act' : ''} span={3} ke={i} onClick={() => this.getCategory(val.id)}>{val.name}</Col>
            })}
            <Col span={3} onClick={() => this.addCategory()}>+添加类目</Col>
          </Row>
        </Card>
        <Card style={{ display: this.state.isShow ? 'block' : 'none' }}>
          <Form {...formLayout}>
            <FormItem label="前台类目名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入前台类目名称',
                  },
                  {
                    max: 5,
                    message: '最大支持五个字符!'
                  }
                ],
              })(<Input placeholder="请输入前台类目名称" />)}
            </FormItem>
            <FormItem label="排序">
              {getFieldDecorator('sort', {
                rules: [
                  {
                    required: true,
                    message: '请输入排序数字',
                  },
                ],
              })(<Input type="number" placeholder="请输入排序数字" />)}
            </FormItem>
            <FormItem label="关联商品">
              {getFieldDecorator('productCategoryVOS', {
                initialValue: productCategoryVOS,
                rules: [
                  {
                    required: true,
                    message: '请输入关联商品',
                  },
                ],
              })(<div>
                <Checkbox checked={this.state.checkCate} onChange={(e) => {
                  this.setState({
                    checkCate: e.target.checked,
                  });
                }}>关联类目</Checkbox>
                {this.state.checkCate ? (<div className="intf-cat-rebox">
                  {this.state.cateText.map((val, i) => {
                    return <div className="intf-cat-reitem" key={i}>{val.name} <span className="close" onClick={() => {
                      const cateText = this.state.cateText;
                      cateText.splice(i, 1);
                      this.setState({ cateText })
                    }}><Icon type="close" /></span></div>
                  })}<Button type="link" onClick={this.handleClickModalC}>+添加类目</Button></div>) : ''}
                <Checkbox checked={this.state.checkAct} onChange={(e) => {
                  this.setState({
                    checkAct: e.target.checked,
                  });
                }}>关联活动</Checkbox>
                {this.state.checkAct ? (<div className="intf-cat-rebox">
                  {this.state.actText.map((val, i) => {
                    return <div className="intf-cat-reitem" key={i}>{val.title} <span className="close" onClick={() => {
                      const actText = this.state.actText;
                      actText.splice(i, 1);
                      this.setState({ actText })
                    }}><Icon type="close" /></span></div>
                  })}<Button type="link" onClick={this.handleClickModal}>+添加活动</Button></div>) : ''}
              </div>)}
            </FormItem>
            <Form.Item {...tailFormItemLayout}>
              {this.state.currId ? <Button type="danger" ghost style={{ marginRight: '10px' }} onClick={() => this.delCategory()}>删除</Button> : ''}
              <Button type="primary" onClick={() => this.handleSave()}>保存</Button>
            </Form.Item>
          </Form>
        </Card>
        <Modal
          title="选择活动"
          visible={visible1}
          width={1000}
          onCancel={this.handleCancelModal}
          onOk={this.handleOkModal}
        >
          {/* <Input.Search
            placeholder="请输入需要搜索的活动"
            style={{ marginBottom: 10 }}
            onSearch={this.handleSearchModal}
          /> */}
          <Table
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: this.handlenChanageSelectio,
            }}
            columns={actColumns()}
            dataSource={actList}
            pagination={modalPage}
            onChange={this.handleTabChangeModal}
            rowKey={record => record.id}
          />
        </Modal>
        <Modal
          title="选择类目"
          wrapClassName="intf-cat-tree-box"
          visible={visible2}
          width={800}
          onCancel={() => {
            this.setState({
              visible2: false
            })
          }}
          onOk={() => {
            this.setCateText()
          }}
        >
          <Ctree setList={(cateText) => {
            this.cateText = cateText;
          }} checkData={this.state.checkData} />
        </Modal>
      </div>
    );
  }
}


const actColumns = (data = []) => {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'title',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      render: text => (
        <>
          {activityType.getValue(text)}
        </>
      ),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text === 0 ? '关闭' : '开启'}</>,
    }
  ]
};


export default Form.create()(InterFaceCategory);