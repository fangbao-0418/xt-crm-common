import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import * as api from '../api'

const getFieldsConfig = function () {
  return {
    common: {
      discountId: {
        type: 'input',
        label: '优惠卷编号'
      },
      discountName: {
        type: 'input',
        label: '优惠卷名称'
      },
      discountStatus: {
        type: 'select',
        label: '状态',
        options: [
          {
            label: '进行中',
            value: 1
          }
        ]
      }
    }
  }
}

interface Props {
  onChange?: (selectedRowKeys: any[]) => void
  selectedRowKeys?: any[]
}

class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public state = {
    selectedRowKeys: this.props.selectedRowKeys || []
  }
  public columns = [
    {
      title: '编号',
      dataIndex: 'a'
    },
    {
      title: '名称',
      dataIndex: 'b'
    },
    {
      title: '领取时间',
      dataIndex: 'c'
    },
    {
      title: '优惠券价值',
      dataIndex: 'd'
    },
    {
      title: '已领取/总量',
      dataIndex: 'e'
    },
    {
      title: '已使用/使用率',
      dataIndex: 'f'
    },
    {
      title: '领取状态',
      dataIndex: 'g'
    }
  ]
  public handleSelectChange = (selectedRowKeys: any) => {
    console.log(selectedRowKeys, 'selectedRowKeys')
    this.setState({
      selectedRowKeys
    }, () => {
      const { onChange } = this.props
      onChange && (
        onChange(selectedRowKeys)
      )
    })
  }
  render () {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange
    }

    return (
      <div style={{ margin: '-20px' }}>
        <ListPage
          getInstance={(ref) => {
            this.listpage = ref
          }}
          formConfig={getFieldsConfig()}
          columns={this.columns}
          tableProps={{
            rowKey: 'planId',
            rowSelection
          }}
          formItemLayout={(
            <>
              <FormItem name='discountId' />
              <FormItem name='discountName' />
              <FormItem name='discountStatus' />
            </>
          )}
          api={api.getStudioList}
        />
      </div>
    )
  }
}

export default Main