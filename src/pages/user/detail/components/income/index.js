import React, { Component, useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Modal,
  Tabs,
} from "antd";
import { connect, parseQuery } from "@/util/utils";
import MoneyRender from "@/components/money-render";
import {
  getProceedsListByOrderIdAndMemberId,
  getProceedsListByOrderIdAndMemberIdAndSkuId,
} from "../../api";

const { TabPane } = Tabs;
const ChildOrderTable = (props) => {
  const {
    record: { mainOrderNo },
    memberId,
    tab
  } = props;
  const [isFirstLoaded, useIsFirstLoaded] = useState(true);
  const [dataSource, useDataSource] = useState([]);

  useEffect(() => {
    if (isFirstLoaded) {
      getProceedsListByOrderIdAndMemberId({ mainOrderNo, memberId, tab }).then(
        (result) => {
          useDataSource(result);
        }
      );
      useIsFirstLoaded(false);
    }
  });

  const columns = [
    {
      title: "子订单号",
      width: "30%",
      dataIndex: "childOrderNo",
      render: (childOrderNo, record) => {
        return (
          <a
            onClick={() => {
              props.showModal(props.record, record);
            }}
          >
            {childOrderNo}
          </a>
        );
      },
    },
    {
      title: "SKU名称",
      width: "25%",
      dataIndex: "skuName",
    },
    {
      title: "商品ID",
      width: "15%",
      dataIndex: "productId",
    },
    {
      title: "收益类型",
      width: "10%",
      dataIndex: "incomeTypeDesc",
    },
    {
      title: "已结算收益",
      width: "10%",
      dataIndex: "settledAmount",
      render: MoneyRender,
    },
    {
      title: "未结算收益",
      width: "10%",
      dataIndex: "unSettledAmount",
      render: MoneyRender,
    },
  ];

  return (
    <>
      <Table
        rowKey={(record) => record.childOrderNo}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

function getColumns(scope) {
  return [
    {
      title: "订单编号",
      dataIndex: "orderCode",
    },
    {
      title: "收益类型",
      dataIndex: "incomeTypeDesc",
    },
    {
      title: "已结算收益",
      dataIndex: "settledAmount",
      render: MoneyRender,
    },
    {
      title: "未结算收益",
      dataIndex: "unSettledAmount",
      render: MoneyRender,
    },
  ];
}

const namespace = "user.userinfo";

const tabConfig =  [{
  label: '喜团优选',
  value: '1'
}, {
  label: '喜团好店',
  value: '2'
}]

const options1 = [{
  label: '全部',
  value: ''
}, {
  label: '价差收益',
  value: '10'
}, {
  label: '平推奖励',
  value: '20'
}]

const options2 = [{
  label: '全部',
  value: ''
}, {
  label: '零售收益',
  value: '30'
}, {
  label: '邀请奖励',
  value: '40'
}, {
  label: '团队奖励',
  value: '50'
}]

@connect((state) => ({
  data: state["user.userinfo"].incomeConfig,
}))
@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    const { getInstance } = this.props;
    if (typeof getInstance === "function") getInstance(this);
    this.state = {
      visible: false,
      activeKey: '1',
      detailList: [],
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = (params = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, history } = this.props;
        const obj = parseQuery(history);
        const payload = {
          memberId: obj.memberId,
          orderCode: values.orderCode || undefined,
          incomeTypeCode: values.incomeTypeCode || undefined,
          minSettledAmount: values.minSettledAmount || undefined,
          maxSettledAmount: values.maxSettledAmount || undefined,
          minUnSettledAmount: values.minUnSettledAmount || undefined,
          maxUnSettledAmount: values.maxUnSettledAmount || undefined,
          pageNum: params.current || 1,
          pageSize: params.pageSize || 10,
        };
        dispatch[namespace].getIncome({
          ...payload,
          tab: params.tab || this.state.activeKey
        });
      }
    });
  };

  onChange = (pagination) => {
    this.handleSearch(pagination);
  };

  expandedRowRender = (record, index, indent, expanded) => {
    const obj = parseQuery();
    return expanded ? (
      <ChildOrderTable
        tab={this.state.activeKey}
        record={record}
        memberId={obj.memberId}
        showModal={this.showModal}
      />
    ) : null;
  };

  showModal = (mainOrder, childOrder) => {
    const { memberId } = parseQuery();
    const { mainOrderNo } = mainOrder;
    const { skuId, childOrderNo } = childOrder;
    getProceedsListByOrderIdAndMemberIdAndSkuId({
      mainOrderNo,
      memberId,
      skuId,
      tab: this.state.activeKey,
      orderId: childOrderNo
    }).then((result) => {
      this.setState({
        detailList: result,
        visible: true,
      });
    });
  };
  handleTabChange = (activeKey) => {
    this.setState({
      activeKey
    }, () => {
      this.handleSearch({
        tab: activeKey,
        current: 1
      });
    })
  }
  render() {
    const {
      data,
      form: { getFieldDecorator },
    } = this.props;
    const { detailList, visible, activeKey } = this.state;
    const options = activeKey === '1' ? options1 : options2
    const detailColumns = [
      {
        title: "时间",
        width: "15%",
        dataIndex: "occurrenceTime",
      },
      {
        title: "收益类型",
        width: "15%",
        dataIndex: "incomeTypeDesc",
      },
      {
        title: "事件",
        width: "15%",
        dataIndex: "operatorTypeDesc",
      },
      {
        title: "收益金额",
        width: "15%",
        dataIndex: "amount",
        render: MoneyRender,
      },
      {
        title: "结算状态",
        width: "20%",
        dataIndex: "settleStatus",
      },
      {
        title: "结算时间",
        width: "20%",
        dataIndex: "settleTime",
      },
    ];
    return (
      <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
        {tabConfig.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <Card title="收益列表">
              <Form layout="inline" style={{ paddingBottom: 24 }}>
                <Form.Item label="订单编号">
                  {getFieldDecorator(`orderCode`)(<Input style={{ width: 140 }} />)}
                </Form.Item>

                <Form.Item label="收益类型">
                  {getFieldDecorator(`incomeTypeCode`)(
                    <Select style={{ width: 100 }}>
                      {options.map((item) => (
                        <Select.Option value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item label="已结算收益金额" style={{ marginRight: 0 }}>
                  {getFieldDecorator(`minSettledAmount`)(
                    <InputNumber min={0} precision={2} style={{ width: 60 }} />
                  )}
                  <span style={{ padding: "0 8px" }}>-</span>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`maxSettledAmount`)(
                    <InputNumber min={0} precision={2} style={{ width: 60 }} />
                  )}
                </Form.Item>

                <Form.Item label="未结算收益金额" style={{ marginRight: 0 }}>
                  {getFieldDecorator(`minUnSettledAmount`)(
                    <InputNumber min={0} precision={2} style={{ width: 60 }} />
                  )}
                  <span style={{ padding: "0 8px" }}>-</span>
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator(`maxUnSettledAmount`)(
                    <InputNumber min={0} precision={2} style={{ width: 60 }} />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.handleSearch}>
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => this.props.form.resetFields()}
                  >
                    清除
                  </Button>
                </Form.Item>
              </Form>
              <Table
                dataSource={data.list}
                columns={getColumns(this)}
                pagination={{
                  current: data.pageNum,
                  pageSize: parseInt(data.pageSize),
                  total: data.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                rowKey={(records) => records.mainOrderNo}
                onChange={this.onChange}
                expandedRowRender={this.expandedRowRender}
              />
              <Modal
                title={"收益详细历史记录"}
                visible={visible}
                width="900px"
                bodyStyle={{
                  padding: 0,
                  minHeight: 540,
                }}
                onCancel={() => {
                  this.setState({
                    visible: false,
                  });
                }}
                footer={[
                  <Button
                    type="primary"
                    key="back"
                    onClick={() => {
                      this.setState({
                        visible: false,
                      });
                    }}
                  >
                    取消
                  </Button>,
                ]}
              >
                <Table
                  rowKey={(record) => record.id}
                  columns={detailColumns}
                  dataSource={detailList}
                  pagination={false}
                  scroll={{ y: 540 }}
                />
              </Modal>
            </Card>
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
