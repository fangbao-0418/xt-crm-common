import React, { Component } from 'react'
import { Input, Select, Button, Row, Col, Form, Modal, Radio, Tree } from 'antd'
import { connect } from '@/util/utils'
import { includes, concat } from 'lodash'

const FormItem = Form.Item
const { TreeNode } = Tree
const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
}

function getDefaultChecked (arr = []) {
  const rootParents = arr.filter(item => !item.parentId)
  rootParents.forEach(rootItem => {
    const twoLevel = arr.filter(item => item.parentId === rootItem.id)
    twoLevel.forEach(twoLevelItem => {
      const unSelected = arr.filter(item => item.parentId === twoLevelItem.id && item.flag === false)
      if (unSelected && unSelected.length) {
        twoLevelItem.flag = false
      }
    })
    const unSelectedTwoLevel = twoLevel.filter(item => item.flag === false)
    if (unSelectedTwoLevel && unSelectedTwoLevel.length) {
      rootItem.flag = false
    }
  })
  return arr.filter(item => item.flag).map(item => `${item.id}`)
}

@connect(state => ({
  visible: state['auth.role'].visible,
  menuList: state['auth.role'].menuList,
  currentRoleInfo: state['auth.role'].currentRoleInfo
}))
@Form.create()
export default class extends Component {
  state = {
    menuIds: []
  };

  componentDidMount () {
    this.handleSearch()
  }

  handleSearch = () => {
    const { dispatch } = this.props
    dispatch['auth.role'].getMenuList()
  };
  onCancel = () => {
    this.props.dispatch({
      type: 'auth.role/saveDefault',
      payload: {
        visible: false
      }
    })
    // this.handleSearch();
  };

  renderTree = data => {
    return data.map(item => {
      if (item.subMenus.length) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTree(item.subMenus)}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.name} key={item.id}></TreeNode>
      }
    })
  };

  onOk = () => {
    this.onCancel()
    const {
      form: { validateFields },
      dispatch,
      currentRoleInfo
    } = this.props
    validateFields((errors, values) => {
      if (!errors) {
        const ids = []
        this.getParentIds(this.props.menuList, this.state.menuIds, ids)
        const payload = {
          ...values,
          menuIds: Array.from(new Set(concat(ids)))
        }
        if (currentRoleInfo?.id) {
          // 编辑
          dispatch['auth.role'].editRole({
            id: currentRoleInfo.id,
            ...payload
          })
        } else {
          // 新增
          dispatch['auth.role'].addRole(payload)
        }
      }
    })
  };

  getParentIds = (list, selectedIds, ids) => {
    return (list || []).filter(item => {
      if (item.subMenus && item.subMenus.length) {
        const result = this.getParentIds(item.subMenus, selectedIds, ids)
        if (result.length) {
          ids.push(`${item.id}`)
          return true
        } else {
          return false
        }
      } else {
        if (includes(selectedIds, `${item.id}`)) {
          ids.push(`${item.id}`)
          return true
        } else {
          return false
        }
      }
    })
  };

  onCheck = checkedKeys => {
    this.setState({
      menuIds: checkedKeys
    })
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.currentRoleInfo.data !== this.props.currentRoleInfo.data) {
      if (nextProps.currentRoleInfo && Array.isArray(nextProps.currentRoleInfo.data)) {
        console.log(nextProps.currentRoleInfo.data)
        this.setState({
          menuIds: getDefaultChecked(nextProps.currentRoleInfo.data)
        })
      }
    }
  };

  render () {
    const {
      form: { getFieldDecorator },
      menuList,
      visible,
      currentRoleInfo
    } = this.props
    const { data = [], id } = currentRoleInfo
    const defaultCheckedKeys = getDefaultChecked(data)
    return (
      <Modal visible={visible} onCancel={this.onCancel} onOk={this.onOk} destroyOnClose title={id ? '编辑' : '新增'}>
        <Form {...formItemLayout}>
          <FormItem label='角色名称'>
            {getFieldDecorator('roleName', {
              initialValue: currentRoleInfo.roleName
            })(<Input />)}
          </FormItem>
          <FormItem label='权限内容'>
            {getFieldDecorator('authlist', {
              valuePropName: 'defaultCheckedKeys',
              initialValue: defaultCheckedKeys
            })(
              <Tree checkable onCheck={this.onCheck}>
                {this.renderTree(menuList)}
              </Tree>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
