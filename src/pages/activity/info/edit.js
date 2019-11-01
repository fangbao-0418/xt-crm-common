/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Card, Form, Input, DatePicker, message, Button, Table, Modal, Divider } from 'antd';
import {
  getProductList,
  setPromotionAddSKu,
  setPromotionOperatorSpuList,
  getPromotionDetail,
  setPromotionAddSpu,
  delSpuPromotion,
  refreshPromtion
} from '../api';
import { size, filter } from 'lodash';
import { parseQuery, gotoPage } from '@/util/utils';
import Add from '../add';
import { formatMoney, formatMoneyWithSign } from '../../helper';
import moment from 'moment';
import activityType from '../../../enum/activityType'
import { goodsColumns } from './goodsColumns';

const FormItem = Form.Item;

class List extends React.Component {
  state = {
    goodsList: '',
    visible: false,
    visibleAct: false,
    selectedRowKeys: [],
    selectedRows: [],
    promotionDetail: {
      promotionSpuListPage: {
        current: 1,
        size: 10,
        total: 0
      }
    },
    addList: [],
    modalPage: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    isEidt: false,
  };

  componentDidMount() {
    this.getPromotionDetail();
  }

  getPromotionDetail = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== 'undefined') {
      const {promotionDetail: { promotionSpuListPage }} = this.state
      let {current, size} = promotionSpuListPage || {current: 1, size: 10}
      getPromotionDetail({ promotionId: id, page: current, pageSize: size}).then(res => {
        this.setState({
          promotionDetail: res || {}
        });
      });
    }
  };

  getProductList = params => {
    const { modalPage } = this.state;
    getProductList({
      status: 0,
      pageSize: modalPage.pageSize,
      page: modalPage.current,
      ...params,
    }).then(res => {
      modalPage.total = res.total;
      this.setState({
        goodsList: res.records,
        modalPage,
        selectedRowKeys: []
      });
    });
  };

  setPromotionAddSpu = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    if (size(selectedRowKeys) <= 0) {
      message.error('请选择需要添加的商品');
      return false;
    }

    setPromotionAddSpu({ promotionId: id, productIdList: selectedRowKeys }).then((res) => {
      if (res) {
        message.success('设置商品列表成功');
        this.handleCancelModal();
        this.getPromotionDetail();
      }
    });
  };

  setPromotionAddSKu = promotionId => {
    setPromotionAddSKu({ promotionId }).then(res => []);
  };

  setPromotionOperatorSpuList = params => {
    setPromotionOperatorSpuList(params).then(res => {
      if (res) {
        message.success('设置商品列表成功');
        this.handleCancelModal();
        this.getPromotionDetail();
      }
    });
  };


  handleSearchModal = e => {
    this.getProductList({ productName: e, page: 1 });
  };

  handlenChanageSelectio = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  handleClickModal = () => {
    this.getProductList();
    this.setState({
      visible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleOkModal = () => {
    this.setPromotionAddSpu();
  };

  handleTabChangeModal = e => {
    this.setState(
      {
        modalPage: e,
      },
      () => {
        this.getProductList();
      },
    );
  };

  disabledStartDate = startTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const endTime = fieldsValue.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  disabledEndDate = endTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const startTime = fieldsValue.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  handleEditsku = (record, type) => () => {
    const {
      history,
      match: {
        params: { id },
      },
    } = this.props;
    localStorage.setItem('editsku', JSON.stringify({ type, ...record }));
    history.push(`/activity/info/detail/${id}`);
  };

  handleInputValue = (text, record, index) => e => {
    const { promotionDetail } = this.state;
    this.setState({ promotionDetail });
  };

  handleReturn = () => {
    // const { history } = this.props;
    // const params = parseQuery();
    gotoPage('/activity/list')
    // history.push(`/activity/list?page=${params.page}&pageSize=${params.pageSize}`);
  };
  updateSync = () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要更新同步活动吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {
          match: {
            params: { id },
          },
        } = this.props;
        if (id !== 'undefined') {
          refreshPromtion(id).then((res) => {
            res && message.success('更新成功');
          });
        }
      }
    });
  }

  handleRemove = id => () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要删除该信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delSpuPromotion({ promotionSpuId: id }).then((res) => {
          res && message.success('成功');
          this.getPromotionDetail();
        });
      }
    });

  };

  render() {
    let {
      goodsList,
      visible,
      modalPage,
      selectedRowKeys,
      promotionDetail,
      promotionDetail: { promotionSpuListPage, type, title, startTime, endTime, sort },
      isEidt,
    } = this.state;
    promotionSpuListPage = promotionSpuListPage || {};
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handlenChanageSelectio,
    };

    const getSkuColumns = () => [
      {
        title: 'sku名称',
        dataIndex: 'property',
      },
      {
        title: `${type === 6 ? '助力分' : '活动价'}`,
        dataIndex: 'buyingPrice',
        render: text => type === 6 ? formatMoney(text) : formatMoneyWithSign(text),
      },
      {
        title: '活动库存',
        dataIndex: 'inventory',
      },
    ];


    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <>
        <Card
          style={{ marginBottom: 10 }}
          title="活动信息"
          extra={<a href="javacript:void(0);" onClick={() => this.setState({ visibleAct: true })}>编辑</a>}
        >
          <Form layout="inline">
            <FormItem layout="inline" label="活动类型">
              {activityType.getValue(type)}
            </FormItem>
            <FormItem layout="inline" label="活动名称">
              {getFieldDecorator('title', {
                initialValue: title,
              })(<Input placeholder="请输入需要编辑的活动名称" disabled={!isEidt} />)}
            </FormItem>
            <FormItem layout="inline" label="开始时间">
              {getFieldDecorator('startTime', {
                initialValue: moment(startTime),
              })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEidt} disabledDate={this.disabledStartDate} />)}
            </FormItem>
            <FormItem layout="inline" label="结束时间">
              {getFieldDecorator('endTime', {
                initialValue: moment(endTime),
              })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEidt} disabledDate={this.disabledEndDate} />)}
            </FormItem>
            <FormItem layout="inline" label="活动排序">
              {getFieldDecorator('sort', {
                initialValue: sort,
              })(<Input placeholder="请输入排序" disabled={!isEidt} />)}
            </FormItem>
          </Form>
        </Card>
        <Card
          title="活动商品列表"
          extra={
            <>
              <a href="javascript:void(0);" onClick={this.handleClickModal}>
                添加商品
              </a>
            </>
          }
        >
          <Form layout="inline">
            <Form.Item label="商品id">
              {getFieldDecorator('productId')(
                <Input placeholder="请输入商品id"/>
              )}
            </Form.Item>
            <Form.Item label="商品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入商品名称"/>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>
          </Form>
          <Table
            className="mt20"
            columns={goodsColumns([
              {
                title: '规格信息',
                render: record => {
                  console.log('record=>', record)
                  return (
                    <Table
                      columns={getSkuColumns(record)}
                      dataSource={filter(record.promotionSkuList, item => item.selected)}
                      pagination={false}
                    />
                  );
                },
              },
              {
                title: '操作',
                render: record => (
                  <>
                    <a href="javascript:void(0);" onClick={this.handleEditsku(record, type)}>
                      编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                      href="javascript:void(0);"
                      style={{ color: 'red' }}
                      onClick={this.handleRemove(record.id)}
                    >
                      删除
                    </a>
                  </>
                ),
              },
            ])}
            dataSource={promotionSpuListPage.records}
            pagination={{
              current: promotionSpuListPage.current,
              pageSize: promotionSpuListPage.size,
              total: promotionSpuListPage.total,
              onChange: (page, pageSize) => {
                this.setState({
                  promotionDetail: {
                    ...promotionDetail,
                    promotionSpuListPage: {
                      ...promotionSpuListPage,
                      current: page
                    }
                  }
                }, this.getPromotionDetail)
              }
            }}
          />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Button type="danger" onClick={this.handleReturn} style={{ marginRight: '10px' }}>
            返回
          </Button>
          <Button type="primary" onClick={this.updateSync}>
            更新同步
          </Button>
        </Card>
        <Modal
          title="选择商品"
          visible={visible}
          width="80%"
          onCancel={this.handleCancelModal}
          onOk={this.handleOkModal}
        >
          <Input.Search
            placeholder="请输入需要搜索的商品"
            style={{ marginBottom: 10 }}
            onSearch={this.handleSearchModal}
          />
          <Table
            rowSelection={rowSelection}
            columns={goodsColumns()}
            dataSource={goodsList}
            pagination={modalPage}
            onChange={this.handleTabChangeModal}
            rowKey={record => record.id}
          />
        </Modal>
        <Modal
          title="活动编辑"
          visible={this.state.visibleAct}
          width={1000}
          footer={null}
          onCancel={() => this.setState({
            visibleAct: false
          })}
        >
          <Add history={this.props.history} data={this.state.promotionDetail} onOk={() => {
            this.setState({
              visibleAct: false
            });
            this.getPromotionDetail();
          }} />
        </Modal>
      </>
    );
  }
}

export default Form.create()(List);
