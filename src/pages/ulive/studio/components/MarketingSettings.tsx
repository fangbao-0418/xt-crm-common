import React from 'react'
import { Modal } from 'antd'
import classnames from 'classnames'
import styles from './style.module.styl'
import CouponSelector from './CouponSelector'
import InvitationList from './InvitationList'

type Key = string | number
interface Option {
  label: string
  value: Key
}

interface Props {
  selectedRowKeys: any[]
  visible: boolean
  planId?: number
  onChange: (selectedRowKeys: any[]) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onOk: () => void
  readonly: boolean
}
interface State {
  value: Key
  options: Option[]
}
class MarketingSettings extends React.Component<Props, State> {
  public state = {
    options: [
      { label: '优惠券设置', value: 0 },
      { label: '邀请榜单', value: 1 },
    ],
    value: 0,
  }
  public onCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      value: 0
    }, () => {
      this.props.onCancel(e)
    })
  }
  public render() {
    const { options, value } = this.state
    const { visible, selectedRowKeys, readonly, planId } = this.props
    return (
      <Modal
        visible={visible}
        width='80%'
        footer={null}
        onCancel={this.onCancel}
        title={
          <div className={styles['title']}>
            {options.map((opt: Option) => (
              <div
                className={classnames(
                  styles['title-item'],
                  value === opt.value ? styles['active'] : ''
                )}
                onClick={() => {
                  this.setState({ value: opt.value })
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        }
      >
        {value === 0 ? (
          <CouponSelector
            onCancel={this.onCancel}
            readonly={readonly}
            selectedRowKeys={selectedRowKeys}
            onChange={(rowKeys) => {
              const { onChange } = this.props
              onChange && onChange(rowKeys)
            }}
            onOk={this.props.onOk}
          />
        ) : (
          <InvitationList
            onCancel={this.onCancel}
            readonly={readonly}
            planId={planId}
          />
        )}
      </Modal>
    )
  }
}

export default MarketingSettings
