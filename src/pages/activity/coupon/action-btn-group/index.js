import React from 'react';
import { Modal, Menu, Dropdown, Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.scss';
const coupons = {
  '0': ['ISSUE_COUPON', 'VIEW', 'EDIT', 'FINISH'],
  '1': ['VIEW', 'EDIT', 'FINISH'],
  '2': ['VIEW']
}

function ActionBtn({ keyCode, history, setVisible, code }) {
  const menu = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={() => setVisible(true)}>二维码</a>
      </Menu.Item>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={() => history.push({ pathname: '/activity/coupon/list/bulkissuing' })}>批量发券</a>
      </Menu.Item>
    </Menu>
  );
  const handleFinish = () => {
    Modal.confirm({
      title: '系统提示',
      content: '结束优惠券发放，已领取优惠券可以继续使用，是否结束？',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { }
    })
  }
  switch (keyCode) {
    case 'ISSUE_COUPON':
      return (
        <Dropdown type="link" overlay={menu}>
          <a className="ant-dropdown-link" href="javascript:void(0)">
            发券 <Icon type="down" />
          </a>
        </Dropdown>
      );
    case 'VIEW':
      return <Button type="link" onClick={() => history.push({ pathname: `/activity/coupon/list/detail/${code}` })}>查看</Button>
    case 'EDIT':
      return <Button type="link">编辑</Button>
    case 'FINISH':
      return <Button type="link" onClick={handleFinish}>结束</Button>
    default:
      return null;
  }
}
const WithActionBtn = withRouter(ActionBtn);
function ActionBtnGroup({ record, setVisible }) {
  return (
    <div className="action-btn-group">
      {
        Array.isArray(coupons[record.status])
          ? coupons[record.status].map(v => <WithActionBtn key={v} keyCode={v} setVisible={setVisible} code={record.code} />)
          : null
      }
    </div>
  )
}

export default ActionBtnGroup;