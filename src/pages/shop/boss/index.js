import React from 'react';
import { withRouter } from 'react-router';
import { Card, Button, Input, Select } from 'antd';
import Form, { FormItem } from '@/packages/common/components/form';
import CommonTable from '@/components/common-table';
import SwitchModal from './components/switchModal';
import BatchModal from './components/batchModal';
import CheckModal from './components/checkModal';
import { connect } from '@/util/utils';
import getColumns from './columns'
import { queryConfig } from './config'
import { namespace } from './model'

const { Option } = Select;

@connect(state => ({
  bossData: state['shop.boss'].bossData
}))
@Form.create()
@withRouter
class Main extends React.Component {

  componentDidMount() {
    this.fetchData()
  }

  /** 请求: 获取列表内容数据 */
  fetchData = (params = {}) => {
    const {
      form: { validateFields },
      dispatch
    } = this.props;

    validateFields((errors, values) => {
      if (errors) return
      const localPayload = APP.fn.getPayload(namespace) || {}
      const payload = {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        memberId: values.memberId !== undefined ? values.memberId : localPayload.memberId,
        nickName: values.nickName !== undefined ? values.nickName : localPayload.nickName,
        userName: values.userName !== undefined ? values.userName : localPayload.userName,
        phone: values.phone !== undefined ? values.phone : localPayload.phone,
        shopStatus: values.shopStatus !== undefined ? values.shopStatus : localPayload.shopStatus,
      };
      APP.fn.setPayload(namespace, {
        memberId: payload.memberId,
        nickName: payload.nickName,
        userName: payload.userName,
        phone: payload.phone,
        shopStatus: payload.shopStatus
      })
      dispatch['shop.boss'].getBossList(payload);
    });
  }

  /** 操作: 添加店长-显示模态框 */
  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        batchModal: {
          visible: true
        }
      }
    });
  }

  /** 操作: 条件查询-搜索 */
  handleSearch = () => {
    this.fetchData()
  }

  /** 操作: 条件查询-重置 */
  handleReset = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    APP.fn.setPayload(namespace, {
      memberId: '',
      nickName: '',
      userName: '',
      phone: '',
      shopStatus: ''
    })
    dispatch['shop.boss'].getBossList({
      page: 1,
      pageSize: 10
    });
  }

  /** 操作: 列表内容-开启关闭店铺 */
  handleSwitch = (currentBoss) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        currentBoss,
        switchModal: {
          visible: true
        }
      }
    });
  }

  /** 操作: 点击用户跳转至用户详情 */
  handleUserClick = () => {
    window.open(`/#/user/detail?memberId=888889347`);
  }

  /** 视图: 条件查询模块 */
  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const values = APP.fn.getPayload(namespace) || {}

    return (
      <Form layout="inline">
        <FormItem label="用户ID">
          {getFieldDecorator('memberId', {
            initialValue: values.memberId
          })(<Input placeholder="请输入用户ID" />)}
        </FormItem>
        <FormItem label="昵称">
          {getFieldDecorator('nickName', {
            initialValue: values.nickName
          })(<Input placeholder="请输入昵称" />)}
        </FormItem>
        <FormItem label="姓名">
          {getFieldDecorator('userName', {
            initialValue: values.userName
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem label="手机号">
          {getFieldDecorator('phone', {
            initialValue: values.phone
          })(<Input placeholder="请输入手机号" />)}
        </FormItem>
        <FormItem label="权限状态">
          {getFieldDecorator('shopStatus', {
            initialValue: values.shopStatus
          })(
            <Select
              placeholder="请选择"
              style={{ width: '100%' }}>
              {
                queryConfig.statusOptions.map(item => (
                  <Option value={item.value}>{item.label}</Option>
                ))
              }
            </Select>)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button style={{ marginLeft: 16 }} onClick={this.handleReset}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }

  /** 视图: 列表内容模块 */
  renderContent = () => {
    const { bossData } = this.props;
    return <CommonTable
      columns={getColumns({
        onSwitch: this.handleSwitch,
        onUserClick: this.handleUserClick
      })}
      dataSource={bossData.records || []}
      onChange={this.handleSearch}
      total={bossData.total}
      current={bossData.current}
    />
  }

  render() {
    return <div>
      {/* 开启关闭店铺模态框 */}
      <SwitchModal />
      {/* 添加店长模态框 */}
      <BatchModal />
      {/* 识别用户模态框 */}
      <CheckModal />
      <Card>
        {/* 条件查询视图 */}
        {this.renderForm()}
      </Card>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.handleAdd}>
            添加店长
          </Button>
        </div>
        {/* 内容列表视图 */}
        {this.renderContent()}
      </Card>
    </div>
  }
}

export default Main;