/** 权限控制 */
import React from 'react'
import { connect } from 'react-redux'

interface ReduxState {
  roleList: RoleInfo[]
}

type ChildrenType = (a: any, b: any) => React.ReactNode | React.ReactNode

interface Props extends ReduxState {
  /** 权限码多个权限码,分割 */
  code?: string
}

interface RoleInfo {
  id: number
  name: string
  /** 权限标识 */
  permission: string
  /** 是否有权限 true-有 false-无 */
  flag: boolean
}

class Main extends React.Component<Props> {
  /** 获取角色权限code */
  public getRoleCodes () {
    const roleList = this.props.roleList || []
    const codes: string[] = []
    roleList.map((item) => {
      if (item.permission && item.flag) {
        codes.push(item.permission)
      }
    })
    codes.push('*')
    return codes
  }
  /** 判断权限 */
  public judgeCodesCanAccess () {
    const partialCodes = (this.props.code || '').split(',')
    const roleCodes = this.getRoleCodes()
    const result = roleCodes.findIndex((item) => {
      return partialCodes.indexOf(item) > -1
    })
    return result > -1
  }
  public render () {
    const addressable = this.judgeCodesCanAccess()
    const children = this.props.children
    if (typeof children === 'function') {
      return children(addressable, this.getRoleCodes())
    }
    return addressable ? children : null
  }
}
export default connect((state: {
  layout: {
    roleList: RoleInfo[]
  }
}) => {
  return {
    roleList: state.layout.roleList
  }
})(Main)
