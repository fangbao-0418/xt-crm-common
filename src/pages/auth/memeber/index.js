import React, { Component } from 'react';
import { Input, Select, Button, Row, Col, Form } from 'antd';
import Page from '@/components/page';
import moment from 'moment';
import { connect } from '@/util/utils';
import CommonTable from '@/components/common-table';
import Modal from './component/modal';
import PermissionModal from './component/permissionModal';

const FormItem = Form.Item;
const { Option } = Select;
const statusList = [
  {
    key: '全部',
    value: ''
  },
  {
    key: '禁用',
    value: 0
  },
  {
    key: '启用',
    value: 1
  }
];

const statusMap = ['禁用', '启用'];
function getColumns(scope) {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'realname'
    },
    {
      title: '账号',
      dataIndex: 'username'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(v) {
        return statusMap[v] || '';
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(v) {
        return moment(v).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '创建人',
      dataIndex: 'createUserName'
    },
    {
      title: '操作',
      render(_, record) {
        return (
          <div>
            <Button type="link" onClick={() => scope.onPermission(record)} style={{ padding: '0 10px 0 0' }}>
              权限管理
            </Button>
            <Button type="link" onClick={() => scope.onEdit(record)} style={{ padding: '0 10px 0 0' }}>
              编辑
            </Button>
            <Button type="link" onClick={() => scope.onChangeStatus(record)} style={{ padding: 0 }}>
              {record.status === 1 ? '禁用' : '启用'}
            </Button>
          </div>
        );
      }
    }
  ];
  return columns;
}

@connect(state => ({
  userConfig: state['auth.member'].userConfig
}))
@Form.create()
export default class extends Component {
  componentDidMount() {
    this.handleSearch();
  }

  onPermission = (currentUserInfo = {}) => {
    const { dispatch } = this.props;
    dispatch['auth.member'].getUserRoles(currentUserInfo);
    dispatch['auth.member'].saveDefault({
      permissionVisible: true,
      currentUserInfo
    });
  };

  onShowModal = (currentUserInfo = {}) => {
    const { dispatch } = this.props;
    dispatch['auth.member'].saveDefault({
      visible: true,
      currentUserInfo
    });
  };

  // 点击启用或者禁用操作
  onChangeStatus = item => {
    const { status } = item;
    this.props.dispatch['auth.member'].editUser({
      id: item.id,
      status: status === 1 ? 0 : 1
    });
  };

  // 切换状态下拉框
  onStatusChange = status => {
    const params = {
      status
    };
    this.handleSearch(params);
  };

  handleSearch = (params = {}) => {
    const {
      form: { validateFields },
      dispatch
    } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        const payload = {
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          realname: values.realname,
          status: params.status || params.status === '' || params.status === 0 ? params.status : values.status
        };
        dispatch['auth.member'].getUserList(payload);
      }
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="姓名">{getFieldDecorator('realname')(<Input />)}</FormItem>
        <FormItem label="状态">
          {getFieldDecorator('status', {
            initialValue: '',
            onChange: this.onStatusChange
          })(
            <Select style={{ width: 100 }}>
              {statusList.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.key}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSearch}>
            查询
          </Button>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.onShowModal}>
            添加成员
          </Button>
        </FormItem>
      </Form>
    );
  };

  onEdit = item => {
    const { dispatch } = this.props;
    dispatch['auth.member'].getUserInfo(
      {
        id: item.id
      },
      currentUserInfo => {
        this.onShowModal(currentUserInfo);
      }
    );
  };
  render() {
    const userConfig = this.props.userConfig || {};
    return (
      <Page>
        <Row>
          <Col style={{ marginBottom: 10 }}>{this.renderForm()}</Col>
          <Col>
            <CommonTable
              columns={getColumns(this)}
              dataSource={userConfig.records || []}
              onChange={this.handleSearch}
              total={userConfig.total}
              current={userConfig.current}
            />
          </Col>
          <Modal />
          <PermissionModal />
        </Row>
      </Page>
    );
  }
}
