import React, { useState } from 'react';
import MoneyRender from '@/components/money-render'
import { Table, Modal, Button } from 'antd';
import { MemberTypeTextMap } from '../constant';

import { getProceedsListByOrderIdAndMemberIdAndSkuId } from '../api';

const ChildOrderBenefitInfo = ({
    skuInfo: {
        mainOrderId,
        skuId
    },
    proceedsList
}) => {
    const [detailList, useDetailList] = useState([]);
    const [visible, useVisible] = useState(false);

    const showModal = ({ memberId, mainOrderNo }) => {
        getProceedsListByOrderIdAndMemberIdAndSkuId({ mainOrderNo, memberId, skuId }).then((result) => {
            useDetailList(result);
        });
        useVisible(true);
    }

    const columns = [
        {
            title: '姓名',
            width: '15%',
            dataIndex: 'memberUserName',
            render: (memberUserName, record) => {
                return <a onClick={() => { showModal(record) }}>{memberUserName}</a>
            }
        }, {
            title: '手机号',
            width: '15%',
            dataIndex: 'memberMobile',
            render: (memberMobile, record) => {
                return <a onClick={() => { showModal(record) }}>{memberMobile}</a>
            }
        }, {
            title: '类别',
            dataIndex: 'memberType',
            width: '15%',
            render(memberType) {
                return MemberTypeTextMap[memberType];
            }
        }, {
            title: '收益类型',
            width: '15%',
            dataIndex: 'incomeTypeDesc'
        }, {
            title: '已结算收益',
            width: '20%',
            dataIndex: 'settledAmount',
            render: MoneyRender,
        }, {
            title: '未结算收益',
            width: '20%',
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
            width: '10%',
            dataIndex: 'incomeTypeDesc'
        }, {
            title: '事件',
            width: '15%',
            dataIndex: 'operatorTypeDesc'
        }, {
            title: '收益金额',
            width: '15%',
            dataIndex: 'amount'
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

    return (
        <>
            <Table
                rowKey={record => `child-${record.memberId}`}
                columns={columns}
                dataSource={proceedsList}
                pagination={false}
            />
            {
                visible ?
                    <Modal
                        title={"收益详细历史记录"}
                        visible={true}
                        width="900px"
                        bodyStyle={{
                            padding: 0,
                            minHeight: 540
                        }}
                        footer={[
                            <Button type="primary" key="back" onClick={() => { useVisible(false); }}>取消</Button>
                        ]}
                        onCancel={() => { useVisible(false) }}
                    >
                        <Table
                            rowKey={record => `child-${record.id}`}
                            columns={detailColumns}
                            dataSource={detailList}
                            pagination={false}
                            scroll={{ y: 540 }}
                        />
                    </Modal> :
                    null
            }
        </>
    );
};

export default ChildOrderBenefitInfo;
