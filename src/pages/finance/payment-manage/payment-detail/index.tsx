/**
 * 货款结算明细
 */
import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '结算流水号',
    dataIndex: 'id',
    width: 300
  }, {
    title: '分账流水',
    dataIndex: 'splitFlowNo',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'tradeNo',
    title: '交易编号',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  }, {
    dataIndex: 'tradeTypeDesc',
    title: '交易类型',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'storeId',
    title: '供应商ID',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'storeName',
    title: '供应商名称',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'storeType',
    title: '供应商类型',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'amount',
    title: '本次结算金额',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'profitRatio',
    title: '结算比例',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'settlementStatusDesc',
    title: '结算状态',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'settlementTime',
    title: '结算时间',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <Popconfirm
            title='确定终止结算吗'
            onConfirm={this.terminated.bind(this, record)}
          >
            <span className='href'>终止结算</span>
          </Popconfirm>
        </div>
      )
    }
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public terminated (record: Anchor.ItemProps) {
    api.terminated(record.anchorId).then(() => {
      this.listpage.refresh()
    })
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'anchorId'
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
                }}
              >
                批量导出
              </Button>
              <Button
                type='primary'
                className='ml8'
                onClick={() => {
                }}
              >
                终止结算
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='tradeNo' />
              <FormItem name='tradeType' />
              <FormItem name='settlementStatus' />
              <FormItem name='storeId' />
              <FormItem name='storeName' />
              <FormItem name='storeType' />
              <FormItem name='time' />
            </>
          )}
          api={api.getList}
        />
      </div>
    )
  }
}
export default Alert(Main)
