import React from "react";
import ListPage from "@/packages/common/components/list-page";
import { ColumnProps } from "antd/es/table";
import { getFieldsConfig } from "./config";
import { Form, FormItem } from "@/packages/common/components";
import { Button, message, Input, Table, Row, Col, Select } from "antd";
import PreviewImage from "./components/PreviewImage";
import ModalConfig from '@/components/modalConfig'
import * as api from './api'
import { FormInstance } from '@/packages/common/components/form'
import { formatPrice } from '@/util/format'
import SearchFetch from '@/components/search-fetch'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { download } from '@/util/utils';

interface Invoice {
  No: string;
}
interface State{
  detail: any
  type: number
}
const { Option } = Select

class InvoiceReview extends React.Component {
  public listpage: ListPageInstanceProps
  public imageRef: any;
  public form: FormInstance
  public state: State = {
    detail: {},
    type: 2
  };
  // 列表列配置
  public columns: ColumnProps<Invoice>[] = [
    {
      key: "fundTransferNo",
      title: "提现申请单编号",
      dataIndex: "fundTransferNo",
    },
    {
      key: "supplierTypeDesc",
      title: "供应商类型",
      dataIndex: "supplierTypeDesc",
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
      key: "fundTransferAmount",
      title: "提现金额",
      dataIndex: "fundTransferAmount",
    },
    {
      key: "invoiceAmount",
      title: "发票票面总额",
      dataIndex: "invoiceAmount",
    },
    {
      key: "createTime",
      title: "提交时间",
      dataIndex: "createTime",
    },
    {
      key: "auditStatus",
      title: "审核状态",
      dataIndex: "auditStatus",
    },
    {
      key: "auditorName",
      title: "审核人",
      dataIndex: "auditorName",
    },
    {
      key: "auditTime",
      title: "审核时间",
      dataIndex: "auditTime",
    },
    {
      key: "operate",
      title: "操作",
      render: (text,records) => {
        return (
          <Button
            type="link"
            onClick={() => {
              this.getDetailInfoData(records)
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
      key: "invoiceDate",
      title: "开票日期",
      dataIndex: "invoiceDate",
    },
    {
      key: "invoiceNo",
      title: "发票编号",
      dataIndex: "invoiceNo",
    },
    {
      key: "invoiceAmount",
      title: "票面总额",
      dataIndex: " invoiceAmount",
    },
    {
      key: "invoiceImage",
      title: "发票图片",
      render: (text) => {
        return (
          <div>
            <PreviewImage
              ref={(ref) =>this.imageRef = ref }
              src="https://sh-tximg.hzxituan.com/tximg/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551595679759696.jpg"
              alt='发票编号：8899001'
            />
            <Button type="link" onClick={this.handleView}>
              查看
            </Button>
            <Button type="link"
             onClick={() =>{
              let str=text
              const index = text.lastIndexOf('/')
              str = text.substring(index + 1, text.length)
              download(this.getUrl(text), str)
             }}
            >下载</Button>
          </div>
        );
      },
    },
  ];
  public handleView = () => {
    this.imageRef.handleView()
  };

  public getUrl (url: string) {
    url = /^http/.test(url) ? url : `https://assets.hzxituan.com/${url}`
    return url
  }
  public showModal (txt: any, dom: any, domId: any, cd: any, cancel: any) {
    ModalConfig.show(
      {
        maskClosable: true,
        title: txt,
        width: '80%',
        onOk: cd,
        onCancel: cancel
      }, dom, domId
    )
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

  public getDetailInfoData (detail: any) {
    api.getInvoiceDetail({ id:detail.id }).then(res => {
      if (res) {
        const ok = () => {
          if(detail.auditStatus!==0){
            ModalConfig.close('Synchronizesupplier')
            return
          }
          this.form.props.form.validateFields((err, vals) => {
            if (!err) {
              api.auditInvoice({ id:detail.id }).then(res => {
                ModalConfig.close('Synchronizesupplier')
                message.success('审核成功！')
              })
            }
          })
        }
        const onCancel = () => {
          ModalConfig.close('Synchronizesupplier')
        }
        this.showModal('查看',
        <div>
             <h3 style={{ marginTop: 0, fontSize: 18 }}>发票审核</h3>
          <Form
             readonly={true}
             getInstance={ref => this.form = ref}
             >
            <FormItem label="提现申请单编号">{res?.fundTransferNo}</FormItem>
            <FormItem label="提现金额">{res?.fundTransferAmount}</FormItem>
            <FormItem label="供应商类型">{res?.supplierTypeDesc}</FormItem>
            <FormItem label="供应商ID">{res?.supplierId}</FormItem>
            <FormItem label="供应商名称">{res?.supplierName}</FormItem>
            <FormItem label="发票">
              <Table
                columns={this.formColumns}
                dataSource={res?.invoiceDetailVOList||[]}
              />
            </FormItem> 
            <h3 style={{ marginTop: 0, fontSize: 18 }}>审核意见</h3>
            <FormItem
              name="auditStatus"
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
              name="auditDesc"
              type="textarea"
              required
              placeholder="限制140字（仅审核不通过，这里必填）"
              controlProps={{
                maxLength: 140,
                rows: 5,
              }}
            />
          </Form>
        
        </div>
         , 'Synchronizesupplier', ok, onCancel)
      }
    })
  }
  public render() {
    const {type}=this.state
    return (
      <>
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          api={api.getInvoiceList}
          formConfig={getFieldsConfig()}
          formItemLayout={
            <>
              <FormItem name="fundTransferNo" />
              <FormItem
                label='供应商'
                inner={
                  (from) => {
                    return (
                      <Row style={{ marginTop: 3 }}>
                        <Col span={12}>
                          <Select
                            value={type}
                            onChange={(value: any)=>{
                              this.setState({
                                type: value
                              }, ()=>{
                                this.listpage.form.setValues({
                                  storeId: undefined
                                })
                              })
                            }}
                          >
                            <Option value={1} key={1}>ID</Option>
                            <Option value={2} key={2}>名称</Option>
                          </Select>
                        </Col>
                        <Col span={12}>{
                          from.getFieldDecorator('storeId')(
                            type===2?<SearchFetch
                              placeholder='请输入名称'
                              api={api.searchSupplier}
                            />:<Input
                              placeholder='请输入ID' />
                          )
                        }
                        </Col>
                      </Row>
                    )
                  }
                }
              />
              <FormItem name="supplierType" />
              <FormItem
                name="auditStatus"
                label="审核状态"
                type="select"
                options={[
                  {
                    label: "待审核",
                    value: "0",
                  },
                  {
                    label: "审核通过",
                    value: "1",
                  },
                  {
                    label: "审核不通过",
                    value: "2",
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
