import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Row, Col, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '结算流水号',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '交易编号',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '交易类型',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  }, {
    dataIndex: 'anchorId',
    title: '创建时间',
    width: 120,
    align: 'center'
  }, {

    dataIndex: 'anchorLevel',
    title: '交易总额',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '本次结算金额',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '结算比例',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '结算状态',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '结算时间',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public deleteAnchor (record: Anchor.ItemProps) {
    api.deleteAnchor(record.anchorId).then(() => {
      this.listpage.refresh()
    })
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 20 }}>账单明细</div>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ float: 'left' }}>日期：20191209</div>
          <div style={{ float: 'right' }}>共计：25条</div>
          <div style={{ clear: 'both' }} />
          <div style={{ marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #999' }}>
            <div style={{}}>供应ID：19</div>
            <div style={{}}>供应名称：杭州喜团科技有限公司</div>
            <div style={{}}>供应类型：喜团优选</div>
          </div>
          <Row style={{ border: '1px solid #999', textAlign: 'center', marginTop: 8 }}>
            <Col span={6}>
              <div>收入金额（元）</div>
              <div>100</div>
            </Col>
            <Col span={6}>
              <div>收入笔数</div>
              <div>100</div>
            </Col>
            <Col span={6}>
              <div>支出金额（元）</div>
              <div>100</div>
            </Col>
            <Col span={6}>
              <div>支出笔数</div>
              <div>100</div>
            </Col>
          </Row>
        </div>

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
                导出账单明细
              </Button>
            </div>
          )}
          formConfig={false}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
