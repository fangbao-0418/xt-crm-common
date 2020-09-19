import React from "react";
import { FormComponentProps } from "antd/lib/form";
import { Button, Form, DatePicker, Input, Modal, Select, Table } from "antd";
import moment from "moment";
import DateFns from "date-fns";
import activityType from "@/enum/activityType";
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

interface GetActivityProps extends FormComponentProps {
  type: string;
  handleCancelModal?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handlenChanageSelectio?: (
    selectedRowKeys: string[] | number[],
    selectedRows: any[]
  ) => void;
  handleOkModal?: (e: any) => void;
  actList: any[];
  selectedRowKeys: any[];
  modalPage: {
    current: 1;
    total: 0;
    pageSize: 10;
  };
  visible1: boolean;
  getPromotionList: (params?: any) => void;
  handleTabChangeModal?: (e: any) => void;
}
class Main extends React.Component<GetActivityProps, {}> {
  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err: any, vals: any) => {
      if (!err) {
        let params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: 1,
          pageSize: 20,
        };
        params = _.omitBy(params, (val, key) => {
          return key === "time" || _.isNil(val) || val === "";
        });
        this.props.getPromotionList(params);
      }
    });
  };
  public actColumns = (data = []) => {
    return [
      {
        title: "活动ID",
        dataIndex: "id",
        width: 100,
      },
      {
        title: "活动名称",
        width: 300,
        dataIndex: "title",
      },
      {
        title: "开始时间",
        dataIndex: "startTime",
        render: (text: any) => <>{DateFns.format(text, "YYYY-MM-DD HH:mm:ss")}</>,
      },
      {
        title: "结束时间",
        dataIndex: "endTime",
        render: (text: any) => <>{DateFns.format(text, "YYYY-MM-DD HH:mm:ss")}</>,
      },
      {
        title: "活动类型",
        dataIndex: "type",
        render: (text: any) => <>{activityType.getValue(text)}</>,
      },
      {
        title: "活动状态",
        dataIndex: "status",
        render: (text: any) => <>{text === 0 ? "关闭" : "开启"}</>,
      },
    ];
  };
  
  public render() {
    const {
      handleCancelModal,
      handleOkModal,
      actList,
      selectedRowKeys,
      modalPage,
      visible1,
      handleTabChangeModal,
      handlenChanageSelectio,
      form,
    } = this.props;
    const { getFieldDecorator, resetFields } = form;
    return (
      <Modal
        title="选择活动"
        visible={visible1}
        width={1000}
        onCancel={handleCancelModal}
        onOk={handleOkModal}
      >
        <Form layout="inline" style={{ marginBottom: "20px" }}>
          <FormItem label="活动名称">
            {getFieldDecorator("name", {
              initialValue: "",
            })(<Input placeholder="请输入活动名称" style={{ width: 180 }} />)}
          </FormItem>
          <FormItem label="活动ID">
            {getFieldDecorator("promotionId", {
              initialValue: "",
            })(<Input placeholder="请输入活动ID" style={{ width: 180 }} />)}
          </FormItem>
          <FormItem label="商品名称">
            {getFieldDecorator("productName", {
              initialValue: "",
            })(<Input placeholder="请输入商品名称" style={{ width: 180 }} />)}
          </FormItem>
          <FormItem label="商品ID">
            {getFieldDecorator("productId", {
              initialValue: "",
            })(<Input placeholder="请输入商品ID" style={{ width: 180 }} />)}
          </FormItem>
          <FormItem label="活动类型">
            {getFieldDecorator("type", {
              initialValue: "",
            })(
              <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                <Option value="">全部</Option>
                {activityType.getArray().map((val, i) => (
                  <Option value={val.key} key={i}>
                    {val.val}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="活动状态">
            {getFieldDecorator("status", {
              initialValue: "",
            })(
              <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                <Option value="">全部</Option>
                <Option value="0">关闭</Option>
                <Option value="1">开启</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="有效时间">
            {getFieldDecorator("time", {
              initialValue: ["", ""],
            })(
              <RangePicker
                style={{ width: 430 }}
                format="YYYY-MM-DD HH:mm"
                showTime={{
                  defaultValue: [
                    moment("00:00:00", "HH:mm:ss"),
                    moment("23:59:59", "HH:mm:ss"),
                  ],
                }}
              />
            )}
          </FormItem>
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={() => resetFields()}>
              重置
            </Button>
          </div>
        </Form>
        <Table
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: handlenChanageSelectio,
          }}
          scroll={{ x: true }}
          columns={this.actColumns()}
          dataSource={actList}
          pagination={modalPage}
          onChange={handleTabChangeModal}
          rowKey={(record: any) => record.id}
        />
      </Modal>
    );
  }
}

export default Form.create<any>()(Main);
