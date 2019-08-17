import React from 'react';
import { Menu, Dropdown, Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.scss';
const coupons = {
  '0': ['ISSUE_COUPON', 'VIEW', 'EDIT', 'FINISH'],
  '1': ['VIEW', 'EDIT', 'FINISH'],
  '2': ['VIEW']
}

const menu = (
  <Menu>
    <Menu.Item>
      <a>二维码</a>
    </Menu.Item>
    <Menu.Item>
      <a>批量发券</a>
    </Menu.Item>
  </Menu>
);

function ActionBtn({ keyCode, history}) {
  const handleView = () => {
    history.push({pathname: '/activity/coupon/132323'})
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
      return <Button type="link" onClick={handleView}>查看</Button>
    case 'EDIT':
      return <Button type="link">编辑</Button>
    case 'FINISH':
      return <Button type="link">结束</Button>
    default:
      return null;
  }
}
const WithActionBtn = withRouter(ActionBtn);
function ActionBtnGroup({ status }) {
  return (
    <div className="action-btn-group">{Array.isArray(coupons[status]) ? coupons[status].map(v => <WithActionBtn key={v} keyCode={v} />): null}</div>
  )
}

export default ActionBtnGroup;