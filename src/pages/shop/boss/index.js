import React from 'react'
import { withRouter } from 'react-router'
import { Card, Button, Input, Select, Modal, Tabs, message } from 'antd'
import Form, { FormItem } from '@/packages/common/components/form'
import CommonTable from '@/components/common-table'
import SwitchModal from './components/switchModal'
import PassModal from './components/passModal'
import BatchModal from './components/batchModal'
import CheckModal from './components/checkModal'
import SelectFetch from '@/components/select-fetch'
import If from '@/packages/common/components/if'
import { connect } from '@/util/utils'
import { getPassColums, getCheckColums, getNoPassColums } from './columns'
import { queryConfig } from './config'
import { namespace } from './model'
import { getShopTypes, getCategoryTopList } from './api'

const { Option } = Select
const { confirm } = Modal
const { TabPane } = Tabs

@connect(state => ({
  bossData: state['shop.boss'].bossData
}))
@Form.create()
@withRouter
class Main extends React.Component {
  state = {
    tabKey: APP.fn.getPayload(namespace)?.applyResult || '2'
  }

  componentDidMount () {
    this.fetchData()
  }

  /** 请求: 获取列表内容数据 */
  fetchData = (params = {}) => {
    const {
      form: { validateFields },
      dispatch
    } = this.props

    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const localPayload = APP.fn.getPayload(namespace) || {}
      const payload = {
        page: params.page || localPayload.page | 1,
        pageSize: params.pageSize || localPayload.page | 10,
        memberId: values.memberId !== undefined ? values.memberId : localPayload.memberId,
        nickName: values.nickName !== undefined ? values.nickName : localPayload.nickName,
        userName: values.userName !== undefined ? values.userName : localPayload.userName,
        memberPhone: values.memberPhone !== undefined ? values.memberPhone : localPayload.memberPhone,
        shopStatus: values.shopStatus !== undefined ? values.shopStatus : localPayload.shopStatus,
        shopTypes: values.shopTypes !== undefined ? values.shopTypes : localPayload.shopTypes,
        categoryIds: values.categoryIds !== undefined ? values.categoryIds : localPayload.categoryIds,
        applyResult: this.state.tabKey
      }
      payload.shopStatus = payload.shopStatus || undefined
      APP.fn.setPayload(namespace, {
        page: payload.page,
        pageSize: payload.pageSize,
        memberId: payload.memberId,
        nickName: payload.nickName,
        userName: payload.userName,
        memberPhone: payload.memberPhone,
        shopTypes: payload.shopTypes,
        categoryIds: payload.categoryIds,
        shopStatus: payload.shopStatus,
        applyResult: payload.applyResult
      })
      dispatch['shop.boss'].getBossList(payload)
    })
  }

  /** 操作: 添加店长-显示模态框 */
  handleAdd = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        batchModal: {
          visible: true
        }
      }
    })
  }

  /** 操作: 条件查询-搜索 */
  handleSearch = (params) => {
    this.fetchData(params)
  }

  /** 操作: 条件查询-重置 */
  handleReset = () => {
    const { form, dispatch } = this.props
    const { tabKey } = this.state
    form.resetFields()
    APP.fn.setPayload(namespace, {
      memberId: undefined,
      nickName: undefined,
      userName: undefined,
      memberPhone: undefined,
      shopStatus: undefined,
      shopTypes: [],
      categoryIds: [],
      applyResult: tabKey
    })
    dispatch['shop.boss'].getBossList({
      page: 1,
      pageSize: 10,
      applyResult: tabKey
    })
  }

  /** 操作: 列表内容-关闭店铺 */
  handleClose = (currentBoss) => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        currentBoss,
        switchModal: {
          visible: true
        }
      }
    })
  }

  /** 操作: 列表内容-开启店铺 */
  handleOpen = (currentBoss) => {
    const { dispatch } = this.props
    confirm({
      title: '确认重新开通店铺吗?',
      okText: '确认开通',
      onOk: () => {
        dispatch['shop.boss'].openShop({
          shopId: currentBoss.id,
          shopStatus: 2
        })
      }
    })
  }

  /** 操作: 列表内容-不通过店铺 */
  handleNoPass = (currentBoss) => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        currentBoss,
        passModal: {
          visible: true
        }
      }
    })
  }

  /** 操作: 列表内容-通过店铺 */
  handlePass = (currentBoss) => {
    const { dispatch } = this.props
    confirm({
      title: '确认重新审核通过吗?',
      okText: '审核通过',
      onOk: () => {
        dispatch['shop.boss'].passShop({
          merchantApplyId: currentBoss.id
        })
      }
    })
  }

  /** 操作: 点击用户跳转至用户详情 */
  handleUserClick = (record) => {
    const { pathname } = window.location
    APP.open(`${(/^\/$/).test(pathname) ? '/' : pathname}#/user/detail?memberId=${record.memberId}`)
  }

  handleDetail = (record) => {
    const { pathname } = window.location
    APP.open(`${(/^\/$/).test(pathname) ? '/' : pathname}#/shop/boss/detail/${record.id}/${record.auditType}`)
  }

  /** 视图: 条件查询模块 */
  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props
    const { tabKey } = this.state
    const localPayload = APP.fn.getPayload(namespace) || {}

    return (
      <Form layout='inline'>
        <FormItem label='用户ID'>
          {getFieldDecorator('memberId', {
            initialValue: localPayload.memberId
          })(<Input placeholder='请输入用户ID' />)}
        </FormItem>
        <FormItem label='手机号'>
          {getFieldDecorator('memberPhone', {
            initialValue: localPayload.memberPhone
          })(<Input placeholder='请输入手机号' />)}
        </FormItem>
        <If condition={tabKey === '2'}>
          <FormItem label='权限状态'>
            {getFieldDecorator('shopStatus', {
              initialValue: localPayload.shopStatus
            })(
              <Select
                placeholder='请选择'
                style={{ width: '100%' }}>
                {
                  queryConfig.statusOptions.map((item) => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </If>
        <FormItem label='店铺类型'>
          {getFieldDecorator('shopTypes', {
            initialValue: localPayload.shopTypes
          })(
            <SelectFetch
              mode='multiple'
              style={{ width: 172 }}
              fetchData={getShopTypes}
            />
          )}
        </FormItem>
        <FormItem label='主营类目'>
          {getFieldDecorator('categoryIds', {
            initialValue: localPayload.categoryIds
          })(
            <SelectFetch
              mode='multiple'
              style={{ width: 172 }}
              fetchData={getCategoryTopList}
            />
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' onClick={() => {
            this.handleSearch({
              page: 1
            })
          }}>
            查询
          </Button>
          <Button style={{ marginLeft: 16 }} onClick={this.handleReset}>
            重置
          </Button>
        </FormItem>
      </Form>
    )
  }

  /** 视图: 列表内容模块 */
  renderContent = () => {
    const { bossData } = this.props
    const { tabKey } = this.state
    const columnsMap = {
      '1': getCheckColums({
        onDetail: this.handleDetail,
        onPass: this.handlePass,
        onNoPass: this.handleNoPass,
        onUserClick: this.handleUserClick
      }),
      '2': getPassColums({
        onDetail: this.handleDetail,
        onClose: this.handleClose,
        onOpen: this.handleOpen,
        onUserClick: this.handleUserClick
      }),
      '3': getNoPassColums({
        onDetail: this.handleDetail,
        onUserClick: this.handleUserClick
      })
    }
    return (<CommonTable
      columns={columnsMap[tabKey]}
      dataSource={bossData.records || []}
      onChange={this.handleSearch}
      total={bossData.total}
      current={bossData.current}
    />)
  }

  handleStatusChange = (applyResult) => {
    const { form, dispatch } = this.props
    form.resetFields()
    APP.fn.setPayload(namespace, {
      memberId: undefined,
      nickName: undefined,
      userName: undefined,
      memberPhone: undefined,
      shopStatus: undefined,
      shopTypes: [],
      categoryIds: [],
      applyResult: applyResult
    })
    this.setState({
      tabKey: applyResult
    })
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        bossData: {}
      }
    })
    dispatch['shop.boss'].getBossList({
      page: 1,
      pageSize: 10,
      applyResult
    })
  }

  render () {
    return (
      <div>
        {/* 开启关闭店铺模态框 */}
        <SwitchModal />
        {/* 不通过店铺模态框 */}
        <PassModal />
        {/* 添加店长模态框 */}
        <BatchModal />
        {/* 识别用户模态框 */}
        <CheckModal />
        <Card>
          <Tabs activeKey={this.state.tabKey} onChange={this.handleStatusChange}>
            <TabPane tab='审核通过' key='2' />
            <TabPane tab='待审核' key='1' />
            <TabPane tab='审核不通过' key='3' />
          </Tabs>
          {/* 条件查询视图 */}
          {this.renderForm()}
        </Card>
        <Card>
          <If condition={this.state.tabKey === '2'}>
            <div style={{ marginBottom: 16 }}>
              <Button type='primary' onClick={this.handleAdd}>
              添加店铺
              </Button>
            </div>
          </If>
          {/* 内容列表视图 */}
          {this.renderContent()}
        </Card>
      </div>
    )
  }
}

export default Main