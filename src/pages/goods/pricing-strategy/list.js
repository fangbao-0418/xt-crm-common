/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Divider, message } from 'antd';
import DateFns from 'date-fns';
import { getPromotionList, putIsAvailable, getCategory, getByCategoryId, getByRuleId } from './api';
import moment from 'moment';
import { setQuery, parseQuery, uuid } from '@/util/utils';
import Add from './add'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;


class List extends React.Component {
  constructor(props) {
    super(props);
    const params = parseQuery();
    this.state = {
      listData: [],
      page: {
        current: +params.page || 1,
        total: 0,
        pageSize: 20,
      },
      initParams: params,
      visible: false,
      modalTitle: '',
      categorys: [],
      editSource: {}
    };
  }

  componentDidMount() {
    const params = parseQuery();
    this.getPromotionList(params);
    this.getCategory({level: 1});
  }

  //设置禁用成功
  setDisablePromotion = id => {
    const params = parseQuery();

    putIsAvailable({ ruleId: id }).then((res) => {
      res && message.success('关闭成功');
      this.getPromotionList(params);
    });
  };

  //设置启用成功
  setEnablePromotion = id => {
    putIsAvailable({ ruleId: id }).then((res) => {
      res && message.success('开启成功');
      this.getPromotionList(parseQuery());
    });
  };
  //获取定价策略列表
  getPromotionList = params => {
    const { page, categorys } = this.state;

    if(params){
      let category = categorys.filter(item => {
        return item.name === params.categoryId || item.id === Number(params.categoryId) 
      })
      params = Object.assign(params, {categoryId: category[0] && category[0].id})
    }

    getPromotionList({ page: page.current, pageSize: page.pageSize, ...params }).then((res = {}) => {
      page.total = res.total;

      this.setState({
        listData: res.records,
        page,
      });
      
      setQuery({ page: page.current, pageSize: page.pageSize, ...params});
    });
  };

  //获得一级类目
  getCategory = params => {
    getCategory({ ...params }).then((res =[]) => {
      this.setState({
        categorys: res,
      });
    })
  }


  //查询按钮调用的方法
  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {

      if (!err) {
        const { createtime, operationtime } = vals
        const params = {
          ...vals,
          startCreateTime: createtime && createtime[0] && +new Date(createtime[0]),
          endCreateTime: createtime && createtime[1] && +new Date(createtime[1]),
          startModifyTime: operationtime && operationtime[0] && +new Date(operationtime[0]),
          endModifyTime: operationtime && operationtime[1] && +new Date(operationtime[1]),
          page: 1,
          pageSize: 20
        };
        delete params.createtime;
        delete params.operationtime;

        this.getPromotionList(params);
      }
    });
  };
  //清楚筛选条件
  handleClearConditions = () => {
    const { resetFields } = this.props.form;
    const { page } = this.state;
    setQuery({page: page.current, pageSize: page.pageSize}, true);
    resetFields();
  }

  //分页更新数据
  handleTabChange = e => {
    this.setState(
      {
        page: e,
      },
      () => {
        const params = parseQuery();
        this.getPromotionList({
          ...params,
          page: e.current,
          pageSize: e.pageSize
        });
      },
    );
  };

  //禁用定价策略  
  hanadleDisablePromotion = id => () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要禁用此策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setDisablePromotion(id);
      }
    });
  };

  //启用定价策略
  handleEnablePromotion = id => () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要开启此策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setEnablePromotion(id);
      }
    });
    
  };

  render() {
    
    const { listData, page } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '策略名称',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '一级类目',
        dataIndex: 'categoryName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: createTime => <>{DateFns.format(createTime, 'YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: status => <>{status === 0 ? '禁用' : '启用'}</>,
      },
      {
        title: '最后操作时间',
        dataIndex: 'modifyTime',
        render: modifyTime => <>{DateFns.format(modifyTime, 'YYYY-MM-DD HH:mm:ss')}</>,

      },
      {
        title: '最后操作人',
        dataIndex: 'operator'
      },
      {
        title: '操作',
        render: record => (
          <>
            {record.status ? (
              <a
                href="javascript:void(0);"
                style={{ color: '#ff6600' }}
                onClick={this.hanadleDisablePromotion(record.id)}
              >
                禁用
              </a>
            ) : (
              <a
                href="javascript:void(0);"
                style={{ color: '#ff6600' }}
                onClick={this.handleEnablePromotion(record.id)}
              >
                启用
              </a>
            )}
            <Divider type="vertical" />
            <a onClick={()=>this.setState({visible: true, modalTitle: '编辑定价策略', editSource: record, type: 'edit'})}>编辑</a>
          </>
        ),
      },
    ];

    const {
      form: { getFieldDecorator },
    } = this.props;

    const { initParams, modalTitle, categorys, editSource, type } = this.state;
    return (
      <>
        <Card>
          <Form layout="inline">
            <FormItem label="策略名称">
              {getFieldDecorator('name', {
                initialValue: initParams.name
              })(<Input placeholder="策略名称" />)}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: initParams.status || "",
              })(
                <Select style={{ width: 100 }}>
                  <Option value="">全部</Option>
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="一级类目">
              {getFieldDecorator('categoryId', {
                initialValue: initParams.categoryId || "",
              })(
                <Select style={{ width: 100 }}> 
                  <Option value="">全部</Option>
                  {
                    categorys.map(item => {
                      return <Option key={item.id} value={item.name}>{item.name}</Option>
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem label="创建时间">{getFieldDecorator('createtime', {
              initialValue: [
                initParams.startCreateTime ? moment(+initParams.startCreateTime) : '',
                initParams.endCreateTime ? moment(+initParams.endCreateTime) : ''
              ]
            })(<RangePicker format="YYYY-MM-DD HH:mm" showTime={{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}/>)}</FormItem>
            <FormItem label="操作时间">{getFieldDecorator('operationtime', {
              initialValue: [
                initParams.startModifyTime ? moment(+initParams.startModifyTime) : '',
                initParams.endModifyTime ? moment(+initParams.endModifyTime) : ''
              ]
            })(<RangePicker format="YYYY-MM-DD HH:mm" showTime={{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}/>)}</FormItem>
            <FormItem>
              <Button onClick={this.handleClearConditions}>
                清楚条件
              </Button>
              <Button style={{ margin: '0 10px' }} type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button type="primary" onClick={()=>this.setState({visible: true, modalTitle: '新建定价策略', type: 'add', editSource:{}})} >
                新建策略
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            columns={columns}
            dataSource={listData}
            pagination={page}
            rowKey={record => record.id}
            onChange={this.handleTabChange}
          />
        </Card>
        <Modal
          key={uuid()}
          title={modalTitle}
          visible={this.state.visible}
          width={1000}
          footer={null}
          onCancel={()=>this.setState({
            visible: false
          })}
        >
          <Add 
            onCancel={
              ()=>{
                this.getPromotionList(parseQuery());
                this.setState({
                  visible: false
                })
              }
            }
            type={type}
            editSource={editSource}
          ></Add>
        </Modal>
      </>
    );
  }
}

export default Form.create()(List);
