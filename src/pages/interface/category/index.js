import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Form, Checkbox, Button, Switch, Radio, Input, Icon, Modal, Table, message, Select } from 'antd';
import DateFns from 'date-fns';
import { initImgList } from '@/util/utils';
import { getPromotionList } from '../../activity/api';
import { getFrontCategorys, getCategory, delCategory, saveFrontCategory, updateFrontCategory } from './api';
import Ctree from './tree';
import moment from 'moment';
import SecondaryCategory from './secondaryCategory'
import activityType from '../../../enum/activityType'
import _ from 'lodash';
import './category.scss';

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
    visible2: false,
    cateText: [],
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
    secondStatus: false,
    activityParams: {}
  }

  selectedRows = []
  cateText = []
  constructor(params) {
    super(params);
    //  this.initState();
  }

  //初始化
  initState() {
    this.setState({
      checkCate: false,
      checkAct: false,
      cateText: [],
      actText: [],
      currId: 0,
      productCategoryVOS: [],
      checkData: [],
      isShow: true,
      secondStatus: false,
      secondaryActText: [],
      secondCategoryVOS: [],
      secondaryIndex: null
    })
  }


  handleClickModal = (data = {}) => {
    const { type, index, secondaryActText } = data;

    if (this.state.actList.length == 0) this.getPromotionList();
    
    if(type === 'secondary'){
      this.setState({
        visible1Type: type,
        visible1: true,
        secondaryIndex: index,
        selectedRowKeys: secondaryActText ? secondaryActText.map(val => val.id) : [],
        selectedSecondary: secondaryActText || []
      });
    } else {
      this.setState({
        visible1Type: null,
        visible1: true,
        selectedRowKeys: this.state.actText.map(val => val.id),
        selectedRows: this.state.actText
      });
    }
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

  //添加新的一级目录
  addCategory() {
    this.props.form.setFieldsValue({
      name: '',
      sort: '',
      showType: 1,
    });
    this.initState();
  }

  //获取单个类目信息
  getCategory(id) {
    getCategory(id).then(data => {
      const { secondStatus, secondCategoryVOS } = data;
      const actText = [], cateText = [];
      data.productCategoryVOS.forEach(val => {
        if (val.type == 1) cateText.push(val)
        else if (val.type == 2) actText.push({
          id: val.id,
          title: val.name,
        })
      })
      const productCategoryVOS = [...actText, ...cateText];
      let { showType } = data;
      console.log(typeof(showType), 'showType')
      if(!showType && showType !== 0){
        showType = 1;
      }

      this.props.form.setFieldsValue({
        name: data.name,
        sort: data.sort,
        showType: showType,
        secondName: data.secondName,
        styleType: !data.styleType ? 1 : data.styleType
      });
      
      const filterIconsecondCategoryVOS = secondCategoryVOS.map(item => {
        item.icon = initImgList(item.icon)
        return item
      }) || []

      this.setState({
        checkCate: cateText.length !== 0,
        checkAct: actText.length !== 0,
        cateText,
        actText,
        currId: id,
        productCategoryVOS,
        isShow: true,
        secondStatus: secondStatus === 1 ? true : false,
        secondCategoryVOS: filterIconsecondCategoryVOS,
        secondaryActText: [],
        secondName: data.secondName
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

  //保持类目信息
  handleSave() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      console.log(vals, 'vals')
      const { secondStatus, secondCategoryVOS } = this.state;
      const newSecondCategoryVOS = _.cloneDeep(secondCategoryVOS);
      //开关校验
      if(secondStatus && !secondCategoryVOS.length){
        return message.error('请填写二级类目的所有内容')
      }
      //细节校验
      let noValue = secondCategoryVOS.filter(item => {
        if(item.type === 2){
          if(!item.productCategoryVOS || !item.productCategoryVOS.length){
            return item;
          }
        }
        if(item.type === 4 && !item.url){
          return item
        }
        if(!item.name || !item.icon){
          return item
        }
      })
  
      if(secondStatus && noValue && noValue.length){
        return message.error('请填写二级类目的所有内容')
      } 
      if (!err) {
        const list = [];
        const vosLength = newSecondCategoryVOS.length - 1;
        //过滤所有二级类目数据，对接后端接口
        let filterSecondCategoryVOS = newSecondCategoryVOS.map((item, index) => {
          const { type, icon } = item;
          let productCategoryVOS = null;

          if(type === 2 && item.productCategoryVOS){
            productCategoryVOS = item.productCategoryVOS.map(vos => {
              return {
                id: vos.id,
                type,
              }
            })
          }
          return Object.assign(
            item,
            {
              productCategoryVOS: productCategoryVOS ? productCategoryVOS : item.productCategoryVOS,
              sort: vosLength - index,
              icon: icon ? icon[0].url : ''
            }
          )
        })
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
            level: val.level,
            name: val.name,
            type: 1
          })
        });
        let data = {
          name: vals.name,
          sort: vals.sort,
          showType: vals.showType,
          styleType: vals.styleType ? vals.styleType : 1,
          secondName: vals.secondName,
          productCategoryVOS: list,
          secondStatus: secondStatus ? 1 : 0,
          secondCategoryVOS: filterSecondCategoryVOS
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
    const { visible1Type, secondCategoryVOS, secondaryIndex, selectedSecondary } = this.state;
    
    if(visible1Type !== null){
      if(secondaryIndex !== null && secondCategoryVOS[secondaryIndex].type !== 4){
        secondCategoryVOS[secondaryIndex].productCategoryVOS =  selectedSecondary;
      }
      return this.setState({
        secondaryActText: selectedSecondary,
        visible1: false,
        secondCategoryVOS
      })
    }

    this.setState({
      actText: this.state.selectedRows,
      productCategoryVOS: [...this.state.cateText, ...this.state.selectedRows],
      visible1: false
    })
  }

  handleSearchModal = e => {
    this.getPromotionList({ name: e, page: 1 });
  };

  //处理二级类目按钮开关
  handleSwitchChange = (val) => {
    this.setState({
      secondStatus: val
    })
  }

  //updateSecondtegoryVOS二级类目组件更新数据
  updateSecondtegoryVOS = (dataSource) => {
    this.setState({
      secondCategoryVOS: dataSource
    })
  }

  setCateText() {
    this.setState({
      cateText: this.cateText,
      productCategoryVOS: [...this.cateText, ...this.state.selectedRowKeys],
      visible2: false
    })
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { modalPage, visible1, visible2, selectedRowKeys, 
        actList, productCategoryVOS, secondStatus, secondaryIndex, 
        secondaryActText, currId, secondCategoryVOS 
      } = this.state;
    const showType = getFieldValue('showType');
    const secondName = getFieldValue('secondName') || this.state.secondName;
    getFieldValue('styleType');
    return (
      <div className="intf-cat-box">
        <Card>
          <Row className="intf-cat-list">
            {this.state.cateList.map((val, i) => {
            return <Col className={this.state.currId == val.id ? 'act' : ''} span={3} key={val.id} onClick={() => this.getCategory(val.id)}>{val.showType === 0 && <Icon type="home" style={{ paddingRight: '10px',color: 'red'}}/>}{val.name}</Col>
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
            <FormItem label="展示位置">
              {getFieldDecorator('showType', {
                  initialValue: 1,
                })(<Radio.Group onChange={this.showTypeChange}> 
                  <Radio value={0}>首页展示</Radio>
                  <Radio value={1}>行业类目展示</Radio>
                </Radio.Group>)}
            </FormItem>
            {
              showType === 0 &&
              <>
                <FormItem label="副标题" style={{display: showType === 0 ? 'block' : 'none'}}>
                  {getFieldDecorator('secondName', {
                    initialValue: secondName,
                    rules: [
                      {
                        required: true,
                        message: '请输入副标题名称',
                      },
                      {
                        max: 5,
                        message: '最大支持五个字符!'
                      }
                    ],
                  })(<Input placeholder="请输入副标题" />)}
                </FormItem>
                <FormItem label="商品展示方式" style={{display: showType === 0 ? 'block' : 'none'}}>
                  {getFieldDecorator('styleType', {
                      initialValue: 1,
                    })(<Radio.Group>
                      <Radio value={1}>1行1品</Radio>
                      <Radio value={2}>1行2品</Radio>
                    </Radio.Group>)}
                </FormItem>
              </>
            }
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
            {
              showType === 1 && <FormItem label="二级类目开关">
                {getFieldDecorator('secondStatus', {
                  onChange: this.handleSwitchChange
                })(<Switch checked={secondStatus} />)}
                <span style={{paddingLeft: '10px',color: 'red'}}>
                  只控制前台是否展示
                </span>
              </FormItem> 
            }
            {
               secondStatus && showType === 1 && <FormItem label="二级类目内容"><SecondaryCategory
                  key={currId} 
                  secondaryIndex={secondaryIndex} 
                  secondCategoryVOS={secondCategoryVOS}
                  secondaryActText={secondaryActText}
                  handleClickModal={this.handleClickModal}
                  updateSecondtegoryVOS={this.updateSecondtegoryVOS}
                ></SecondaryCategory></FormItem>
             }
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
                  {activityType.getArray().map((val, i) => (
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