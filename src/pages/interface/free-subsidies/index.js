import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Form, Checkbox, Button, Switch, Spin, Input, Icon, Modal, Table, Tree, message, Select } from 'antd';
import DateFns from 'date-fns';
import { initImgList } from '@/util/utils';
import { getPromotionList } from '../../activity/api';
import { getFrontCategorys, getCategory, delCategory, saveFrontCategory, updateFrontCategory } from './api';
import Ctree from '../category/tree';
import moment from 'moment';
import activityType from '../../../enum/activityType'
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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
    actText: [],
    selectedSecondary: [],
    secondaryIndex: null,
    secondaryActText: [],
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
    checkData: [],
    activityParams: {}
  }

  selectedRows = []
  constructor(params) {
    super(params);
    //  this.initState();
  }

  initState() {
    this.setState({
      checkCate: false,
      checkAct: false,
      actText: [],
      currId: 0,
      productCategoryVOS: [],
      checkData: [],
      isShow: true,
    })
  }


  handleClickModal = (data = {}) => {
    if (this.state.actList.length == 0) this.getPromotionList();
    
    this.setState({
      visible1Type: null,
      visible1: true,
      selectedRowKeys: this.state.actText.map(val => val.id),
      selectedRows: this.state.actText
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
  //添加新的一级目录
  addCategory() {
    this.props.form.setFieldsValue({
      name: '',
      sort: '',
    });
    this.initState();
  }
  getCategory(id) {
    getCategory(id).then(data => {
      const actText = [];
      data.productCategoryVOS.forEach(val => {
        actText.push({
          id: val.id,
          title: val.name,
        })
      })
      const productCategoryVOS = [...actText];
      this.props.form.setFieldsValue({
        name: data.name,
        sort: data.sort,
      });

      this.setState({
        checkAct: actText.length !== 0,
        actText,
        currId: id,
        productCategoryVOS,
        isShow: true,
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
        this.state.actText.forEach(val => {
          list.push({
            id: val.id,
            name: val.title,
            type: 2
          })
        });

        let data = {
          name: vals.name,
          sort: vals.sort,
          productCategoryVOS: list,
          showType: 2 //展示位置（0：首页展示，1：行业类目展示 2:免单类目）
        }

        if (this.state.currId) data.id = this.state.currId;
        (this.state.currId ? updateFrontCategory : saveFrontCategory)(data).then(data => {
          if (data && data.id) {
            message.success('保存成功');
            this.getCategorys(data.id);
          }
        })
      }
    })

  }
  getPromotionList = params => {
    const { activityParams, modalPage } = this.state;
    const nowParams = params || activityParams;
    //只能添加体验团长专区的活动，限制活动type
    if(!nowParams.type)nowParams.type = 6;
    // page.current += 1;
    getPromotionList({
      ...nowParams,
      page: params ? 1 : modalPage.current,
      pageSize: modalPage.pageSize,
    }).then(res => {
      modalPage.total = res.total;

      this.setState({
        actList: res.records,
        modalPage: { ...modalPage, current: params ? 1 : modalPage.current},
        activityParams: nowParams
      });
    });
  };

  handlenChanageSelectio = (selectedRowKeys, selectedRows) => {
    const { visible1Type, selectedSecondary } = this.state;

    const objKeys = {};
    let currSelectedRows = [];
    if(visible1Type !== null){
      selectedSecondary.forEach(val => {
        objKeys[val.id] = val;
      })
    } else {
      this.state.selectedRows.forEach(val => {
        objKeys[val.id] = val;
      })
    }
    
    selectedRows.forEach(val => {
      objKeys[val.id] = val;
    })
    for (const key in objKeys) {
      currSelectedRows.push(objKeys[key]);
    }
    currSelectedRows = currSelectedRows.filter(val => {
      return selectedRowKeys.includes(val.id)
    })

    if(visible1Type !== null){
      return this.setState({
        selectedRowKeys,
        selectedSecondary: currSelectedRows
      });
    } 

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
      productCategoryVOS: [...this.state.selectedRows],
      visible1: false
    })
    this.props.form.setFieldsValue({productCategoryVOS: [...this.state.selectedRows]})
  }

  handleSearchModal = e => {
    this.getPromotionList({ name: e, page: 1 });
  };


  render() {

    const { getFieldDecorator } = this.props.form;
    const { modalPage, visible1, selectedRowKeys, 
        actList, productCategoryVOS,
      } = this.state;
    return (
      <div className="intf-cat-box">
        <Card>
          <Row className="intf-cat-list">
            {this.state.cateList.map((val, i) => {
              return <Col className={this.state.currId == val.id ? 'act' : ''} span={3} key={val.id} onClick={() => this.getCategory(val.id)}>{val.name}</Col>
            })}
            <Col span={3} onClick={() => this.addCategory()}>+添加类目</Col>
          </Row>
        </Card>
        <Card style={{ display: this.state.isShow ? 'block' : 'none' }}>
          <Form {...formLayout}>
            <FormItem label="类目名称">
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
            <FormItem label="活动ID">
              {getFieldDecorator('productCategoryVOS', {
                initialValue: productCategoryVOS,
                rules: [
                  {
                    required: true,
                    message: '请关联活动',
                  },
                ],
              })(<div className="intf-cat-rebox">
                  {this.state.actText.map((val, i) => {
                    return <div className="intf-cat-reitem" key={i}>{val.title} <span className="close" onClick={() => {
                      const actText = this.state.actText;
                      actText.splice(i, 1);
                      this.setState({ actText })
                    }}><Icon type="close" /></span></div>
                  })}<Button type="link" onClick={this.handleClickModal}>+添加活动</Button>
              </div>)}
            </FormItem>
            <Form.Item {...tailFormItemLayout}>
              <div style={{textAlign: 'right'}}>
                {this.state.currId ? <Button type="danger" ghost style={{ marginRight: '10px' }} onClick={() => this.delCategory()}>删除</Button> : ''}
                <Button type="primary" onClick={() => this.handleSave()}>保存</Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
        <GetActivityModal
          handleCancelModal={this.handleCancelModal}
          handleOkModal={this.handleOkModal}
          actList={actList}
          selectedRowKeys={selectedRowKeys}
          modalPage={modalPage}
          visible1={visible1}
          handleTabChangeModal={this.handleTabChangeModal}
          handlenChanageSelectio={this.handlenChanageSelectio}
          getPromotionList={this.getPromotionList}
        />
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

class GetActivity extends Component {

  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        let params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: 1,
          pageSize: 20,
        };
        params = _.omitBy(params, (val, key) => {
          return key === 'time' || _.isNil(val) || val === '';
        });
        this.props.getPromotionList(params);
      }
    });
  };
  render() {
    const { 
      handleCancelModal, handleOkModal, 
      actList, selectedRowKeys, modalPage, 
      visible1, handleTabChangeModal, 
      handlenChanageSelectio, form
    } = this.props;
    const { getFieldDecorator, resetFields } = form;
    return <Modal
        title="选择活动"
        visible={visible1}
        width={1000}
        onCancel={handleCancelModal}
        onOk={handleOkModal}
      >
        <Form layout="inline" style={{marginBottom: '20px'}}>
            <FormItem label="活动名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(<Input placeholder="请输入活动名称" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="活动ID">
              {getFieldDecorator('promotionId', {
                initialValue: ''
              })(<Input placeholder="请输入活动ID" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="商品名称">
              {getFieldDecorator('productName',{
                initialValue: ''
              })(
                <Input placeholder="请输入商品名称" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="商品ID">
              {getFieldDecorator('productId', {
                initialValue: ''
              })(
                <Input placeholder="请输入商品ID" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="活动类型">
              {getFieldDecorator('type', {
                initialValue: ""
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  {activityType.getArray().filter(val => val.val == '体验团长专区').map((val, i) => (
                    <Option value={val.key} key={i}>
                      {val.val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="活动状态">
              {getFieldDecorator('status', {
                initialValue: ""
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  <Option value="0">关闭</Option>
                  <Option value="1">开启</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="有效时间">
              {getFieldDecorator('time', {
                initialValue: ['',''],
              })(
                <RangePicker
                  style={{ width: 430 }}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />,
              )}
            </FormItem>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={() => resetFields()}>
                重置
              </Button>
            </div>
          </Form>
        <Table
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: handlenChanageSelectio,
          }}
          columns={actColumns()}
          dataSource={actList}
          pagination={modalPage}
          onChange={handleTabChangeModal}
          rowKey={record => record.id}
        />
      </Modal>
  }
}

const GetActivityModal = Form.create()(GetActivity)


export default Form.create()(InterFaceCategory);