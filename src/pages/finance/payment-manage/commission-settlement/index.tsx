/**
 * 佣金结算流水
 */
import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Select, Button, Radio } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import UploadView from '@/components/upload'
import { exportFile } from '@/util/fetch'
import If from '@/packages/common/components/if'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}

class Main extends React.Component<Props> {
  state = {
    errorUrl: null
  }
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '结算流水号',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '分账流水号',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '交易编号',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  }, {
    dataIndex: 'anchorId',
    title: '交易类型',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'anchorLevel',
    title: '会员ID',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '会员名称',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '联系方式',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  }, {
    dataIndex: 'anchorLevel',
    title: '创建时间',
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
    title: '应结算金额',
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
    title: '完成时间',
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
          <span className='href'>终止结算</span>
        </div>
      )
    }
  }]
  public refresh () {
    this.listpage.refresh()
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
              >
                批量导出
              </Button>
              <Button
                type='primary'
              >
                终止结算
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='memberId' />
              <FormItem name='nickName' />
              <FormItem name='anchorLevel' />
              <FormItem name='status' />
              <FormItem name='status1' />
              <FormItem name='status2' />
            </>
          )}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
