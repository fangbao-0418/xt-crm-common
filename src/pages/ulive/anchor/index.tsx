import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import AnchorOperate from './components/AnchorOperate'
import Video from './components/Video'
import styles from './style.module.styl'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '主播昵称',
    dataIndex: 'nickName',
    width: 200,
    render: (text, record) => {
      return (
        <div className={styles['anchor-column-nickname']}>
          <div className={styles['anchor-column-nickname-icon']}>
            <Image onClick={() => { APP.history.push(`/user/detail?memberId=${record.memberId}`) }} src={record.headUrl} width={50} height={50} />
          </div>
          <div className={styles['anchor-column-nickname-info']}>
            <div>
              <span
                className={classNames(styles['anchor-column-nickname-info-name'], 'href')}
                onClick={() => {
                  APP.href(`/user/detail?memberId=${record.memberId}`, '__target') }
                }
              >
                {record.nickName || record.phone || '暂无'}
              </span>
              <Tag style={{margin: '0 5px'}} hidden={record.status !== 1} color='#666'>黑名单</Tag>
            </div>
            <div>
              <span>ID : {record.memberId}</span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    title: '粉丝数',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  },
  {
    dataIndex: 'anchorIdentityType',
    title: '主播身份',
    width: 150,
    render: (text) => {
      return AnchorIdentityTypeEnum[text]
    }
  },
  {
    dataIndex: 'anchorId',
    title: '主播个人页',
    width: 120,
    align: 'center',
    render: (text, record) => {
      return (
        <img
          onClick={this.showQrcode.bind(this, record)}
          width={30}
          height={30}
          src={require('@/assets/images/qrcode.svg')}
        >
        </img>
      )
    }
  },
  {
    dataIndex: 'anchorLevel',
    title: '主播等级',
    width: 100,
    render: (text) => {
      return AnchorLevelEnum[text]
    }
  },
  {
    dataIndex: 'phone1',
    title: '业务范围',
    width: 150,
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
          <span onClick={this.operateAnchor.bind(this, 2, record)} className='href'>编辑</span>&nbsp;&nbsp;
          <span onClick={this.operateAnchor.bind(this, 3, record)} className='href'>{record.status === 0 ? '拉黑' : '取消拉黑'}</span>&nbsp;&nbsp;
          <Popconfirm
            title='确定删除该主播吗'
            onConfirm={this.deleteAnchor.bind(this, record)}
          >
            <span className='href'>删除</span>
          </Popconfirm>
        </div>
      )
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
  public operateAnchor (type: 1 | 2 | 3, item?: Anchor.ItemProps) {
    const hide = this.props.alert({
      content: (
        <AnchorOperate
          type={type}
          detail={item}
          hide={() => {
            hide()
          }}
          refresh={() => {
            this.refresh()
          }}
        />
      ),
      footer: null
    })
  }
  public showQrcode = (record: Anchor.ItemProps) => {
    api.getWxQrcode({
      page: 'module_live/pages/personal/index',
      scene: `id=${record.memberId}`
    }).then((res) => {
      if (!res) {
        return
      }
      const hide = this.props.alert({
        width: 400,
        content: (
          <div className='text-center'>
            <img src={res} />
          </div>
        ),
        footer: null
      })
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
                  this.operateAnchor(1)
                }}
              >
                添加主播
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='memberId' label='主播ID'/>
              <FormItem name='nickName' />
              <FormItem name='anchorIdentityType' />
              <FormItem name='anchorLevel' />
              <FormItem name='status' />
              <FormItem name='phone' />
              <FormItem name='phone1' />
            </>
          )}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
