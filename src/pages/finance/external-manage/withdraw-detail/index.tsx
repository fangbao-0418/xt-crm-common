/**
 * 提现账户明细
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tabs, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
const { TabPane } = Tabs
interface Props extends AlertComponentProps {
}
const tabConfigs: { key: string, title: string }[] = [
  { key: '0', title: '全部' },
  { key: '1', title: '待提现' },
  { key: '2', title: '提现中' },
  { key: '3', title: '提现成功' },
  { key: '4', title: '提现失败' }
]
class Main extends React.Component<Props> {
  state = {
    status: '0',
    errorUrl: ''
  }
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '申请单编号',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '提现流水号',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '金额',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  }, {
    dataIndex: 'anchorId',
    title: '供应商ID',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'anchorId',
    title: '供应商名称',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'anchorLevel',
    title: '供应商类型',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '提现方式',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '提现账户',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '身份信息',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '状态',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '申请时间',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '完成时间',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '备注',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }]

  public refresh () {
    this.listpage.refresh()
  }

  // 切换tabPane
  public handleChange = (key: string) => {
    this.setState({
      status: key
    })
  }

  public render () {
    const { status }=this.state
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <Tabs
          activeKey={status}
          onChange={this.handleChange}
          style={{ marginLeft: 20 }}
        >
          {
            tabConfigs.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key} />
              )
            })
          }
        </Tabs>
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
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='memberId' />
              <FormItem name='nickName' />
              <FormItem name='anchorIdentityType' />
              <FormItem name='anchorLevel' />
              <FormItem name='status2' />
              <FormItem name='status3' />
            </>
          )}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
