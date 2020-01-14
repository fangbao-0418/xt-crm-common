import React from 'react'
import Image from '@/components/Image'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { param } from '@/packages/common/utils'
import { Tag, Divider, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, TypeEnum, LiveStatusEnum } from './config'
import Video from './components/Video'
var QRCode = require('qrcode.react');
import View from './components/View'
import CloseDown from './components/CloseDown'
import UploadCover from './components/UploadCover'
import styles from './style.module.styl'
import * as api from './api'
import detail from '@/pages/message/template/detail'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<UliveStudio.ItemProps>[] = [
    {
      title: '场次id',
      dataIndex: 'planId',
      align: 'center',
      width: 100,
      fixed: 'left'
    },
    {
      title: '直播场次标题',
      dataIndex: 'liveTitle',
      width: 200
    },
    {
      title: '主播',
      dataIndex: 'anchorNickName',
      width: 100,
      render: (text, record) => {
        return text || record.anchorPhone
      }
    },
    {
      title: '计划开播',
      dataIndex: 'liveAnticipatedStartTime',
      width: 200,
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    },
    {
      title: '直播时间',
      dataIndex: 'liveStartTime',
      width: 200,
      render: (text, record) => {
        return (
          <>
            <div>{APP.fn.formatDate(text) || ''}</div>
            <div>{APP.fn.formatDate(record.liveEndTime) || ''}</div>
          </>
        )
      }
    },
    {
      title: '直播间',
      width: 200,
      align: 'center',
      dataIndex: 'playUrl',
      render: (text, record) => {
        return (
          <div>
            <img
              onClick={this.showQrcode.bind(this, record)}
              width={30}
              height={30}
              src={require('@/assets/images/qrcode.svg')}
            >
            </img>
            {record.playUrl && record.liveStatus === 90 && (
              <>
                <Divider type="vertical" />
                <span onClick={() => this.showVideo(record)} className='href'>查看</span>
              </>
            )}
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'liveStatus',
      width: 150,
      render: (text) => {
        return LiveStatusEnum[text]
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (text) => {
        return TypeEnum[text]
      }
    },
    {
      title: '举报数',
      dataIndex: 'complainNum',
      width: 80,
      align: 'center',
      render: (text, record) => {
        return text ? (
          <span onClick={() => { APP.history.push(`/ulive/inform/${record.planId}`) }} className='href'>
            {text}
          </span>
        ) : null
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 300,
      fixed: 'right',
      render: (text, record) => {
        const canStopPlay = [70, 90].indexOf(record.liveStatus) > -1
        const canUp = [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
        const canDown = [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
        const canSetTop = record.status === 1 && [70,90].indexOf(record.liveStatus) > -1 && record.type === 0
        return (
          <div>
            <span onClick={this.showView.bind(this, record.planId)} className='href'>详情</span>&nbsp;&nbsp;
            <span onClick={(canUp || canDown) ? this.changeStatus.bind(this, record) : undefined} className={(canUp || canDown) ? 'href' : ''}>{record.status === 0 ? '上架' : '下架'}</span>&nbsp;&nbsp;
            <span onClick={canStopPlay ? this.closeDown.bind(this, record) : undefined} className={canStopPlay ? 'href' : ''}>停播</span>&nbsp;&nbsp;
            <span onClick={canSetTop ? this.setTop.bind(this, record) : undefined} className={canSetTop ? 'href' : ''}>{record.liveTop === 0 ? '置顶' : '取消置顶'}</span>&nbsp;&nbsp;
            {record.anchorType === 10 && (<span onClick={this.uploadCover.bind(this, record)} className='href'>上传封面</span>)}
          </div>
        )
      }
    }
  ]
  public changeStatus (record: UliveStudio.ItemProps) {
    const hide = this.props.alert({
      content: (
        <div className='text-center'>
          确定是否{record.status === 0 ? '上架' : '下架'}
        </div>
      ),
      onOk: () => {
        api.changeStatus({
          planId: record.planId,
          status: record.status === 0 ? 1 : 0
        }).then(() => {
          hide()
          this.refresh()
        })
      }
    })
  }
  public setTop (record: UliveStudio.ItemProps) {
    const hide = this.props.alert({
      content: (
        <div className='text-center'>
          确定是否{record.liveTop === 0 ? '置顶' : '取消置顶'}
        </div>
      ),
      onOk: () => {
        api.setTop({
          planId: record.planId,
          isTop: record.liveTop === 0 ? 1 : 0
        }).then(() => {
          hide()
          this.refresh()
        })
      }
    })
  }
  public showQrcode = (record: UliveStudio.ItemProps) => {
    // module_live/pages/room/index
    api.getWxQrcode({
      page: 'module_live/pages/room/index',
      scene: `id=${record.planId}`,
      // page: 'pages/product/product',
      // scene: 'pid=782&index=2'
    }).then((res) => {
      console.log(res, '-------------')
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
  public showMessage = (message: string) => {
    const hide = this.props.alert({
      width: 400,
      content: (
        <div className='text-center'>{message}</div>
      ),
      footer: null
    })
  }
  public refresh () {
    this.listpage.refresh()
  }
  // public show (type: 1 | 2 | 3, item?: Anchor.ItemProps) {
  // }
  public uploadCover (record: UliveStudio.ItemProps) {
    const hide = this.props.alert({
      width: 400,
      content: (
        <UploadCover
          detail={record}
          onOk={(url) => {
            api.changeCover({
              planId: record.planId,
              bannerUrl: url
            }).then(() => {
              hide()
              this.refresh()
            })
          }}
        />
      ),
      footer: null
    })
  }
  public showVideo (record: UliveStudio.ItemProps) {
    const hide = this.props.alert({
      content: (
        <Video
          detail={record}
          hide={() => {
            hide()
          }}
        />
      ),
      footer: null
    })
  }
  /** 禁播 */
  public closeDown (record: UliveStudio.ItemProps) {
    const hide = this.props.alert({
      width: 400,
      content: (
        <CloseDown
          detail={record}
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
  public showView (id: number) {
    const hide = this.props.alert({
      width: 800,
      content: (
        <View
          // detail={item}
          id={id}
          hide={(refresh) => {
            hide()
            if (refresh) {
              this.refresh()
            }
          }}
        />
      ),
      footer: null
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
            rowKey: 'planId',
            scroll: {
              x: 1630
            }
          }}
          rangeMap={{
            liveTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='liveTitle' />
              <FormItem name='anchorNickName' />
              <FormItem name='liveStatus' />
              <FormItem name='liveTime' />
            </>
          )}
          api={api.getStudioList}
        />
      </div>
    )
  }
}
export default Alert(Main)
