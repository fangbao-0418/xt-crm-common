import React, { useState, useEffect } from 'react';
import MoneyRender from '@/components/money-render'
import { Table, Row, Button, Modal, message } from 'antd';
import { MemberTypeTextMap } from '../constant';
import { formatMoneyWithSign } from '@/pages/helper';
import { profitRecal, profitRecycl, getProceedsListByOrderIdAndMemberId, getProceedsListByOrderIdAndMemberIdAndSkuId } from '../api';
import EarningsDetail from './components/modal/EarningsDetail'
import Alert from '@/packages/common/components/alert'
import { getEarningsDetail } from './api'
const ChildOrderTable = (props) => {
  const { record: { mainOrderNo, memberId } } = props;
  const [isFirstLoaded, useIsFirstLoaded] = useState(true)
  const [dataSource, useDataSource] = useState([]);

  useEffect(() => {
    if (isFirstLoaded) {
      getProceedsListByOrderIdAndMemberId({ mainOrderNo, memberId }).then((result) => {
        useDataSource(result);
      })
      useIsFirstLoaded(false);
    }
  })


  const columns = [
    {
      title: '子订单号',
      width: '20%',
      dataIndex: 'childOrderNo',
      render: (childOrderNo, record) => {
        return <a onClick={() => {
          props.showModal(props.record, record);
        }}>
          {childOrderNo}
        </a>
      }
    }, {
      title: 'SKU名称',
      width: '30%',
      dataIndex: 'skuName'
    }, {
      title: '商品ID',
      width: '15%',
      dataIndex: 'productId'
    }, {
      title: '收益类型',
      width: '15%',
      dataIndex: 'incomeTypeDesc'
    }, {
      title: '已结算收益',
      width: '10%',
      dataIndex: 'settledAmount',
      render: MoneyRender,
    }, {
      title: '未结算收益',
      width: '10%',
      dataIndex: 'unSettledAmount',
      render: MoneyRender
    }
  ];

  return <>
    <Table
      rowKey={record => record.childOrderNo}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  </>
};

const BenefitInfo = (props) => {
  const {
    data = {
      costPrice: 0,
      memberYieldVOList: [
        {
          memberType: 0,
          userName: 'string',
          yield: 0,
        },
      ],
      totalPrice: 0,
    },
    orderInfo,
    proceedsList,
    refresh
  } = props
  const [detailList, useDetailList] = useState([]);
  const [visible, useVisible] = useState(false);

  const columns = [
    {
      title: '类别',
      dataIndex: 'memberType',
      width: '20%',
      render(memberType) {
        return MemberTypeTextMap[memberType];
      }
    }, {
      title: '姓名',
      width: '30%',
      dataIndex: 'memberUserName'
    }, {
      title: '手机号',
      width: '15%',
      dataIndex: 'memberMobile'
    }, {
      title: '收益类型',
      width: '15%',
      dataIndex: 'incomeTypeDesc'
    }, {
      title: '已结算收益',
      width: '10%',
      dataIndex: 'settledAmount',
      render: MoneyRender,
    }, {
      title: '未结算收益',
      width: '10%',
      dataIndex: 'unSettledAmount',
      render: MoneyRender
    }
  ];

  const detailColumns = [
    {
      title: '时间',
      width: '20%',
      dataIndex: 'occurrenceTime'
    }, {
      title: '收益类型',
      width: '15%',
      dataIndex: 'incomeTypeDesc'
    }, {
      title: '事件',
      width: '15%',
      dataIndex: 'operatorTypeDesc'
    }, {
      title: '收益金额',
      width: '15%',
      dataIndex: 'amount',
      render: MoneyRender
    }, {
      title: '结算状态',
      width: '20%',
      dataIndex: 'settleStatus'
    }, {
      title: '结算时间',
      width: '20%',
      dataIndex: 'settleTime',
    }
  ];

  const handleClick = function (type) {
    Modal.confirm({
      title: '系统提示',
      content: '确定要收益' + (type == 'recycl' ? '回收' : '重跑') + '吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        (type == 'recycl' ? profitRecycl : profitRecal)({ orderCode: orderInfo.orderCode }).then(res => {
          if (res.success) {
            message.success('操作成功');
            refresh();
          }
        });
      }
    });
  }

  const showModal = (mainOrder, childOrder) => {
    const { mainOrderNo, memberId } = mainOrder;
    const { skuId, childOrderNo } = childOrder;
    getEarningsDetail({
      childOrderNo: childOrderNo,
      memberId
    }).then((res) => {
      props.alert({
        width: 900,
        title: '收益详情',
        content: (
          <EarningsDetail
            detail={res}
          />
        )
      })
    })
    // getProceedsListByOrderIdAndMemberIdAndSkuId({ mainOrderNo, memberId, skuId }).then((result) => {
    //   // useDetailList(result);
    //   console.log(this, 'this')
    //   props.alert({
    //     width: 900,
    //     title: '收益详情',
    //     content: (
    //       <EarningsDetail dataSource={result} />
    //     )
    //   })
    // });
    // useVisible(true);
  }

  const expandedRowRenderByChildOrder = (record, index, indent, expanded) => {
    return expanded ? <ChildOrderTable record={record} showModal={showModal} /> : null;
  }

  return (
    <div>
      <Row>
        <span>预计盈利信息</span>
        {/* <Button type="primary" style={{ float: 'right' }} onClick={() => handleClick('recycl')}>收益回收</Button>
        <Button type="primary" style={{ float: 'right', marginRight: '10px' }} onClick={() => handleClick('recal')}>收益重跑</Button> */}
      </Row>
      <Row>成交金额：{formatMoneyWithSign(data.totalPrice)}</Row>
      <Row>成本金额：{formatMoneyWithSign(data.costPrice)}</Row>
      {/* 缺少id */}
      <Table
        columns={columns}
        dataSource={proceedsList}
        pagination={false}
        expandedRowRender={expandedRowRenderByChildOrder}
      />
      {
        // visible ?
        //   <Modal
        //     title={"收益详细历史记录"}
        //     visible={true}
        //     width="900px"
        //     bodyStyle={{
        //       padding: 0,
        //       minHeight: 540
        //     }}
        //     footer={[
        //       <Button type="primary" key="back" onClick={() => { useVisible(false); }}>取消</Button>
        //     ]}
        //     onCancel={() => { useVisible(false) }}
        //   >
        //     <Table
        //       rowKey={record => record.id}
        //       columns={detailColumns}
        //       dataSource={detailList}
        //       pagination={false}
        //       scroll={{ y: 540 }}
        //     />
        //   </Modal> :
        //   null
      }
    </div>
  );
};

export default Alert(BenefitInfo);
