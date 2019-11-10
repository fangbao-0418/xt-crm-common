import React from 'react';
import { Table, Card, Button } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import MoneyRender from '@/components/money-render';
import GoodCell from '@/components/good-cell';
import moment from 'moment';
import * as api from '../api';
import { auditStatusConfig } from './config';
import Form, { FormInstance, FormItem } from '@/packages/common/components/form';
import SelecFetch from '@/components/select-fetch';
import SuppilerSelect from '@/components/suppiler-select';
import { getCategoryTopList } from '../api';
interface State {
  list: any[];
}

function formatTime(text: any, record: GoodsCheck.ItemProps, index: number) {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss'): '-';
}
class Main extends React.Component<any, State> {
  public state: State = {
    list: [],
  };
  public form: FormInstance;
  public payload: GoodsCheck.payloadProps = {
    page: 1,
    pageSize: 10,
    total: 0,
  };
  /**
   * 条件查询
   */
  public handleSearch = () => {
    const value = this.form.getValues();
    console.log('applyEndTime', value.applyEndTime);
    this.payload = {
      ...this.payload,
      ...value,
      page: 1,
    };
    this.fetchData();
  };
  public columns: ColumnProps<GoodsCheck.ItemProps>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return <GoodCell skuName={text} coverUrl={record.coverUrl} />;
      },
    },
    {
      title: '供货价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: MoneyRender,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '一级类目',
      dataIndex: 'firstCategoryName',
      key: 'firstCategoryName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: formatTime,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return (auditStatusConfig as any)[String(text)];
      },
    },
    {
      title: '审核人',
      dataIndex: 'auditUser',
      key: 'auditUser',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return text || '无';
      }
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      render: formatTime,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              APP.history.push(`/goods/detail/${record.id}?page=1&pageSize=10`);
            }}
          >
            {record.auditStatus === 1 ? '审核' : '查看'}
          </Button>
        );
      },
    },
  ];
  public reset() {
    this.form.props.form.resetFields();
    this.payload = {
      pageSize: 10,
      page: 1,
      total: 0,
    };
    this.fetchData();
  }
  public fetchData = async () => {
    const res = (await api.getToAuditList(this.payload)) || {};
    this.payload.total = res.total;
    this.setState({ list: res.records });
    console.log('res=>', res);
  };
  public componentDidMount() {
    this.fetchData();
  }
  public onPaginationChange = (page: number, pageSize?: number) => {
    this.payload.page = page;
    this.fetchData();
  };
  public render() {
    const pagination: PaginationConfig = {
      current: this.payload.page,
      total: this.payload.total,
      onChange: this.onPaginationChange,
    };
    return (
      <div>
        <Card title="筛选">
          <Form
            layout="inline"
            rangeMap={{
              createTime: {
                fields: ['createStartTime', 'createEndTime'],
              },
              auditTime: {
                fields: ['auditStartTime', 'auditEndTime'],
              },
            }}
            getInstance={ref => {
              this.form = ref;
            }}
            addonAfter={
              <div
                style={{
                  display: 'inline-block',
                  lineHeight: '40px',
                  verticalAlign: 'top',
                }}
              >
                <Button type="primary" className="mr10" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    this.reset();
                  }}
                >
                  清除
                </Button>
              </div>
            }
          >
            <FormItem label="商品名称" name="productName" />
            <FormItem label="商品ID" name="productId" />
            <FormItem
              label="一级类目"
              inner={form => {
                return form.getFieldDecorator('firstCategoryName')(
                  <SelecFetch
                    style={{ width: '174px' }}
                    fetchData={() => {
                      return getCategoryTopList();
                    }}
                  />,
                );
              }}
            />
            <FormItem
              label="供应商名称"
              inner={form => {
                return form.getFieldDecorator('supplierName')(
                  <SuppilerSelect style={{ width: '174px' }} />,
                );
              }}
            />
            <FormItem
              label="审核状态"
              name="auditStatus"
              type="select"
              controlProps={{
                style: {
                  width: '174px',
                },
              }}
              options={[
                {
                  label: '全部',
                  value: -1,
                },
                {
                  label: '待提交',
                  value: 0,
                },
                {
                  label: '待审核',
                  value: 1,
                },
                {
                  label: '审核不通过',
                  value: 2,
                },
                {
                  label: '审核通过',
                  value: 3,
                },
              ]}
            />
            <FormItem label="审核人" name="auditUser" />
            <FormItem
              name="createTime"
              label="创建时间"
              type="rangepicker"
              controlProps={{
                showTime: true,
              }}
            />
            <FormItem
              label="审核时间"
              name="auditTime"
              type="rangepicker"
              controlProps={{
                showTime: true,
              }}
            />
          </Form>
        </Card>
        <Card>
          <Table
            columns={this.columns}
            dataSource={this.state.list}
            pagination={pagination}
            rowKey="id"
          />
        </Card>
      </div>
    );
  }
}
export default Main;
