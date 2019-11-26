import React, { Component } from 'react';
import { Input, Select, Button, Row, Col, Form, Table, Card, Divider, message, Modal, Checkbox, Radio } from 'antd';
import { connect, setQuery, parseQuery } from '@/util/utils';
import styles from './index.module.sass';
import BlockList from './block-list';
import { omitBy, isNil, concat, difference } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const levelList = [
  { key: '全部', value: '' },
  { key: '团长', value: 10 },
  { key: '社区管理员', value: 20 },
  { key: '城市合伙人', value: 30 }
];
const permissionList = [
  { key: '全部', value: '' },
  { key: '已开启', value: 1 },
  { key: '未开启', value: 0 }
];
const namespace = 'user.intercept.user';

@connect(state => {
  return {
    dataSource: state[namespace],
    loading: state.loading.models[namespace]
  };
})
@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      choiceVisible: false,
      selectedRowKeys: [],
      blockList: [],
      idsByLevel: [{ memberType: 10 }, { memberType: 20 }, { memberType: 30 }],
      phoneVisible: false,
      valueByPhone: '',
      switchValueByPhone: '1'
    };
  }
  componentDidMount() {
    this.handleSearch();
  }

  render() {
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id'
      },
      {
        title: '昵称',
        dataIndex: 'nickName'
      },
      {
        title: '姓名',
        dataIndex: 'userName'
      },
      {
        title: '手机号',
        dataIndex: 'phone'
      },
      {
        title: '等级',
        dataIndex: 'memberTypeDesc'
      },
      {
        title: '拦截权限',
        dataIndex: 'orderInterceptionDesc'
      },
      {
        title: '操作',
        width: 180,
        dataIndex: 'orderInterception',
        render: (orderInterception, record) => {
          return (
            <div>
              <Button type="link" style={{ padding: 0 }} onClick={() => this.togglePrivilege(record)}>
                {orderInterception === 1 ? '关闭权限' : '开启权限'}
              </Button>
              <Divider type="vertical" />
              <a
                href={`/#/user/intercept/detail?id=${record.id}&iphone=${record.phone}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                查看详情
              </a>
            </div>
          );
        }
      }
    ];

    const { data } = this.props.dataSource;
    const {
      visible,
      level,
      choiceVisible,
      selectedRowKeys,
      blockList,
      idsByLevel,
      phoneVisible,
      valueByPhone,
      switchValueByPhone
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: selectedRowKeys => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    const blockListByHead = blockList.find(item => item.memberType === 10) || {};
    const blockListByDistrict = blockList.find(item => item.memberType === 20) || {};
    const blockListByPartner = blockList.find(item => item.memberType === 30) || {};
    const currentBlockList = blockList.find(item => item.memberType === level);

    const idsByLevelByHead = idsByLevel.find(item => item.memberType === 10) || {};
    const idsByLevelByDistrict = idsByLevel.find(item => item.memberType === 20) || {};
    const idsByLevelByPartner = idsByLevel.find(item => item.memberType === 30) || {};
    const currentIdsByLevel = idsByLevel.find(item => item.memberType === level) || {};

    const blockListByHeadCount = difference(
      concat(blockListByHead.checkedMemberIds || [], idsByLevelByHead.addIds || []),
      idsByLevelByHead.delIds || []
    ).length;
    const blockListByDistrictCount = difference(
      concat(blockListByDistrict.checkedMemberIds || [], idsByLevelByDistrict.addIds || []),
      idsByLevelByDistrict.delIds || []
    ).length;
    const blockListByPartnerCount = difference(
      concat(blockListByPartner.checkedMemberIds || [], idsByLevelByPartner.addIds || []),
      idsByLevelByPartner.delIds || []
    ).length;
    return (
      <div>
        <Card>{this.renderForm()}</Card>

        <Card>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <div style={{ flex: 'auto' }}>
              <Button type="primary" onClick={this.setPrivilegeByLevel}>
                按等级设置
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.setPrivilegeByPhone}>
                按手机号批量设置
              </Button>
            </div>
            <Button type="primary" style={{ marginRight: 8 }} onClick={this.batchOpenPrivilege}>
              批量开启
            </Button>
            <Button type="primary" onClick={this.batchClosePrivilege}>
              批量关闭
            </Button>
          </div>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={data['records']}
            rowSelection={rowSelection}
            pagination={{
              current: data['current'] || 1,
              pageSize: data['size'] || 10,
              total: data['total'],
              showQuickJumper: true,
              showSizeChanger: true
            }}
            onChange={pagination => {
              this.handleSearch(pagination);
            }}
          />
        </Card>

        <Modal
          title={'按会员等级设置拦截权限'}
          visible={visible}
          style={{ fontSize: 20, fontWeight: 'bold' }}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByHead && blockListByHead.privileged}
              onClick={() => {
                this.changePrivileged(blockListByHead);
              }}
            >
              全部团长
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 10)}>
              黑名单({blockListByHeadCount}人)
            </Button>
          </div>
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByDistrict && blockListByDistrict.privileged}
              onClick={() => {
                this.changePrivileged(blockListByDistrict);
              }}
            >
              全部社区管理员
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 20)}>
              黑名单({blockListByDistrictCount}人)
            </Button>
          </div>
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByPartner && blockListByPartner.privileged}
              onClick={() => {
                this.changePrivileged(blockListByPartner);
              }}
            >
              全部城市合伙人
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 30)}>
              黑名单({blockListByPartnerCount}人)
            </Button>
          </div>
          <div>提示：勾选后除黑名单外所有选中级别用户都将开启拦截发货权限</div>
        </Modal>
        <Modal
          title={'按会员等级设置拦截权限'}
          visible={visible}
          style={{ fontSize: 20, fontWeight: 'bold' }}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByHead && blockListByHead.privileged}
              onClick={() => {
                this.changePrivileged(blockListByHead);
              }}
            >
              全部团长
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 10)}>
              黑名单({blockListByHeadCount}人)
            </Button>
          </div>
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByDistrict && blockListByDistrict.privileged}
              onClick={() => {
                this.changePrivileged(blockListByDistrict);
              }}
            >
              全部社区管理员
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 20)}>
              黑名单({blockListByDistrictCount}人)
            </Button>
          </div>
          <div style={{ paddingBottom: '20px' }}>
            <Checkbox
              checked={blockListByPartner && blockListByPartner.privileged}
              onClick={() => {
                this.changePrivileged(blockListByPartner);
              }}
            >
              全部城市合伙人
            </Checkbox>
            <Button type="link" style={{ padding: 0 }} onClick={this.openChoice.bind(this, 30)}>
              黑名单({blockListByPartnerCount}人)
            </Button>
          </div>
          <div>提示：勾选后除黑名单外所有选中级别用户都将开启拦截发货权限</div>
        </Modal>

        <Modal
          title={'按手机号批量设置拦截权限'}
          visible={phoneVisible}
          width={300}
          onCancel={this.onCancelByPhone}
          footer={
            <div>
              <Button onClick={this.onCancelByPhone}>取消</Button>
              <Button className="xt-delay" type="primary" onClick={this.onOkByPhone}>
                确定
              </Button>
            </div>
          }
        >
          <TextArea
            value={valueByPhone}
            placeholder="请输入批量设置拦截权限的手机号,以换行区分"
            rows={10}
            onChange={this.valueByPhoneChange}
          />
          <Radio.Group style={{ marginTop: 16 }} onChange={this.switchValueByPhoneChange} value={switchValueByPhone}>
            <Radio value={'1'}>批量开启</Radio>
            <Radio value={'0'}>批量关闭</Radio>
          </Radio.Group>
        </Modal>

        {choiceVisible ? (
          <BlockList
            visible={true}
            level={level}
            blockList={currentBlockList}
            idsByLevel={currentIdsByLevel}
            onCancel={this.blockListCancel}
            onOk={this.blockListOk}
          />
        ) : null}
      </div>
    );
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 18 }
      }
    };
    return (
      <Form {...formItemLayout} className={styles['search-form']}>
        <Row gutter={48}>
          <Col span={6}>
            <FormItem label="用户ID">{getFieldDecorator('id')(<Input placeholder="请输入用户ID" />)}</FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="昵称">
              {getFieldDecorator('nickNameLike')(<Input placeholder="请输入用户昵称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="姓名">{getFieldDecorator('userName')(<Input placeholder="请输入用户姓名" />)}</FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="手机号">{getFieldDecorator('phone')(<Input placeholder="请输入用户手机号" />)}</FormItem>
          </Col>
        </Row>
        <Row gutter={48}>
          <Col span={6}>
            <FormItem label="等级">
              {getFieldDecorator('memberType', {
                initialValue: '',
                onChange: this.onLevelChange
              })(
                <Select placeholder="请选择用户等级">
                  {levelList.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.key}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="拦截权限">
              {getFieldDecorator('orderInterception', {
                initialValue: '',
                onChange: this.onLevelChange
              })(
                <Select placeholder="请选择用户拦截权限">
                  {permissionList.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.key}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button
              onClick={() => {
                this.props.form.resetFields();
              }}
              style={{ marginLeft: 8 }}
            >
              清除条件
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  handleSearch = (param = {}, holdSelectedRowKeys) => {
    const { dispatch } = this.props;
    setQuery({
      current: param.current || 1,
      pageSize: param.pageSize || 10
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payload = omitBy(
          {
            ...values,
            page: param.current || 1,
            pageSize: param.pageSize || 10
          },
          val => val === '' || isNil(val)
        );
        if (holdSelectedRowKeys) {
          dispatch[namespace].getUserList(payload);
        } else {
          this.setState(
            {
              selectedRowKeys: []
            },
            () => {
              dispatch[namespace].getUserList(payload);
            }
          );
        }
      }
    });
  };

  togglePrivilege = record => {
    const { dispatch } = this.props;
    if (record.orderInterception === 1) {
      dispatch[namespace].closePrivilege({ id: record.id }).then(res => {
        if (res) {
          message.success('关闭成功');
          const obj = parseQuery();
          this.handleSearch(
            {
              current: obj.current,
              pageSize: obj.pageSize
            },
            true
          );
        }
      });
    } else {
      dispatch[namespace].openPrivilege({ id: record.id }).then(res => {
        if (res) {
          message.success('开启成功');
          const obj = parseQuery();
          this.handleSearch(
            {
              current: obj.current,
              pageSize: obj.pageSize
            },
            true
          );
        }
      });
    }
  };

  changePrivileged = obj => {
    const { blockList } = this.state;
    const currentBlockList = blockList.find(item => item.memberType == obj.memberType);
    currentBlockList.privileged = !currentBlockList.privileged;
    this.setState({
      blockList
    });
  };

  batchOpenPrivilege = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) {
      message.warn('请选择要开启拦截权限的用户');
      return;
    }
    dispatch[namespace].batchOpenPrivilege(selectedRowKeys).then(res => {
      if (res) {
        message.success('批量开启成功');
        const obj = parseQuery();
        this.handleSearch(
          {
            current: obj.current,
            pageSize: obj.pageSize
          },
          true
        );
      }
    });
  };

  batchClosePrivilege = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) {
      message.warn('请选择要关闭拦截权限的用户');
      return;
    }
    dispatch[namespace].batchClosePrivilege(selectedRowKeys).then(res => {
      if (res) {
        message.success('批量关闭成功');
        const obj = parseQuery();
        this.handleSearch(
          {
            current: obj.current,
            pageSize: obj.pageSize
          },
          true
        );
      }
    });
  };

  setPrivilegeByLevel = () => {
    const { dispatch } = this.props;
    dispatch[namespace].getPrivilegeByLevel().then(res => {
      this.setState({
        blockList: res,
        visible: true
      });
    });
  };

  /**
   * 按手机号批量设置拦截权限
   */
  setPrivilegeByPhone = () => {
    this.setState({
      phoneVisible: true
    });
  };

  openChoice = level => {
    this.setState({
      level,
      choiceVisible: true
    });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  onOk = () => {
    const { dispatch } = this.props;
    const { idsByLevel, blockList } = this.state;
    const payload = idsByLevel.map(item => {
      const currentBlockList = blockList.find(obj => obj.memberType == item.memberType);
      return {
        ...item,
        orderInteception: currentBlockList.privileged
      };
    });
    dispatch[namespace].setPrivilegeByLevel(payload).then(res => {
      if (res) {
        this.setState(
          {
            visible: false,
            idsByLevel: [
              {
                memberType: 10
              },
              {
                memberType: 20
              },
              {
                memberType: 30
              }
            ]
          },
          () => {
            message.destroy();
            message.success('按等级设置拦截权限成功');
          }
        );
      }
    });
  };

  onCancelByPhone = () => {
    this.setState({ phoneVisible: false, valueByPhone: '', switchValueByPhone: '1' });
  };

  onOkByPhone = () => {
    const { dispatch } = this.props;
    const { valueByPhone, switchValueByPhone } = this.state;
    if (!valueByPhone) {
      message.warn('请输入手机号');
      return;
    }
    const phones = valueByPhone.split(/\r|\n|\s/g);
    dispatch[namespace].batchSetPrivilegeByPhone({ phones, isOpen: switchValueByPhone }).then(res => {
      this.setState({ phoneVisible: false }, () => {
        Modal.info({
          title: '设置结果',
          content: (
            <div>
              <div style={{ marginBottom: 8 }}>
                <span>成功{switchValueByPhone === '1' ? '开启' : '关闭'}</span>
                <span style={{ color: 'red' }}>{res.successNum}</span>
                <span>个用户的拦截权限</span>
              </div>
              <div>
                <div>
                  {(phones || []).length !== Number(res.successNum) ? (
                    <div>
                      <div>
                        <span>
                          <span>{switchValueByPhone === '1' ? '开启' : '关闭'}失败</span>
                          <span style={{ color: 'red' }}>{phones.length - Number(res.successNum)}</span>
                          <span>个用户</span>
                        </span>
                        <a href={res.excelAddress} target="_blank" rel="noopener noreferrer">
                          失败用户清单
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ),
          okText: '确定',
          onOk: () => {
            this.setState(
              {
                valueByPhone: '',
                switchValueByPhone: '1'
              },
              () => {
                this.handleSearch();
              }
            );
          }
        });
      });
    });
  };
  valueByPhoneChange = ({ target }) => {
    this.setState({
      valueByPhone: target.value
    });
  };

  switchValueByPhoneChange = ({ target }) => {
    this.setState({
      switchValueByPhone: target.value
    });
  };

  blockListCancel = () => {
    this.setState({
      choiceVisible: false
    });
  };

  blockListOk = ({ addIds, delIds, level }) => {
    const { idsByLevel } = this.state;
    const exist = (idsByLevel || []).find(item => item.memberType == level);
    if (exist) {
      exist.addIds = addIds;
      exist.delIds = delIds;
    } else {
      idsByLevel.push({
        memberType: level,
        addIds,
        delIds
      });
    }
    this.setState({
      choiceVisible: false,
      idsByLevel
    });
  };
}
