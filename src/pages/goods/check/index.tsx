import React from 'react';
import { Table, Card, Button } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import MoneyRender from '@/components/money-render'
import GoodCell from '@/components/good-cell'
import moment from 'moment';
import * as api from '../api'
import { getFieldsConfig } from './config';
import Form, { FormInstance } from '@/packages/common/components/form';
interface State {
  list: any[]
}

function formatTime(text: any, record: GoodsCheck.ItemProps, index: number) {
  return moment(text).format('YYYY-MM-DD HH:mm:ss');
}
class Main extends React.Component<any, State> {
  public state: State = {
    list: []
  }
  public form: FormInstance;
  /**
   * 跳转到详情页面
   */
  public handleView() {
    APP.history.push('/goods/checkdetail/1191?type=check&readOnly=1&page=1&pageSize=10')
  }
  /**
   * 跳转到编辑页面
   */
  public handleEdit() {
    APP.history.push('/goods/checkedit/1191?type=check&page=1&pageSize=10')
  }
  public payload: GoodsCheck.payloadProps = {
    page: 1,
    pageSize: 10,
    total: 0
  }
  /**
   * 条件查询
   */
  public handleSearch = () => {
    const value = this.form.getValues();
    console.log('applyEndTime', value.applyEndTime)
    this.payload = {
      ...this.payload,
      ...value,
      page: 1,
    };
    this.fetchData();
  }
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
        return (
          <GoodCell
            skuName={text}
            coverUrl={record.coverUrl}
          />
        )
      }
    },
    {
      title: '供货价',
      dataIndex: 'supplyPrice',
      key: 'supplyPrice',
      render: MoneyRender
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
    },
    {
      title: '审核人',
      dataIndex: 'auditUser',
      key: 'auditUser',
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
          <>
            <Button type="primary" onClick={this.handleEdit}>编辑</Button>
            <Button className="ml10" onClick={this.handleView}>查看</Button>
          </>
        )
      }
    }
  ];
  public reset() {
    this.form.props.form.resetFields();
    this.payload = {
      pageSize: 10,
      page: 1,
      total: 0
    };
    this.fetchData()
  }
  public fetchData = async () => {
    const res = await api.getToAuditList(this.payload)
    this.payload.total = res.total
    this.setState({ list: res.result })
    console.log('res=>', res)
  }
  public componentDidMount() {
    this.fetchData();
  }
  public onPaginationChange = (page: number, pageSize?: number) => {
    this.payload.page = page;
    this.fetchData();
  }
  public render() {
    console.log('this.state.list=>', this.state.list);
    const pagination: PaginationConfig = {
      current: this.payload.page,
      total: this.payload.total,
      onChange: this.onPaginationChange
    }
    return (
      <div>
        <Card title="筛选">
          <Form
            layout="inline"
            config={getFieldsConfig()}
            getInstance={ref => {
              this.form = ref;
            }}
            addonAfter={
              <div
                style={{
                  // display: 'inline-block',
                  lineHeight: '40px',
                  verticalAlign: 'top',
                }}
              >
                <Button
                  type="primary"
                  className="mr10"
                  onClick={this.handleSearch}
                >
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
          ></Form>
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
