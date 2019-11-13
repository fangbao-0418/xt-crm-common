import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox, Button, Switch, Spin, Input, Icon, Modal, Table, Tree, message } from 'antd';
import DateFns from 'date-fns';
import { initImgList } from '@/util/utils';
import { getPromotionList } from '../../activity/api';
import { getFrontCategorys, getCategory, delCategory, saveFrontCategory, updateFrontCategory } from './api';
import Ctree from './tree';
import SecondaryCategory from './secondaryCategory'
import activityType from '../../../enum/activityType'
import _ from 'lodash';
import './category.scss';

const FormItem = Form.Item;
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
    secondStatus: false
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
    });
    this.initState();
  }
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
      this.props.form.setFieldsValue({
        name: data.name,
        sort: data.sort,
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
        secondaryActText: []
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
  
      if(noValue && noValue.length){
        return message.error('请填写二级类目的所有内容')
      } 
      if (!err) {
        const list = [];
        const vosLength = newSecondCategoryVOS.length - 1;
        //过滤所有二级类目数据，对接后端接口
        let filterSecondCategoryVOS = newSecondCategoryVOS.map((item, index) => {
          const { type, icon } = item;
          let productCategoryVOS = null;

          if(type === 2){
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
              icon: icon[0].url
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

    const { getFieldDecorator } = this.props.form;
    const { modalPage, visible1, visible2, selectedRowKeys, 
        actList, productCategoryVOS, secondStatus, secondaryIndex, 
        secondaryActText, currId, secondCategoryVOS 
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
            <FormItem label="二级类目">
              {getFieldDecorator('secondStatus', {
                onChange: this.handleSwitchChange
              })(<Switch checked={secondStatus} />)}
            </FormItem>
            {
               secondStatus && <FormItem label="二级类目"><SecondaryCategory
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