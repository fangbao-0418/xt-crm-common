import React from 'react';
import { Tag } from 'antd';
import { TextMapRefundStatus } from '../../constant';

const RefundStatusCell = ({ refundStatus }) => {
  return <Tag>{TextMapRefundStatus[refundStatus]}</Tag>;
};

export default RefundStatusCell;
