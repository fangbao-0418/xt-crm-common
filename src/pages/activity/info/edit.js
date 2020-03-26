/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Card, Form, Input, message, Button, Table, Modal, Divider, InputNumber } from 'antd';
import {
  getProductList,
  // setPromotionAddSKu,
  setPromotionAddSpu,
  delSpuPromotion,
  refreshPromtion,
  getOperatorSpuList,
  getGoodsListByActivityId,
  batchMoveGoodsToOtherActivity
} from '../api';
import ActivityInfo from './ActivityInfo';
import ActivityList from './ActivityList';
import { size, filter, difference } from 'lodash';
import { gotoPage } from '@/util/utils';
import { formatMoney, formatMoneyWithSign } from '../../helper';
import { goodsColumns } from './goodsColumns';
import GoodsTransfer from '@/components/goods-transfer';
const namespace = 'activity/info/shoplist';
class List extends React.Component {
  id = this.props.match.params.id;
  payload = APP.fn.getPayload(namespace) || {};
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
      pageSize: 10
    },
    isEidt: false,
    //当前活动详情
    info: {},
    // 转移目标活动信息
    transferActivity: undefined,
    // 转移商品弹框显示状态
    transferGoodsVisible: false,
    // 可转移商品列表
    transferGoodsList: []
  };

  componentDidMount() {
    if (this.payload.promotionId === this.id) {
      this.props.form.setFieldsValue({
        productId: this.payload.productId,
        productName: this.payload.productName
      });
    } else {
      this.payload.page = 1;
    }
    this.getPromotionDetail();
  }

  getPromotionDetail = () => {
    const id = this.id;
    if (id !== 'undefined') {
      const fields = this.props.form.getFieldsValue();
      const { promotionDetail } = this.state;
      const payload = {
        promotionId: id,
        page: this.payload.page,
        pageSize: promotionDetail.size,
        ...fields
      };
      APP.fn.setPayload(namespace, payload);
      getOperatorSpuList(payload).then(res => {
        this.setState({
          promotionDetail: res || {}
        })
      });
    }
  };

  getProductList = params => {
    // type 活动类型 10为拼团活动
    const { modalPage, type } = this.state;
    getProductList({
      status: 0,
      pageSize: modalPage.pageSize,
      page: modalPage.current,
      types: type === 10 ? [0, 10] : undefined,
      ...params
    }).then((res) => {
      res = res || {};
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
        params: { id }
      }
    } = this.props;
    const { selectedRowKeys } = this.state;
    if (size(selectedRowKeys) <= 0) {
      message.error('请选择需要添加的商品');
      return false;
    }

    setPromotionAddSpu({ promotionId: id, productIdList: selectedRowKeys }).then(res => {
      if (res) {
        message.success('设置商品列表成功');
        this.handleCancelModal();
        this.getPromotionDetail();
      }
    });
  };

  // setPromotionAddSKu = promotionId => {
  //   setPromotionAddSKu({ promotionId }).then(res => []);
  // };

  handleSearchModal = e => {
    this.getProductList({ productName: e, page: 1 });
  };

  handlenChanageSelectio = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  handleClickModal = () => {
    this.getProductList();
    this.setState({
      visible: true
    });
  };

  handleCancelModal = () => {
    this.setState({
      visible: false
    });
  };

  handleOkModal = () => {
    this.setPromotionAddSpu();
  };

  handleTabChangeModal = e => {
    this.setState(
      {
        modalPage: e
      },
      () => {
        this.getProductList();
      }
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
        params: { id }
      }
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
    gotoPage('/activity/list');
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
            params: { id }
          }
        } = this.props;
        if (id !== 'undefined') {
          refreshPromtion(id).then(res => {
            res && message.success('更新成功');
          });
        }
      }
    });
  };

  handleRemove = (id, index) => () => {
    // 当前页大于1时，点击删除时当前项为最后一项，且index = 0时
    const { promotionDetail: { current, size, total } } = this.state;
    if ((current - 1) * size + (index + 1) === total && index === 0 && current > 1) {
      this.payload.page--;
    }
    Modal.confirm({
      title: '系统提示',
      content: '确定要删除该信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delSpuPromotion({ promotionSpuId: id }).then(res => {
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
    this.payload.page = 1;
    this.getPromotionDetail();
  };

  // 获取要转移到的活动信息
  handleSelectActivity = selectedRow => {
    this.setState({ transferActivity: selectedRow }, () => {
      const { info } = this.state;
      Promise.all([
        getGoodsListByActivityId({ promotionId: info.id }),
        getGoodsListByActivityId({ promotionId: this.id })
      ]).then(res => {
        const [transferActivityGoodsList, currentActivityGoodsList] = res;
        this.setState({
          transferGoodsVisible: true,
          transferGoodsList: difference(currentActivityGoodsList, transferActivityGoodsList)
        });
      });
    });
  };

  goodsTransferCancel = () => {
    this.setState({
      transferGoodsVisible: false
    });
  };

  goodsTransferOk = transferIds => {
    const _this = this;
    const { info, transferActivity } = this.state;
    batchMoveGoodsToOtherActivity({
      productIds: transferIds,
      promotionId: info.id,
      tagetPromotionId: transferActivity.id
    }).then(res => {
      if (!(res instanceof Object)) {
        APP.moon.error({
          label: '批量转移商品',
          data: res
        })
        res = {
          successCount: 0
        }
      }
      this.setState({ transferGoodsVisible: false }, () => {
        Modal.info({
          title: '转移结果',
          content: (
            <div>
              <div style={{ marginBottom: 8 }}>
                成功转移<span style={{ color: 'red' }}>{res.successCount}</span>个商品至
                <a
                  href={window.location.pathname + `#/activity/info/edit/${transferActivity.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transferActivity.title}
                </a>
              </div>
              <div>
                <div>
                  {transferIds.length != res.successCount ? (
                    <div>
                      <div>
                        <span>
                          转移失败
                          <span style={{ color: 'red' }}>{transferIds.length - res.successCount}</span>
                          个商品
                        </span>
                        <a href={res.downloadUrl} target="_blank" rel="noopener noreferrer">
                          转移失败商品清单
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ),
          okText: '关闭',
          onOk: () => {
            _this.handleSearch();
          }
        });
      });
    });
  };

  render() {
    let {
      goodsList,
      visible,
      modalPage,
      selectedRowKeys,
      promotionDetail: { records, current, size, total },
      type,
      info = {},
      transferActivity = {},
      transferGoodsList,
      transferGoodsVisible
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handlenChanageSelectio
    };

    const getSkuColumns = () => [
      {
        title: 'sku名称',
        dataIndex: 'property',
        render: text => {
          return <span>{text || '已删除'}</span>
        }
      },
      {
        title: `${type === 6 ? '助力分' : '活动价'}`,
        dataIndex: 'buyingPrice',
        render: text => (type === 6 ? formatMoney(text) : formatMoneyWithSign(text))
      },
      {
        title: '活动库存',
        dataIndex: 'inventory'
      },
      {
        title: '销量',
        key: 'saleCount',
        dataIndex: 'saleCount'
      },
      {
        title: '剩余库存',
        key: 'remainInventory',
        dataIndex: 'remainInventory'
      }
    ];
    const {
      form: { getFieldDecorator }
    } = this.props;
    // 是否显示批量转移按钮
    const isShowTransfer = type === 1 || type === 2 || type === 3;
    return (
      <>
        <ActivityInfo
          promotionDetail={records}
          changeType={info => {
            // 这里改变的type值 =================
            this.setState({ info, type: info.type });
          }}
        />
        <Card
          title="活动商品列表"
          extra={
            <>
              {isShowTransfer ? <ActivityList info={info} confirm={this.handleSelectActivity} /> : null}
              <span className="href" onClick={this.handleClickModal}>
                添加商品
              </span>
            </>
          }
        >
          <Form layout="inline">
            <Form.Item label="商品ID">
              {getFieldDecorator('productId')(<InputNumber style={{ width: '200px' }} placeholder="请输入商品ID" />)}
            </Form.Item>
            <Form.Item label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入商品名称" />)}
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleReset}>重置</Button>
              <Button className="ml10" type="primary" onClick={this.handleSearch}>
                查询
              </Button>
            </Form.Item>
          </Form>
          <Table
            rowKey={record => record.id}
            className="mt20"
            columns={goodsColumns(
              [
                {
                  title: '规格信息',
                  key: 'sku',
                  render: record => {
                    console.log('record=>', record);
                    return (
                      <Table
                        rowKey={record => record.id}
                        columns={getSkuColumns(record)}
                        dataSource={filter(record.promotionSkuList, item => item.selected)}
                        pagination={false}
                      />
                    );
                  }
                },
                {
                  title: '操作',
                  key: 'opt',
                  render: (record, rows, index) => (
                    <>
                      <span className="href" onClick={this.handleEditsku(record, type)}>
                        编辑
                      </span>
                      <Divider type="vertical" />
                      <span className="href" style={{ color: 'red' }} onClick={this.handleRemove(record.id, index)}>
                        删除
                      </span>
                    </>
                  )
                }
              ],
              'productId'
            )}
            dataSource={records}
            pagination={{
              current: current,
              pageSize: size,
              total: total,
              onChange: (page, pageSize) => {
                this.payload.page = page;
                this.getPromotionDetail();
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
            rowKey="id"
          />
        </Modal>
        <GoodsTransfer
          title="转移活动商品"
          header={
            <div style={{ marginBottom: 8 }}>
              <span style={{ display: 'inline-block', width: '50%' }}>当前活动：{info.title}</span>
              <span style={{ display: 'inline-block', width: '50%', paddingLeft: 20 }}>
                目标活动：{transferActivity.title}
              </span>
            </div>
          }
          dataSource={transferGoodsList}
          visible={transferGoodsVisible}
          onCancel={this.goodsTransferCancel}
          onOk={this.goodsTransferOk}
        />
      </>
    );
  }
}

export default Form.create()(List);
