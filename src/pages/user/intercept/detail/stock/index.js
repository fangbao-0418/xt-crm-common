import React, { Component } from 'react';
import { Input, Button, Form, Table, Modal, InputNumber, message, Pagination } from 'antd';
import { connect, parseQuery, setQuery } from '@/util/utils';

const FormItem = Form.Item;

const namespace = 'intercept.detail.stock';

const STATUSENUM = {
  1: '拦截中',
  2: '可配置',
  3: '失效'
};

@connect(state => ({
  sourceData: state[namespace].sourceData
}))
@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editRecord: {}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const queryObj = parseQuery();
    let payload = {
      memberId: queryObj.id,
      page: 1,
      pageSize: 10
    };
    dispatch[namespace].getData(payload);
  }

  render() {
    const { sourceData } = this.props;
    const { visible, editRecord } = this.state;

    const columns = [
      {
        title: '商品ID',
        dataIndex: 'spuId',
        key: 'spuId',
        render: (value, record, index) => {
          const obj = {
            children: value,
            props: {}
          };
          if (record.index === 0) {
            obj.props.rowSpan = record.skuCount;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '商品名称',
        dataIndex: 'spuName',
        key: 'spuName',
        render: (value, record) => {
          const obj = {
            children: value,
            props: {}
          };
          if (record.index === 0) {
            obj.props.rowSpan = record.skuCount;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: 'SKU名称',
        dataIndex: 'skuProperties',
        key: 'skuProperties'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: status => {
          return STATUSENUM[status];
        }
      },
      {
        title: '库存',
        dataIndex: 'skuInventory',
        key: 'skuInventory'
      },
      {
        title: '操作',
        dataIndex: 'stock',
        key: 'opertion',
        width: 180,
        render: (stock, record) => {
          return (
            <Button type="link" style={{ padding: 0 }} onClick={this.showModal.bind(this, record)}>
              修改
            </Button>
          );
        }
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: 16 }}>{this.renderForm()}</div>

        <Table
          bordered
          rowKey={item => item.skuId + item.id}
          columns={columns}
          dataSource={sourceData['records']}
          pagination={false}
        />
        <Pagination
          style={{ textAlign: 'right', marginTop: 8 }}
          {...{
            current: sourceData['current'] || 1,
            pageSize: sourceData['size'] || 10,
            total: sourceData['total'],
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: this.pageChange,
            onShowSizeChange: this.pageChange
          }}
        />

        <Modal
          title="修改库存"
          width={300}
          visible={visible}
          onCancel={this.modalCancel}
          onOk={this.modalOk}
        >
          <div>
            <span>请录入库存数目</span>
            <InputNumber
              min={0}
              max={1000}
              step={1}
              precision={0}
              style={{ marginLeft: 8 }}
              value={editRecord.skuInventory}
              onChange={this.stockChange}
            />
          </div>
        </Modal>
      </div>
    );
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="商品ID">{getFieldDecorator('productId')(<Input />)}</FormItem>
        <FormItem label="商品名称">{getFieldDecorator('productName')(<Input />)}</FormItem>
        <FormItem>
          <Button style={{ lineHeight: 1 }} type="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button onClick={this.resetFields} style={{ marginLeft: 8, lineHeight: 1 }}>
            清除条件
          </Button>
        </FormItem>
      </Form>
    );
  };

  onDetail = () => {
    APP.history.push('/user/intercept/detail?id=123456');
  };

  handleSearch = param => {
    const {
      form: { validateFields },
      dispatch
    } = this.props;
    const queryObj = parseQuery();

    validateFields((errors, values) => {
      if (!errors) {
        const payload = {
          ...values,
          memberId: queryObj.id,
          page: param.page || 1,
          pageSize: param.pageSize || 10
        };
        dispatch[namespace].getData(payload);
      }
    });
  };

  resetFields = () => {
    const {
      form: { resetFields }
    } = this.props;
    resetFields();
  };

  showModal = record => {
    this.setState({
      visible: true,
      editRecord: { ...record }
    });
  };

  modalCancel = () => {
    this.setState({
      visible: false
    });
  };

  modalOk = () => {
    const { dispatch } = this.props;
    const { editRecord } = this.state;
    const queryObj = parseQuery();
    if (queryObj.id) {
      const payload = {
        id: editRecord.id,
        memberId: queryObj.id,
        productId: editRecord.spuId,
        skuId: editRecord.skuId,
        inventory: editRecord.skuInventory
      };
      dispatch[namespace].changeStockBySKUId(payload).then(res => {
        if (res) {
          this.setState(
            {
              visible: false
            },
            () => {
              dispatch[namespace].updateSkuList({ ...editRecord });
              message.success('库存修改成功');
            }
          );
        }
      });
    }
  };

  stockChange = val => {
    const { editRecord } = this.state;
    this.setState({
      editRecord: { ...editRecord, skuInventory: val }
    });
  };

  pageChange = (page, pageSize) => {
    setQuery({
      page,
      pageSize
    });
    this.handleSearch({ page, pageSize });
  };
}
