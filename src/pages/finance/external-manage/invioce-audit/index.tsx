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
import MoneyRender from '@/components/money-render'
import { getPayload, setPayload } from '@/packages/common/utils'
const namespace = 'external/invioce'
interface Invoice {
  No: string;
}
interface State{
  detail: any
  type: number
}
const { Option } = Select

class InvoiceReview extends React.Component {
  public cachePayload = getPayload(namespace)
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
      title: "提现申请单编号",
      width: 150,
      dataIndex: "fundTransferNo",
    },
    {
      title: "供应商类型",
      width: 120,
      dataIndex: "supplierTypeDesc",
    },
    {
      title: "供应商ID",
      dataIndex: "supplierId",
      width: 120,
    },
    {
      title: "供应商名称",
      width: 150,
      dataIndex: "supplierName",
    },
    {
      title: "提现金额",
      width: 120,
      dataIndex: "fundTransferAmount",
      render: MoneyRender
    },
    {
      title: "发票票面总额",
      width: 150,
      dataIndex: "invoiceAmount",
      render: MoneyRender
    },
    {
      width: 200,
      title: "提交时间",
      dataIndex: "createTime",
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: "审核状态",
      width: 120,
      dataIndex: "auditStatusDesc",
    },
    {
      title: "审核人",
      width: 120,
      dataIndex: "auditorName",
    },
    {
      title: "审核时间",
      width: 200,
      dataIndex: "auditTime",
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: "操作",
      width: 150,
      fixed: 'right',
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
      title: "开票日期",
      dataIndex: "invoiceDate",
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: "发票编号",
      dataIndex: "invoiceNo",
    },
    {
      title: "票面总额",
      dataIndex: "invoiceAmount",
      render: MoneyRender

    },
    {
      title: "发票图片",
      dataIndex: "invoiceImage",
      render: (text,records) => {
        return (
          <div>
            <PreviewImage
              ref={(ref) =>this.imageRef = ref }
              src={text||''}
              alt={'发票编号：'+records.invoiceNo}
            />
            <Button type="link" onClick={this.handleView}>
              查看
            </Button>
            <Button type="link"
             onClick={() =>{
              let str=text
              const index = text?.lastIndexOf('/')
              str = text?.substring(index + 1, text.length)
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
              if(vals.auditStatus===2&&!vals.auditDesc){
                message.error('请输入说明')
                return
              }
              api.auditInvoice({ ...vals, id:detail.id }).then(res => {
                message.success('操作成功！')
                this.listpage.refresh()
                ModalConfig.close('Synchronizesupplier')
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
             readonly={res.auditStatus!==0}
             getInstance={ref => this.form = ref}
             mounted={() => {
              this.form.setValues(detail)
            }}
             >
            <FormItem label="提现申请单编号">{res?.fundTransferNo}</FormItem>
            <FormItem label="提现金额">{APP.fn.formatMoney(res?.fundTransferAmount||0)}</FormItem>
            <FormItem label="供应商类型">{res?.supplierTypeDesc}</FormItem>
            <FormItem label="供应商ID">{res?.supplierId}</FormItem>
            <FormItem label="供应商名称">{res?.supplierName}</FormItem>
            <FormItem label="发票">
              <Table
                columns={this.formColumns}
                pagination={false}
                dataSource={res?.invoiceDetailVOList||[]}
              />
            </FormItem> 
            <h3 style={{ marginTop: 0, fontSize: 18 }}>审核意见</h3>
            <FormItem
              name="auditStatus"
              label="审核意见"
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '请选择审核意见' }
                ]
              }}
              type="radio"
              options={[
                {
                  label: "审核通过",
                  value: 1,
                },
                {
                  label: "审核不通过",
                  value: 2,
                },
              ]}
            />
            <FormItem
              label="说明"
              name="auditDesc"
              type="textarea"
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
  public export = () => {
    const payload = this.listpage.form.getValues()
    api.batchExport({...payload})
    .then(res => {
      APP.success('导出成功，请前往下载列表下载文件')
    })
  };
  public render() {
    const {type}=this.state
    return (
      <>
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          mounted={() => {
            this.listpage.form.setValues({
              ...this.cachePayload
            })
          }}
          api={api.getInvoiceList}
          formConfig={getFieldsConfig()}
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: this.columns.reduce((a: any, b: any) => {
                return (typeof a === 'object' ? a.width : a) as any + b.width
              }) as number
            }
          }}
          onReset={() => {
            setPayload(namespace, undefined)
            this.cachePayload = undefined
            this.listpage.refresh(true)
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={this.export}
              >
                批量导出
              </Button>
            </div>
          )}
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
                                  supplierId: undefined
                                })
                              })
                            }}
                          >
                            <Option value={1} key={1}>ID</Option>
                            <Option value={2} key={2}>名称</Option>
                          </Select>
                        </Col>
                        <Col span={12}>{
                          from.getFieldDecorator('supplierId')(
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
