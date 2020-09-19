import { isMoment } from 'moment'
import React from 'react'
import { Modal } from 'antd'
import ListPage from '@/packages/common/components/list-page'
import { getPromotionMagicList } from '@/pages/shop/activity/api'
import { ColumnProps } from 'antd/lib/table'
import { promotionStatusEnum } from '@/pages/shop/activity/config'
import { FieldsConfig } from '@/packages/common/components/form/config'
import _ from 'lodash'
interface State {
  visible: boolean
  selectedRowKeys: any[]
}
export interface ActicityModalProps {
  open(): void
}

const formConfig: FieldsConfig = {
  common: {
    title: {
      label: '活动名称'
    },
    promotionId: {
      label: '活动ID'
    },
    status: {
      label: '活动状态',
      type: 'select',
      options: [{
        label: '全部',
        value: 0
      }, {
        label: '已发布',
        value: 2
      }, {
        label: '报名中',
        value: 3
      }, {
        label: '未开始',
        value: 8
      }, {
        label: '预热中',
        value: 4
      }, {
        label: '进行中',
        value: 5
      }]
    },
    effectiveTime: {
      label: '有效时间',
      type: 'rangepicker'
    }
  }
}

interface Props {
  onOk(selectedRow: any[]): void
  selectedRowKeys: any[]
}

class Main extends React.Component<Props, State> {
  public state = {
    visible: false,
    selectedRowKeys: []
  }
  public selectedRows: any[]
  public componentWillReceiveProps (nextProps: any) {
    if (this.props.selectedRowKeys !== nextProps.selectedRowKeys) {
      this.setState({ selectedRowKeys: nextProps.selectedRowKeys })
    }
  }
  public columns: ColumnProps<any>[] = [{
    title: '活动ID',
    dataIndex: 'promotionId'
  }, {
    title: '活动名称',
    dataIndex: 'title'
  }, {
    title: '开始时间',
    dataIndex: 'startTime',
    render: (text) => APP.fn.formatDate(text)

  }, {
    title: '结束时间',
    dataIndex: 'endTime',
    render: (text) => APP.fn.formatDate(text)
  }, {
    title: '活动类型',
    dataIndex: 'type',
    render: (text) => {
      const statusMap: Record<string, string> = {
        '60': '品牌会场'
      }
      return statusMap[text]
    }
  }, {
    title: '活动状态',
    dataIndex: 'status',
    render: (text) => {
      return promotionStatusEnum[text]
    }
  }]
  public onChange = (selectedRowKeys: any[], selectedRows: any[]) => {
    this.selectedRows = _.unionBy(this.selectedRows, selectedRows, x => x.promotionId).filter((x: any) => selectedRowKeys.includes(x.promotionId))
    this.setState({ selectedRowKeys })
  }
  public open = () => {
    this.setState({ visible: true })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public onOk = () => {
    this.props.onOk(this.selectedRows);
    this.onCancel()
  }
  public render () {
    const { visible, selectedRowKeys } = this.state
    return (
      <Modal
        title='选择活动'
        visible={visible}
        width={1000}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <ListPage
          formConfig={formConfig}
          processPayload={(payload) => {
            // 全部状态0
            payload.status = '0'
            return payload
          }}
          rangeMap={{
            effectiveTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          tableProps={{
            rowKey: 'promotionId',
            rowSelection: {
              selectedRowKeys,
              onChange: this.onChange
            }
          }}
          columns={this.columns}
          api={getPromotionMagicList}
        />
      </Modal>
    )
  }
}

export default Main