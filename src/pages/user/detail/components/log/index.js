import React, { Component } from "react";
import { Table, Tooltip, Tabs } from "antd";
import moment from "moment";
import { connect, parseQuery } from "@/util/utils";

const { TabPane } = Tabs;
const timeFormat = "YYYY-MM-DD HH:mm:ss";
const tabConfig =  [{
  label: '喜团优选',
  value: '1'
}, {
  label: '喜团好店',
  value: '2'
}]
function getColumns(scope) {
  return [
    {
      title: "提现单号",
      dataIndex: "withdrawalCode",
    },
    {
      title: "支付流水号",
      dataIndex: "payOrderNo",
      render(v) {
        if (v && v !== "0") return v;
      },
    },
    {
      title: "提现时间",
      dataIndex: "createTime",
      render(v) {
        return v ? moment(v).format(timeFormat) : "";
      },
    },
    {
      title: "到账时间",
      dataIndex: "arriveTime",
      render(v) {
        return v ? moment(v).format(timeFormat) : "";
      },
    },
    {
      title: "提现类型",
      dataIndex: "withdrawalType",
    },
    {
      title: "提现金额",
      dataIndex: "money",
      render(v) {
        return <span>{v / 100}</span>;
      },
    },
    {
      title: "提现方式",
      dataIndex: "accountType",
    },
    {
      title: "提现账号",
      dataIndex: "accountNumber",
    },
    {
      title: "状态",
      dataIndex: "transferStatusDO.value",
    },
    {
      title: "备注",
      dataIndex: "description",
      render(v) {
        if (v && v !== "0") {
          if (v.length > 5) {
            const base = v.slice(0, 5);
            return <Tooltip title={v}>{base}...</Tooltip>;
          } else {
            return v;
          }
        }
      },
    },
  ];
}
@connect((state) => ({
  data: state["user.userinfo"].logConfig,
  loading: state.loading.effects["user.userinfo"].getLog,
}))
export default class extends Component {
  state = {
    activeKey: '1'
  }
  constructor(props) {
    super(props);
    const { getInstance } = this.props;
    if (typeof getInstance === "function") getInstance(this);
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = (params = {}) => {
    const { dispatch, history } = this.props;
    const obj = parseQuery(history);
    const payload = {
      memberId: obj.memberId,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    };
    dispatch["user.userinfo"].getLog(payload);
  };

  showTotal = (total) => {
    return <span>共{total}条数据</span>;
  };
  onChange = (pageConfig) => {
    const params = {
      page: pageConfig.current,
      pageSize: pageConfig.pageSize,
    };
    this.handleSearch(params);
  };
  handleTabChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }
  render() {
    const { data, loading } = this.props;
    const { activeKey } = this.state
    return (
      <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
        {tabConfig.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <Table
              dataSource={data.records}
              columns={getColumns(this)}
              pagination={{
                total: data.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this.showTotal,
                current: data.current,
              }}
              onChange={this.onChange}
              rowKey={(record) => record.id}
              loading={loading}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
