import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox, Button, Input, Icon, Modal, message } from 'antd';
import { initImgList } from '@/util/utils';
import { getPromotionList } from '../../activity/api';
import UploadView from '@/components/upload';
import { getFrontCategorys, getCategory, delCategory, saveFrontCategory, updateFrontCategory } from './api';
import Ctree from './tree';
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
    secondStatus: false,
    activityParams: {}
  }

  selectedRows = []
  cateText = []

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

    if (this.state.actList.length === 0) this.getPromotionList();

    if (type === 'secondary') {
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
      icon: [],
      secondIcon: [],
      showType: 6,
    });
    this.initState();
  }

  //获取单个类目信息
  getCategory(id) {
    getCategory(id).then(data => {
      const { secondCategoryVOS } = data;
      const productCategoryVOS = data.productCategoryVOS;
      let { showType } = data;
      this.props.form.setFieldsValue({
        name: data.name,
        sort: data.sort,
        showType: showType,
        secondName: data.secondName,
        icon:  data.icon,
        secondIcon:  data.secondIcon,
      });

      const filterIconsecondCategoryVOS = secondCategoryVOS.map(item => {
        item.icon = initImgList(item.icon)
        return item
      }) || []

      this.setState({
        cateText: productCategoryVOS,
        currId: id,
        productCategoryVOS,
        isShow: true,
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
      if (!err) {
        const list = [];
         this.state.cateText.forEach(val => {
          list.push({
            id: val.id,
            level: 1,
            name: val.name,
            type: 1
          })
        });
        let data = {
          name: vals.name,
          sort: vals.sort,
          showType: 6,
          secondName: vals.secondName,
          productCategoryVOS: list,
          icon: typeof vals.icon === 'string' ? vals.icon : vals.icon[0].rurl,
          secondIcon: typeof vals.secondIcon === 'string' ?  vals.secondIcon : vals.secondIcon[0].rurl,
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
        modalPage: { ...modalPage, current: params ? 1 : modalPage.current },
        activityParams: nowParams
      });
    });
  };

  handlenChanageSelectio = (selectedRowKeys, selectedRows) => {
    const { visible1Type, selectedSecondary } = this.state;

    const objKeys = {};
    let currSelectedRows = [];
    if (visible1Type !== null) {
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

    if (visible1Type !== null) {
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

    if (visible1Type !== null) {
      if (secondaryIndex !== null && secondCategoryVOS[secondaryIndex].type !== 4) {
        secondCategoryVOS[secondaryIndex].productCategoryVOS = selectedSecondary;
      }
      return this.setState({
        secondaryActText: selectedSecondary,
        visible1: false,
        secondCategoryVOS
      })
    }

    this.setState({
      actText: this.state.selectedRows,
      productCategoryVOS: this.state.cateText,
      visible1: false
    })
  }

  setCateText() {
    this.setState({
      cateText: this.cateText,
      productCategoryVOS: this.cateText,
      visible2: false
    })
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible2, productCategoryVOS } = this.state;
    getFieldValue('styleType');
    return (
      <div className="intf-cat-box">
        <Card>
          <Row className="intf-cat-list">
            {this.state.cateList.map((val, i) => {
              return <Col className={this.state.currId === val.id ? 'act' : ''} span={3} key={val.id} onClick={() => this.getCategory(val.id)}>{val.showType === 0 && <Icon type="home" style={{ paddingRight: '10px', color: 'red' }} />}{val.name}</Col>
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
                <Checkbox checked={true}>关联类目</Checkbox>
                <div className="intf-cat-rebox">
                  {this.state.cateText.map((val, i) => {
                    return <div className="intf-cat-reitem" key={i}>{val.name} <span className="close" onClick={() => {
                      const cateText = this.state.cateText;
                      cateText.splice(i, 1);
                      this.setState({ cateText })
                    }}><Icon type="close" /></span></div>
                  })}<Button type="link" onClick={this.handleClickModalC}>+添加类目</Button></div>
              </div>)}
            </FormItem>
            <FormItem
              label='类目球'
            >
              {getFieldDecorator('icon', {
                rules: [
                  {
                    required: true,
                    message: '请上传类目球',
                  },
                ],
              })(
                <UploadView
                  placeholder='上传类目球'
                  listType='picture-card'
                  listNum={1}
                  size={0.3}
                />
                
              )}
              <div>（请上传尺寸144*144，png,jpg格式文件）</div>
            </FormItem>
            <FormItem
              label='类目图标'
            >
              {getFieldDecorator('secondIcon', {
                rules: [
                  {
                    required: true,
                    message: '请上传类目图标',
                  }
                ],
              })(
                <UploadView
                  placeholder='上传类目图标'
                  listType='picture-card'
                  listNum={1}
                  size={0.3}
                />
              )}
               <div>（请上传尺寸150*150，png,jpg格式文件）</div>
            </FormItem>
            <Form.Item {...tailFormItemLayout}>
              <div style={{ textAlign: 'right' }}>
                {this.state.currId ? <Button type="danger" ghost style={{ marginRight: '10px' }} onClick={() => this.delCategory()}>删除</Button> : ''}
                <Button type="primary" onClick={() => this.handleSave()}>保存</Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
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

export default Form.create()(InterFaceCategory);