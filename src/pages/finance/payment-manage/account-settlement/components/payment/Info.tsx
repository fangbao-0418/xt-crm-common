import React from 'react'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig } from '../../config'
import * as api from '../../api'
import Upload from '@/components/upload'
import { ListRecordProps } from '../../interface'

interface Props {
  id: any
  goNext?: () => void
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public columns: ColumnProps<ListRecordProps>[] = [
    {
      title: '编号'
    },
    {
      title: '账务结算ID',
      dataIndex: 'id'
    },
    {
      title: '账务对象类型',
      dataIndex: 'subjectTypeDesc'
    },
    {
      title: '账务对象ID',
      dataIndex: 'subjectId'
    },
    {
      title: '账务对象名称',
      dataIndex: 'subjectName'
    },
    {
      title: '账务金额',
      dataIndex: 'amount'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '审核完成时间',
      dataIndex: 'auditFinishTime'
    }
  ]
  public componentDidMount () {
    api.getDetail(this.props.id).then((res) => {
      // res.evidenceImgUrlList = res?.evidenceImgUrlList?.map(() =>)
      this.form.setValues(res)
    })
  }
  public render () {
    const single = false
    return (
      <>
        <div style={{ width: 600, margin: '0 auto' }}>
          {single && (
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
              <FormItem name='文件凭证' label='文件凭证' />
              <FormItem
                name='evidenceImgUrlList'
                label='图片凭证'
                inner={(form) => {
                  return form.getFieldDecorator('evidenceImgUrlList')(
                    <Upload
                      fileType='picture-card'
                      disabled
                    />
                  )
                }}
              />
              <FormItem name='settlementTypeDesc' label='单据类型' />
              <FormItem name='createTime' type='date' label='创建时间' />
              <FormItem name='auditFinishTime' type='date' label='审核完成时间' />
              <div className='text-center mt20'>
                <Button
                  type='primary'
                  onClick={this.props?.goNext}
                >
                  确认无误，下一步
                </Button>
              </div>
            </Form>
          )}
        </div>
        {!single && (
          <Table
            columns={this.columns}
            dataSource={[]}
          />
        )}
      </>
    )
  }
}
export default Main
