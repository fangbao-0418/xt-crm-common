import React from 'react'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig } from '../../config'
import * as api from '../../api'
import Upload from '@/components/upload'
import { ListRecordProps } from '../../interface'
import MoneyText from '@/components/money-text'

interface Props {
  id?: any
  rows?: any[]
  goNext?: (data: { batchId: string, phoneNumber: string }) => void
}

interface State {
  list: ListRecordProps[]
  totalAmount: number
  totalRecords: number
}

class Main extends React.Component<Props, State> {
  public form: FormInstance
  public batchId: string
  public phoneNumber: string
  public columns: ColumnProps<ListRecordProps>[] = [
    {
      title: '编号',
      width: 80,
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '账务结算ID',
      dataIndex: 'id',
      width: 200
    },
    {
      title: '账务对象类型',
      width: 180,
      dataIndex: 'subjectTypeDesc'
    },
    {
      title: '账务对象ID',
      dataIndex: 'subjectId',
      width: 180
    },
    {
      title: '账务对象名称',
      dataIndex: 'subjectName',
      width: 180
    },
    {
      title: '账务金额',
      dataIndex: 'amount',
      width: 150,
      render: (text) => <MoneyText value={text} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 250,
      render: (text) => APP.fn.formatDate(text)
    },
    {
      title: '审核完成时间',
      dataIndex: 'auditFinishTime',
      width: 250,
      render: (text) => APP.fn.formatDate(text)
    }
  ]
  public state: State = {
    list: [],
    totalAmount: 0,
    totalRecords: 0
  }
  public componentDidMount () {
    const { id, rows } = this.props
    if (id) {
      api.createBatchSingle(this.props.id).then((res) => {
        this.batchId = res.batchId
        this.phoneNumber = res.phoneNumber
        res.amount = APP.fn.formatMoneyNumber(res.amount, 'm2u')
        // res.evidenceImgUrlList = res?.evidenceImgUrlList?.map(() =>)
        this.form.setValues(res)
      })
    } else if (rows) {
      api.createBatch(rows.map((item => item.id))).then((res) => {
        this.phoneNumber = res.phoneNumber
        this.batchId = res.batchId
        // totalAmount
        this.setState({
          list: res.list,
          totalRecords: res.totalRecords,
          totalAmount: res.totalAmount
        })
      })
    }
  }
  public render () {
    const { id, rows } = this.props
    const { list, totalAmount, totalRecords } = this.state
    return (
      <>
        <div style={{ width: 600, margin: '0 auto' }}>
          {id !== undefined && (
            <Form
              getInstance={(ref) => this.form = ref}
              config={getFieldsConfig()}
              readonly
              formItemStyle={{ marginBottom: 0 }}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <FormItem name='id' />
              <FormItem name='inOrOutTypeDesc' label='收支类型' />
              <FormItem name='subjectTypeDesc' label='财务对象类型' />
              <FormItem name='subjectId' />
              <FormItem name='subjectName' />
              <FormItem name='amount' label='账务金额' />
              <FormItem name='applicationRemark' label='原因' />
              <FormItem
                name='文件凭证'
                label='文件凭证'
                inner={(form) => {
                  const value = form.getFieldValue('evidenceDocUrlList')
                  return (
                    <>
                      {form.getFieldDecorator('evidenceDocUrlList')(
                        <Upload
                          // fileType='picture-card'
                          disabled
                        >
                          {!value?.length && '暂无文件' }
                        </Upload>
                      )}
                      {!!value?.length && <div>（点击文件名称下载）</div>}
                    </>
                  )
                }}
              />
              <FormItem
                name='evidenceImgUrlList'
                label='图片凭证'
                inner={(form) => {
                  return form.getFieldDecorator('evidenceImgUrlList')(
                    <Upload
                      listType='picture-card'
                      disabled
                    />
                  )
                }}
              />
              <FormItem name='settlementTypeDesc' label='单据类型' />
              <FormItem name='createTime' type='date' label='创建时间' />
              <FormItem name='auditFinishTime' type='date' label='审核完成时间' />
            </Form>
          )}
        </div>
        {rows && (
          <>
            <Table
              columns={this.columns}
              dataSource={list}
              pagination={{
                pageSize: 10
              }}
            />
            <div>
            共计{totalRecords}条，合计
            <MoneyText value={totalAmount} />
            元
            </div>
          </>
        )}
        <div className='text-center mt20'>
          <Button
            type='primary'
            onClick={() => {
              this.props?.goNext?.({ batchId: this.batchId, phoneNumber: this.phoneNumber })
            }}
          >
            确认无误，下一步
          </Button>
        </div>
      </>
    )
  }
}
export default Main
