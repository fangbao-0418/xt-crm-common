import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Button, Row, Col, Form, Modal, Radio } from 'antd'
import { connect } from '@/util/utils'

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
}

@connect(state => ({
  visible: state['auth.config'].visible,
  list: state['auth.config'].parentList,
  currentMenuInfo: state['auth.config'].currentMenuInfo
}))
@Form.create()
class Main extends Component {
  componentDidMount () {
    this.getList()
  }
    getList = () => {
      const { dispatch } = this.props
      dispatch['auth.config'].getList({ type: 0 }, 'parentList')
    }
    onCancel = () => {
      this.props.dispatch({
        type: 'auth.config/saveDefault',
        payload: {
          visible: false,
          currentMenuInfo: {}
        }
      })
    }

    onOk = () => {
      const { form: { validateFields }, dispatch, currentMenuInfo = {} } = this.props
      validateFields((errors, values) => {
        if (!errors) {
          const payload = {
            ...values
          }
          if (!currentMenuInfo.id) {
            dispatch['auth.config'].addMenu(payload)
          } else {
            dispatch['auth.config'].updateMenu({
              ...payload,
              id: currentMenuInfo.id
            })
          }
        }
      })
      this.onCancel()
    }

    render () {
      const { form: { getFieldDecorator }, list, currentMenuInfo } = this.props
      return (
        <Modal
          visible={this.props.visible}
          onCancel={this.onCancel}
          onOk={this.onOk}
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <FormItem label='上级菜单'>
              {
                getFieldDecorator('parentId', {
                  initialValue: currentMenuInfo.parentId
                })(
                  <Select
                    style={{ width: 200 }}
                    showSearch
                    filterOption={(inputValue, option) => {
                      return option.props.children.indexOf(inputValue) > -1
                    }}
                  >
                    {
                      list.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label='菜单类型'>
              {
                getFieldDecorator('type', {
                  initialValue: currentMenuInfo.type || 0
                })(
                  <Radio.Group>
                    <Radio value={0}>菜单</Radio>
                    <Radio value={1}>按钮</Radio>
                  </Radio.Group>
                )
              }
            </FormItem>
            <FormItem label='菜单名称'>
              {
                getFieldDecorator('name', {
                  initialValue: currentMenuInfo.name
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label='请求地址'>
              {
                getFieldDecorator('path', {
                  initialValue: currentMenuInfo.path || ''
                })(
                  <Input />
                )
              }
            </FormItem>
            {/* <FormItem label="状态">
                        {
                            getFieldDecorator('status', {
                                initialValue: currentMenuInfo.status || 1
                            })(
                                <Radio.Group>
                                    <Radio value={0}>隐藏</Radio>
                                    <Radio value={1}>可见</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem> */}
            <FormItem label='权限标识'>
              {
                getFieldDecorator('permission', {
                  initialValue: currentMenuInfo.permission || ''
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label='图标'>
              {
                getFieldDecorator('icon', {
                  initialValue: currentMenuInfo.icon || ''
                })(
                  <Input />
                )
              }
            </FormItem>
          </Form>
        </Modal>
      )
    }
}

Main.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.object,
  currentMenuInfo: PropTypes.object,
  visible: PropTypes.bool,
  list: PropTypes.array
}

export default Main