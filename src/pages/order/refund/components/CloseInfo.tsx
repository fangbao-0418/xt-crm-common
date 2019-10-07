import React from 'react';
import { Row } from 'antd';
/**
 * 关闭信息
 */
interface Props {

}
const CloseInfo: React.FC<Props> = (props: Props) => {
  return (
    <>
      <h4>售后关闭信息</h4>
      <Row>关闭时间:</Row>
      <Row>处理人:</Row>
      <Row>说明:</Row>
    </>
  )
}
export default CloseInfo;