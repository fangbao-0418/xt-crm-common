/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Card, Form, Input, message, Button, Table, Modal, Divider, InputNumber } from 'antd';
import {
  getProductList,
  setPromotionAddSKu,
  setPromotionAddSpu,
  delSpuPromotion,
  refreshPromtion,
  getOperatorSpuList
} from '../api';
import ActivityInfo from './ActivityInfo';
import { size, filter } from 'lodash';
import { gotoPage } from '@/util/utils';
import { formatMoney, formatMoneyWithSign } from '../../helper';
import { getaActivityColumns, goodsColumns } from './columns';
const namespace = 'activity/info/shoplist'
class List extends React.Component {
  id = this.props.match.params.id
  payload =  APP.fn.getPayload(namespace) || {}
  state = {
    goodsList: [],
    visible: false,
    visibleAct: false,
    selectedRowKeys: [],
    selectedRows: [],
    promotionDetail: {
      current: 1,
      size: 10,
      total: 0,
      records: []
    },
    addList: [],
    type: -1,
    modalPage: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    isEidt: false,
  };

  componentDidMount() {
    if (this.payload.promotionId === this.id) {
      this.props.form.setFieldsValue({
        productId: this.payload.productId,
        productName: this.payload.productName
      })
    } else {
      this.payload.page = 1
    }
    this.getPromotionDetail();
  }

  getPromotionDetail = () => {
    const id = this.id
    if (id !== 'undefined') {
      const fields = this.props.form.getFieldsValue()
      const { promotionDetail } = this.state
      const payload = {
        promotionId: id,
        page: this.payload.page,
        pageSize: promotionDetail.size,
        ...fields
      }
      APP.fn.setPayload(namespace, payload)
      getOperatorSpuList(payload).then(res => {
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
  handleReset = () => {
    this.props.form.resetFields();
    this.getPromotionDetail();
  };
  handleSearch = () => {
    this.payload.page = 1
    this.getPromotionDetail()
  }
  render() {
    let {
      goodsList,
      visible,
      modalPage,
      selectedRowKeys,
      promotionDetail,
      promotionDetail: {
        records,   
        current,
        size,
        total
      },
      type
    } = this.state;
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
        <ActivityInfo promotionDetail={records} changeType={(type) => { this.setState({ type }) }}/>
        <Card
          title="活动商品列表"
          extra={
            (
              <span className="href" onClick={this.handleClickModal}>
                添加商品
              </span>
            )
          }
        >
          <Form layout="inline">
            <Form.Item label="商品ID">
              {getFieldDecorator('productId')(
                <InputNumber style={{width: '200px'}} placeholder="请输入商品ID"/>
              )}
            </Form.Item>
            <Form.Item label="商品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入商品名称"/>
              )}
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleReset}>重置</Button>
              <Button className="ml10" type="primary" onClick={this.handleSearch}>查询</Button>
            </Form.Item>
          </Form>
          <Table
            rowKey="id"
            className="mt20"
            columns={getaActivityColumns([
              {
                title: '规格信息',
                render: record => {
                  console.log('record=>', record)
                  return (
                    <Table
                      rowKey="id"
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
                    <span className="href" onClick={this.handleEditsku(record, type)}>
                      编辑
                    </span>
                    <Divider type="vertical" />
                    <span
                      className="href"
                      style={{ color: 'red' }}
                      onClick={this.handleRemove(record.id)}
                    >
                      删除
                    </span>
                  </>
                ),
              },
            ])}
            dataSource={records}
            pagination={{
              current: current,
              pageSize: size,
              total: total,
              onChange: (page, pageSize) => {
                this.payload.page = page
                this.getPromotionDetail()
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
            columns={goodsColumns}
            dataSource={goodsList}
            pagination={modalPage}
            onChange={this.handleTabChangeModal}
            rowKey="id"
          />
        </Modal>
      </>
    );
  }
}

export default Form.create()(List);
