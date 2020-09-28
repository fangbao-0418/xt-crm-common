import React, { Component } from 'react'
import { connect, parseQuery } from '@/util/utils'
import { Card, Row, Col, Form, Input, Select, Button, Divider, Table } from 'antd'
import moment from 'moment'
import { levelArr } from '../config'
import { levelName } from '../utils'
import styles from './index.module.scss'
import Modal from './modal'
import { namespace } from './model'
import { HAODIAN_LEVEL_OPTIONS } from '../config'
const FormItem = Form.Item
const { Option } = Select

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

function getColumns (scope) {
  return [
    {
      title: '用户ID',
      dataIndex: 'id'
    }, {
      title: '头像',
      dataIndex: 'headImage',
      render (v) {
        const headImage = v && v.indexOf('http') === 0 ? `${v}` : `https://assets.hzxituan.com/${v}`
        return v ? <img alt='头像' src={headImage} className={styles.headImage} /> : ''
      }
    }, {
      title: '昵称',
      dataIndex: 'nickName'
    }, {
      title: '锁粉状态',
      dataIndex: 'fansTypeDesc'
    }, {
      title: '手机号',
      dataIndex: 'phone'
    }, {
      title: '等级',
      dataIndex: 'memberLevel',
      render (v, rec) {
        const { bizSource } = scope.props
        if (bizSource === '2') {
          return rec?.memberTypeDO?.value
        }
        return <span>{levelName({ memberType: rec.memberTypeDO.key, memberTypeLevel: rec.memberTypeLevel })}</span>
      }
    }, {
      title: '邀请人手机号',
      dataIndex: 'invitePhone',
      render (v, rec) {
        return <span className={styles['detail-button']} onClick={() => scope.onInviteClick(rec)}>{v}</span>
      }
    },
    {
      title: '个人销售额(¥)',
      dataIndex: 'money',
      render (v) {
        return <span>{v/100}</span>
      }
    },
    {
      title: '团队销售额(¥)',
      dataIndex: 'countMoney',
      render (v) {
        return <span>{v/100}</span>
      }
    }, {
      title: '操作',
      render (_, record) {
        return (
          <>
            {
              record.memberTypeDO.key >= 10 && scope.props.bizSource === '0' // 喜团优选业务，团长以上才可以发码
                ? (
                  <>
                    <span
                      className={styles['detail-button']}
                      onClick={() => scope.onShowCodeModal(record)}>
                        发码
                    </span>
                    <Divider type='vertical' />
                  </>
                ) : ''
            }
            <span
              className={styles['detail-button']}
              onClick={scope.onDetail.bind(scope, record)}>
                详情
            </span>
            {
              record.haveChild
                ? <>
                    <Divider type='vertical' />
                    <span
                      className={styles['more-button']}
                      onClick={scope.onMore.bind(scope, record)}
                    >
                      查看下级
                    </span>
                  </> : ''
            }
          </>
        )
      }
    }
  ]
}

const defaultPayload = {
  page: 1,
  pageSize: 10,
  memberType: '',
  registerFrom: ''
}

@connect(state => ({
  tableConfig: state['user.userlist'].tableConfig,
  loading: state.loading.effects['user.userlist'].getData
}))
@Form.create({
  // onValuesChange: (props, changeValues, allValues) => {
  //     const time = allValues.time || []
  //     allValues.registerStartDate = time[0] && time[0].format(timeFormat)
  //     allValues.registerEndDate = time[1] && time[1].format(timeFormat)
  //     const payload = Object.assign({}, APP.fn.getPayload(namespace), ...allValues)
  //     APP.fn.setPayload(namespace, payload)
  // }
})
export default class extends Component {
    constructor(props) {
      super(props)
      this.props.getInstance(this)
    }
    payload = Object.assign({}, defaultPayload, APP.fn.getPayload(namespace))

    // componentDidMount () {
    //   this.handleSearch()
    // }

    onInviteClick = (item) => {
      const { history } = this.props
      history.push(`/user/detail?memberId=${item.inviteId}`)
    }

    onMore = item => {
      const { form: { resetFields } } = this.props
      // const params = parseQuery(this.props.history);
      resetFields()
      this.payload = {
        page: 1,
        pageSize: 10,
        memberType: '',
        registerFrom: ''
      }
      APP.fn.setPayload(namespace, this.payload)
      APP.history.push(`/user/userlist?parentMemberId=${item.id}`)
      this.setState({}, () => {
        this.handleSearch()
      })
      // if (item.id === +params.parentMemberId) {
      //     const random = Math.random();
      //     // setQuery({ parentMemberId: item.id, random, ...defaultPayload }, true);
      // } else {
      //     // setQuery({ parentMemberId: item.id, ...defaultPayload }, true);
      // }
    }

    onDetail = (item) => {
      const { history } = this.props
      history.push(`/user/detail?memberId=${item.id}`)
    }

