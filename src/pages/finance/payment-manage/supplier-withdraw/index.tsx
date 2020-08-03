/**
 * 供应商提现管理
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Form, Tabs, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
import TextArea from 'antd/lib/input/TextArea'
import UploadView from '@/components/upload'
import { exportFile } from '@/util/fetch'
const { TabPane } = Tabs
interface Props extends AlertComponentProps {
}
const tabConfigs: { key: string, title: string }[] = [
  { key: '0', title: '全部' },
  { key: '1', title: '待提现' },
  { key: '2', title: '提现成功' },
  { key: '3', title: '提现失败' }
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
    title: '金额',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '供应商ID',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
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
    title: '状态',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '交易总额',
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
    title: '操作人',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '操作时间',
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
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <Popconfirm
            title='确认提现成功？'
            onConfirm={this.deleteAnchor.bind(this, record)}
          >
            <span className='href'>提现成功</span>
          </Popconfirm>
          <span onClick={this.withdrawalFailure.bind(this, record)} className={'href'}>
             提现失败
          </span>
        </div>
      )
    }
  }]
  public withdrawalFailure (record: any) {
    if (this.props.alert) {
      let reason = ''
      const hide = this.props.alert({
        title: '提示',
        content: (
          <div>
            <TextArea
              placeholder='请输入失败原因'
              onChange={(e: { target: { value: string } }) => {
                reason = e.target.value
              }}
            />
          </div>
        ),
        onOk: () => {
          api.deleteAnchor(
            record.anchorId
          ).then(() => {
            hide()
            this.listpage.refresh()
          })
        }
      })
    }
  }
  public refresh () {
    this.listpage.refresh()
  }
  public deleteAnchor (record: Anchor.ItemProps) {
    api.deleteAnchor(record.anchorId).then(() => {
      this.listpage.refresh()
    })
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
              <span
                className='href ml10'
                style={{ float: 'right' }}
                onClick={() => {
                }}
              >
                下载批量失败模版
              </span>
              <span
                className='href'
                style={{ float: 'right' }}
                onClick={() => {
                }}
              >
                下载批量支付模版
              </span>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='memberId' />
              <FormItem name='nickName' />
              <FormItem name='anchorIdentityType' />
              <FormItem name='anchorLevel' />
              <FormItem name='status' />
              <FormItem name='status1' />
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
