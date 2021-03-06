import React from 'react';
import { setQuery, parseQuery } from '@/util/utils';
import { Table, Card, Form, Button, Spin, message } from 'antd';
import SearchForm from './components/searchForm'
import PayModal from './components/payModal'
import DetailModal from './components/detailModal'
import BatchPayModal from './components/batchPayModal'
import BatchFaliModal from './components/batchFaliModal'
import * as api from '../api'
import getColumns from './config/columns'
import styles from './style.module.scss'

class List extends React.Component {
  constructor (props) {
    super(props);
    const params = parseQuery();
    this.state = {
      dataSource: [],
      recordItem: {},
      page: {
        total: 0,
        current: +params.page || 1,
        pageSize: 10
      },
      selectedRowKeys: [],
      payModalVisible: false, // 确认支付模态框
      batchPayModalVisible: false, // 批量支付模态框
      batchFailModalVisible: false, // 批量失败模态框
      detailModalVisible: false, // 明细模态框
      detailModalUpload: true, // 是否上传凭证
      isBatchFail: false // 是否批量支付
    };
  }

  componentDidMount() {
    let settlementSerialNo = (parseQuery() || {}).settlementSerialNo;
    if (settlementSerialNo) {
      this.searchFormRef.setFieldsValue({
        settlementSerialNo
      })
      this.fetchData({ settlementSerialNo })
    } else {
      this.fetchData();
    }

  }
  componentDidUpdate(prevProps) {
    if (this.props.paymentStatus !== prevProps.paymentStatus) {
      this.searchFormRef.setFieldsValue({
        settlementSerialNo: ''
      })
      const { page } = this.state
      page.current = 1;
      this.fetchData();
    }
  }
  // 导出
  paymentBatchExport = (params = {}) => {
    api.paymentBatchExport('/finance/payment/exportData',params).then((res) => {
      console.log(res, 'res')
      return message.success('导出成功，请前往下载列表下载文件')
    }).catch(err => {
      console.log(err)
    })
  }
  // 列表数据
  fetchData = (params = {}) => {
    const { paymentStatus } = this.props;
    const { page } = this.state;
    const options = {
      paymentStatus,
      pageSize: page.pageSize,
      page: page.current,
      ...params
    };
    api.getPaymentList(options).then((res = {}) => {
      page.total = res.total;
      this.setState({
        dataSource: res.records,
        page
      });
      setQuery(options);
    })
  }

  // 翻页
  handleChangeTable = e => {
    this.setState(
      {
        page: e
      },
      () => {
        const params = parseQuery();
        this.fetchData({
          ...params,
          page: e.current,
          pageSize: e.pageSize
        });
      }
    );
  };

  // 确认支付
  handleConfirm = (record, type) => () => {
    if (type === 'look') { // 查看明细
      api.getPaymentDetail(record.id).then(res => {
        this.setState({
          recordItem: res,
          detailModalVisible: true,
          detailModalUpload: false
        })
      })
    } else if (type === 'lookupload') { // 查看明细 上传
      api.getPaymentDetail(record.id).then(res => {
        this.setState({
          recordItem: res,
          detailModalVisible: true,
          detailModalUpload: true
        })
      })
    } else if (type === 'fail') { // 确认失败
      this.setState({
        batchFailModalVisible: true,
        recordItem: record,
        isBatchFail: false
      })
    } else { // 确认支付
      api.getPaymentDetail(record.id).then(res => {
        this.setState({
          payModalVisible: true,
          recordItem: res
        })
      })
    }
  };

  // 确认支付回调
  handlePayConfirm = () => {
    this.setState({
      payModalVisible: false
    })
    this.fetchData()
  };

  // 失败确认
  handleFailConfirm = () => {
    this.setState({
      batchFailModalVisible: false
    })
    this.fetchData()
  }

  handlePayUpload = () => {
    this.setState({
      detailModalVisible: false,
      detailModalUpload: false
    })
    this.fetchData()
  }

  // 模态框取消操作
  handleCancel = (key) => {
    this.setState({
      [key]: false
    })
  };

  // 表格批量选择
  handleSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    })
  }

  // 显示批量模态框
  handleBatchShow = (key) => {
    this.setState({
      [key]: true,
      isBatchFail: true
    })
  }

  render () {
    const { page, dataSource, recordItem, isBatchFail, detailModalUpload } = this.state; // , selectedRowKeys

    return (
      <Spin tip="操作处理中..." spinning={false}>
        {/* 搜索表单 */}
        <SearchForm
          wrappedComponentRef={ref => this.searchFormRef = ref}
          onFetchData={this.fetchData}
          paymentBatchExport={this.paymentBatchExport}
          page={page}
        />
        <Card style={{ marginTop: 10 }}>
          <div className={styles.actions}>
            <div className={styles.left}>
              <Button
                type="primary"
                onClick={this.handleBatchShow.bind(this, 'batchPayModalVisible')}
              >
                批量支付
              </Button>
              <Button
                style={{ marginLeft: 16 }}
                type="primary"
                onClick={this.handleBatchShow.bind(this, 'batchFailModalVisible')}
              >
                批量失败
              </Button>
            </div>
            <div className={styles.right}>
              <span
                className="href"
                onClick={() => {
                  APP.fn.download(require('@/assets/files/批量支付成功模版.xlsx'), '批量支付模版')
                }}
              >
                下载批量支付模版
              </span>
              <span
                style={{ marginLeft: 16 }}
                className="href"
                onClick={() => {
                  APP.fn.download(require('@/assets/files/批量支付失败模板.xlsx'), '批量失败模版')
                }}
              >
                下载批量失败模版
              </span>
            </div>
          </div>
          <Table
            bordered
            columns={getColumns({
              onConfirm: this.handleConfirm
            })}
            dataSource={dataSource}
            pagination={page}
            onChange={this.handleChangeTable}
            // rowSelection={rowSelection}
            defaultExpandAllRows={true}
            rowKey={record => record.id}
          />
        </Card>
        {/* 确认提示弹窗 */}
        <PayModal
          modalProps={{
            visible: this.state.payModalVisible,
            onCancel: this.handleCancel.bind(this, 'payModalVisible')
          }}
          handlePayConfirm={this.handlePayConfirm}
          record={recordItem}
        />
        {/* 明细模态框 */}
        <DetailModal
          modalProps={{
            visible: this.state.detailModalVisible,
            onCancel: this.handleCancel.bind(this, 'detailModalVisible')
          }}
          record={recordItem}
          handlePayUpload={this.handlePayUpload}
          detailModalUpload={detailModalUpload}
        />
        {/* 批量支付模态框 */}
        <BatchPayModal
          modalProps={{
            visible: this.state.batchPayModalVisible,
            onCancel: this.handleCancel.bind(this, 'batchPayModalVisible')
          }}
        />
        {/* 批量失败模态框 */}
        <BatchFaliModal
          record={recordItem}
          isBatchFail={isBatchFail}
          modalProps={{
            visible: this.state.batchFailModalVisible,
            onCancel: this.handleCancel.bind(this, 'batchFailModalVisible')
          }}
          handleFailConfirm={this.handleFailConfirm}
        />
      </Spin>
    )
  }
}
export default Form.create()(List);