    handleSearch = (params = {}) => {
      const { parentMemberId } = parseQuery(this.props.history)
      // parentMemberId = params.parentMemberId || parentMemberId || this.payload.parentMemberId
      params.parentMemberId = parentMemberId
      const { form: { validateFields }, dispatch } = this.props
      validateFields((errors, values) => {
        if (!errors) {
          const { time } = values
          const registerStartDate = (time && time[0] && time[0].format(timeFormat))
          const registerEndDate = (time && time[1] && time[1].format(timeFormat))
          const payload = {
            ...this.payload,
            ...values,
            registerStartDate,
            registerEndDate,
            ...params
          }
          if (payload.memberType && payload.memberType.indexOf('-') > -1) {
            const types = payload.memberType.split('-')
            payload.memberType = types[0]
            payload.memberTypeLevel = types[1]
          }
          /** 注册来源暂时去掉 */
          payload.registerFrom = undefined
          payload.time = undefined
          payload.phone = payload.phone ? payload.phone : undefined
          payload.invitePhone = payload.invitePhone ? payload.invitePhone : undefined
          this.payload = payload
          APP.fn.setPayload(namespace, payload)
          dispatch['user.userlist'].getData({ ...payload, bizSource: this.props.bizSource })
        }
      })
    }

    resetSearch () {
      const { form: { resetFields } } = this.props
      this.payload = {
        page: 1,
        pageSize: 10,
        memberType: '',
        registerFrom: ''
      }
      APP.fn.setPayload(namespace, this.payload)
      resetFields()
      APP.history.push('/user/userlist')
      this.setState({}, () => {
        this.handleSearch()
      })
    }
    renderForm = () => {
      const { form: { getFieldDecorator }, bizSource } = this.props
      const values = { ...this.payload }
      values.time = values.registerStartDate && [moment(values.registerStartDate), moment(values.registerEndDate)]
      return (
        <Form layout='inline'>
          <FormItem label='用户ID'>
            {
              getFieldDecorator('id', {
                initialValue: values.id,
                rules: [{
                  message: '请输入数字类型',
                  pattern: /^[0-9]*$/
                }]
              })(
                <Input placeholder='请输入' type='number' />
              )
            }
          </FormItem>
          { bizSource === '2' ? (
            <FormItem label='等级' className={styles.level}>
              {
                getFieldDecorator('memberType', {
                  initialValue: values.memberType
                })(
                  <Select>
                    {
                      HAODIAN_LEVEL_OPTIONS.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>))
                    }
                  </Select>
                )
              }
            </FormItem>
          ) : (
            <FormItem label='等级' className={styles.level}>
              {
                getFieldDecorator('memberType', {
                  initialValue: values.memberType
                })(
                  <Select>
                    {
                      levelArr.map(item => (<Option value={item.value} key={item.value}>{item.key}</Option>))
                    }
                  </Select>
                )
              }
            </FormItem>
          )}
          <FormItem label='手机号'>
            {
              getFieldDecorator('phone', {
                initialValue: values.phone
              })(
                <Input placeholder='请输入' />
              )
            }
          </FormItem>
          <FormItem label='邀请人手机号'>
            {
              getFieldDecorator('invitePhone', {
                initialValue: values.invitePhone
              })(
                <Input placeholder='请输入' />
              )
            }
          </FormItem>
          <FormItem>
            <Button
              type='primary'
              style={{ marginRight: 10 }}
              onClick={() => {
                this.handleSearch({
                  page: 1
                })
              }}
            >
                查询
            </Button>
            <Button
              type='primary'
              onClick={() => {
                this.resetSearch()
              }}
            >
                清除条件
            </Button>
            <Button
              className='ml10'
              onClick={() => {
                this.props.dispatch({
                  type: `${namespace}/saveDefault`,
                  payload: {
                    excelDialogVisible: true
                  }
                })
              }}
            >
                批量导入
            </Button>
          </FormItem>
        </Form>
      )
    }
    onChange = (pageConfig) => {
      this.handleSearch({
        page: pageConfig.current
      })
    }

    showTotal = total => {
      return <span>共{total}条数据</span>
    }

    onShowCodeModal = (item) => {
      this.props.dispatch({
        type: 'user.userlist/saveDefault',
        payload: {
          visible: true,
          currentUserInfo: item
        }
      })
    }

    render () {
      const { tableConfig } = this.props
      return (
            <>
                <Card>
                  <Row>
                    <Col style={{ marginBottom: 20 }}>
                      {
                        this.renderForm()
                      }
                    </Col>
                    <Col>
                      <Table
                        dataSource={tableConfig.records}
                        columns={getColumns(this)}
                        pagination={{
                          total: tableConfig.total,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: this.showTotal,
                          current: tableConfig.current
                        }}
                        onChange={this.onChange}
                        rowKey={record => record.id}
                        // loading={loading}
                      />
                    </Col>
                    <Modal />
                  </Row>
                </Card>
            </>
      )
    }
}
