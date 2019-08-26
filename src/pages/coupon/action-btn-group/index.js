import React from 'react';
import { Message, Modal, Menu, Dropdown, Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { overReciveCoupon } from '../api';
import './index.scss';
const coupons = {
  '0': ['ISSUE_COUPON', 'VIEW', 'EDIT', 'FINISH'],
  '1': ['VIEW', 'EDIT', 'FINISH'],
  '2': ['VIEW']
}

function ActionBtn({ keyCode, history, setVisible, id, match, fetchData }) {
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
      onOk: async () => {
        const res = await overReciveCoupon(id);
        if (res) {
          Message.success('结束优惠券发放成功');
          fetchData();
        }
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
      return <Button type="link" onClick={() => history.push({ pathname: `${match.url}/detail/${id}` })}>查看</Button>
    case 'EDIT':
      return <Button type="link" onClick={() => history.push({
        pathname: `${match.url}/couponinfo`,
        search: `type=edit&id=${id}`
      })}>编辑</Button>
    case 'FINISH':
      return <Button type="link" onClick={handleFinish}>结束</Button>
    default:
      return null;
  }
}
const WithActionBtn = withRouter(ActionBtn);
function ActionBtnGroup({ record, setVisible, fetchData }) {
  return (
    <div className="action-btn-group">
      {
        Array.isArray(coupons[record.status])
          ? coupons[record.status].map(v => <WithActionBtn key={v} keyCode={v} setVisible={setVisible} id={record.id} fetchData={fetchData}/>)
          : null
      }
    </div>
  )
}

export default ActionBtnGroup;