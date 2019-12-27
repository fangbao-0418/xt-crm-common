import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import List from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { parseQuery } from '@/util/utils'
import { Button, Popover } from 'antd'
import { getDefaultConfig, StatusEnum, TypeEnum, AwardTypeEnum } from './config'
import { ColumnProps, TableRowSelection } from 'antd/es/table'
import ReissueModal from './components/ReissueModal'
import * as api from './api'
interface Props extends AlertComponentProps {}
interface State {
  selectedRowKeys: any[]
}
class Main extends React.Component<Props, State> {
  public listpage: any
  public form: FormInstance
  public state: State = {
    selectedRowKeys: []
  }
  public componentDidMount () {
    const query: any = parseQuery()
    if (query.roundTitle) {
      this.listpage.form.setValues({
        roundTitle: query.roundTitle
      })
    }
  }
  public columns: ColumnProps<any>[] = [{
    title: '中奖号码',
    dataIndex: 'id',
    width: 220
  }, {
    title: '活动名称',
    dataIndex: 'title',
    width: 200
  }, {
    title: '场次名称',
    dataIndex: 'roundTitle',
    width: 200
  }, {
    title: '活动类型',
    dataIndex: 'type',
    width: 150,
    render: (text) => {
      return TypeEnum[text]
    }
  }, {
    title: '主订单号',
    width: 220,
    dataIndex: 'orderCode'
  }, {
    title: '手机号',
    dataIndex: 'phone',
    width: 150,
  }, {
    title: '支付时间',
    dataIndex: 'orderPayDate',
    width: 200,
    render: (text) => {
      return APP.fn.formatDate(text) || ''
    }
  }, {
    title: '抽奖时间',
    dataIndex: 'modifyTime',
    width: 200,
    render: (text) => {
      return APP.fn.formatDate(text) || ''
    }
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    render: (text) => {
      return StatusEnum[text]
    }
  }, {
    title: '奖品名称',
    dataIndex: 'awardTitle'
  }, {
    title: '奖品类型',
    dataIndex: 'awardType',
    width: 100,
    align: 'center',
    render: (text) => {
      return AwardTypeEnum[text]
    }
  }, {
    title: '操作',
    width: 130,
    fixed: 'right',
    align: 'center',
    render: (text, record) => {
      return (
        <>
          {[0, 1].includes(record.status) && (
            <span
              onClick={this.loseEfficacy.bind(this, record.id)}
              className='href'>
              失效
            </span>
          )}
          {record.status === 2 && (
            <Popover content={record.invalidReason}>
              <span className='href'>查看失效原因</span>
            </Popover>
          )} 
        </>
      )
    }
  }]
  public loseEfficacy (id: any) {
    const { selectedRowKeys } = this.state
    const length = selectedRowKeys.length
    if (id === undefined && length === 0) {
      APP.error('请选择')
      return
    }
    this.props.alert({
      title: '失效',
      content: (
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          {id === undefined && <div className='mb20'>共选中<span style={{color: 'red'}}>{length}</span>条中奖记录</div>}
          <FormItem
            label='失效原因'
            name='invalidReason'
            type='textarea'
          >
          </FormItem>
        </Form>
      ),
      onOk: (hide) => {
        const ids = id === undefined ? selectedRowKeys : [id]
        const { invalidReason } = this.form.getValues()
        api.loseEfficacy({
          ids,
          invalidReason
        }).then((res) => {
          if (res) {
            APP.success('失效成功')
            hide()
            this.form.props.form.resetFields()
            this.refresh()
          }
        })
      }
    })
  }
  public onSelectChange = (selectedRowKeys: any) => {
    this.setState({
      selectedRowKeys
    })
  }
  public refresh () {
    this.listpage.refresh()
  }
  public render () {
    const { selectedRowKeys } = this.state;
    const rowSelection: TableRowSelection<any> = {
      fixed: true,
      columnWidth: 50,
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => {
        return {
          disabled: [2, 3].includes(record.status)
        }
      }
    };
    return (
      <List
        getInstance={(ref) => {
          this.listpage = ref
        }}
        formConfig={getDefaultConfig()}
        tableProps={{
          scroll: {
            x: true
          },
          rowKey: 'id',
          rowSelection
        }}
        addonAfterSearch={(
          <div>
            <ReissueModal><Button type='danger'>补发</Button></ReissueModal>
            {/* <Button type='danger'>补发</Button> */}
            <Button onClick={this.loseEfficacy.bind(this, undefined)} className='ml10'>失效</Button>
          </div>
        )}
        columns={this.columns}
        processPayload={(payload: any) => {
          const query = parseQuery()
          payload = Object.assign({}, payload, query)
          return payload
        }}
        processData={(result: any) => {
          this.setState({
            selectedRowKeys: []
          })
          return result
        }}
        api={api.fetchList}
      />
    )
  }
}

export default Alert(Main)