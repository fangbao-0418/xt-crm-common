import React from "react";
import ListPage from "@/packages/common/components/list-page";
import { ColumnProps } from "antd/es/table";
import { getFieldsConfig } from "./config";
import { Form, FormItem } from "@/packages/common/components";
import { Button, Modal, Table } from "antd";
import Viewer from 'viewerjs';

interface Invoice {
  No: string;
}

class InvoiceReview extends React.Component {
  public imageRef: any;
  public state = {
    visible: false,
    dataSource: [
      {
        date: "1",
        operate: "1",
        faceValue: "100",
      },
    ],
  };
  // 列表列配置
  public columns: ColumnProps<Invoice>[] = [
    {
      key: "No",
      title: "提现申请单编号",
      dataIndex: "No",
    },
    {
      key: "supplierType",
      title: "供应商类型",
      dataIndex: "supplierType",
    },
    {
      key: "supplierId",
      title: "供应商ID",
      dataIndex: "supplierId",
    },
    {
      key: "supplierName",
      title: "供应商名称",
      dataIndex: "supplierName",
    },
    {
      key: "withdrawalAmount",
      title: "提现金额",
      dataIndex: "withdrawalAmount",
    },
    {
      key: "supplierName",
      title: "供应商名称",
      dataIndex: "supplierName",
    },
    {
      key: "withdrawalAmount",
      title: "提现金额",
      dataIndex: "withdrawalAmount",
    },
    {
      key: "faceValue",
      title: "发票票面总额",
      dataIndex: "faceValue",
    },
    {
      key: "submissionTime",
      title: "提交时间",
      dataIndex: "submissionTime",
    },
    {
      key: "auditStatus",
      title: "审核状态",
      dataIndex: "auditStatus",
    },
    {
      key: "auditPerson",
      title: "审核人",
      dataIndex: "auditPerson",
    },
    {
      key: "auditTime",
      title: "审核时间",
      dataIndex: "auditTime",
    },
    {
      key: "operate",
      title: "操作",
      render: () => {
        return (
          <Button
            type="link"
            onClick={() => {
              this.setState({ visible: true });
            }}
          >
            查看
          </Button>
        );
      },
    },
  ];
  // 表单列配置
  public formColumns: ColumnProps<any>[] = [
    {
      key: "date",
      title: "开票日期",
      dataIndex: "date",
    },
    {
      key: "No",
      title: "发票编号",
      dataIndex: "No",
    },
    {
      key: "faceValue",
      title: "票面总额",
      dataIndex: " faceValue",
    },
    {
      key: "operate",
      title: "发票图片",
      render: () => {
        return (
          <div>
            <Button
              type="link"
              onClick={this.handleView}
            >
              查看
            </Button>
            <Button type="link">下载</Button>
          </div>
        );
      },
    },
  ];
  public handleView = () => {
    
  }
  public fetchData = async () => {
    return {
      page: 1,
      pages: 1,
      records: [
        {
          withdrawalCode: "3943159584220042231635",
        },
      ],
    };
  };
  public render() {
    return (
      <>
        <Modal width="800px" visible={this.state.visible}>
          <h3 style={{ marginTop: 0, fontSize: 18 }}>发票审核</h3>
          <Form>
            <FormItem label="提现申请单编号">3943159584220042231635</FormItem>
            <FormItem label="提现金额">999999.99</FormItem>
            <FormItem label="供应商类型">供应商</FormItem>
            <FormItem label="供应商ID">3401</FormItem>
            <FormItem label="供应商名称">杭州喜团科技有限公司</FormItem>
            <FormItem label="发票">
              <Table
                columns={this.formColumns}
                dataSource={this.state.dataSource}
              />
            </FormItem>
            <h3 style={{ marginTop: 0, fontSize: 18 }}>审核意见</h3>
            <FormItem
              name="opinion"
              label="审核意见"
              required
              type="radio"
              options={[
                {
                  label: "审核通过",
                  value: "1",
                },
                {
                  label: "审核不通过",
                  value: "0",
                },
              ]}
            />
            <FormItem
              label="说明"
              name="description"
              type="textarea"
              placeholder="限制140字（仅审核不通过，这里必填）"
              controlProps={{
                maxLength: 140,
                rows: 5,
              }}
            />
          </Form>
        </Modal>
        <ListPage
          api={this.fetchData}
          formConfig={getFieldsConfig()}
          formItemLayout={
            <>
              <FormItem name="withdrawalCode" />
              <FormItem name="supplierName" />
              <FormItem name="supplierId" />
              <FormItem name="supplierType" />
              <FormItem
                name="status"
                label="审核状态"
                type="select"
                options={[
                  {
                    label: "全部",
                    value: "",
                  },
                  {
                    label: "待审核",
                    value: "1",
                  },
                  {
                    label: "审核通过",
                    value: "2",
                  },
                  {
                    label: "审核不通过",
                    value: "3",
                  },
                ]}
              />
              <FormItem name="createTime" label="创建时间" type="rangepicker" />
            </>
          }
          columns={this.columns}
        />
      </>
    );
  }
}

export default InvoiceReview;
