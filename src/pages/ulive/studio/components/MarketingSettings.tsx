import React from 'react';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from './style.module.styl';
import CouponSelector from './CouponSelector';
import InvitationList from './InvitationList';

type Key = string | number;
interface Option {
  label: string;
  value: Key;
}

interface Props {
  selectedRowKeys: any[];
  visible: boolean;
  onCancel?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
}
interface State {
  value: Key;
  options: Option[];
}
class MarketingSettings extends React.Component<Props, State> {
  public state = {
    options: [
      { label: '优惠券设置', value: 0 },
      { label: '邀请榜单', value: 1 },
    ],
    value: 0,
  };
  public onChange(value: Key) {
    this.setState({ value });
  }
  public render() {
    const { options, value } = this.state;
    const { visible, onCancel, selectedRowKeys } = this.props;
    return (
      <Modal
        visible={visible}
        width='80%'
        footer={null}
        onCancel={this.props.onCancel}
        title={
          <div className={styles['title']}>
            {options.map((opt: Option) => (
              <div
                className={classnames(
                  styles['title-item'],
                  value === opt.value ? styles['active'] : ''
                )}
                onClick={this.onChange.bind(this, opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        }
      >
        {value === 0 ? (
          <CouponSelector onCancel={onCancel} selectedRowKeys={selectedRowKeys}/>
        ) : (
          <InvitationList onCancel={onCancel} />
        )}
      </Modal>
    );
  }
}

export default MarketingSettings;
