import React, { Component } from "react";
import { Card, Row, Col, Table, Tabs, Select } from "antd";
import { connect, parseQuery } from "@/util/utils";
import LevelSelect from "@/components/level-select";

const { TabPane } = Tabs;

const HAODIAN_LEVEL_OPTIONS = [{
  label: '普通会员',
  value: '0'
}, {
  label: '正式店主',
  value: '10'
}, {
  label: '高级店主',
  value: '20'
}, {
  label: '服务商',
  value: '30'
}, {
  label: '管理员',
  value: '40'
}, {
  label: '公司',
  value: '50'
}]

function getColumns(scope) {
  return [
    {
      title: "用户ID",
      dataIndex: "id",
    },
    {
      title: "昵称",
      dataIndex: "nickName",
    },
    {
      title: "姓名",
      dataIndex: "userName",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "等级",
      dataIndex: "memberTypeDO.value",
    },
  ];
}

let currentMemberType = "";
const tabConfig =  [{
  label: '喜团优选',
  value: '0'
}, {
  label: '喜团好店',
  value: '20'
}]
@connect((state) => ({
  data: state["user.userinfo"].recommenderConfig,
  loading: state.loading.effects["user.userinfo"].getRecommend,
}))
export default class extends Component {
  state = {
    bizSource: '0'
  }
  constructor(props) {
    super(props);
    const { getInstance } = this.props;
    if (typeof getInstance === "function") getInstance(this);
  }

  componentDidMount() {
    this.handleSearch();
  }
  onTypeChange = (memberType) => {
    const params = {
      memberType,
    };
    this.handleSearch(params);
    currentMemberType = memberType;
  };

  handleSearch = (params = {}) => {
    const { dispatch, history } = this.props;
    const obj = parseQuery(history);
    const payload = {
      memberId: obj.memberId,
      memberType:
        params.memberType || params.memberType === ""
          ? params.memberType
          : currentMemberType,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      bizSource: this.state.bizSource
    };
    dispatch["user.userinfo"].getRecommend(payload);
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
  componentWillUnmount() {
    currentMemberType = "";
  }
  handleTabChange = (bizSource) => {
    this.setState({
      bizSource
    }, () => {
      this.handleSearch()
    })
  }
  render() {
    const { data, loading } = this.props;
    const { bizSource } = this.state
    return (
      <Tabs activeKey={bizSource} onChange={this.handleTabChange}>
        {tabConfig.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <Card title="推荐的人">
              <Row>
                <Col style={{ marginBottom: 20 }}>
                  <span>等级：</span>
                  {bizSource === '20' ? (
                    <Select placeholder="请选择等级" style={{ width: 150 }} onChange={this.onTypeChange} allowClear>
                      {HAODIAN_LEVEL_OPTIONS.map((item) => (
                        <Select.Option value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  ): (
                    <LevelSelect onChange={this.onTypeChange} />
                  )}
                </Col>
                <Col>
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
                </Col>
              </Row>
            </Card>
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
