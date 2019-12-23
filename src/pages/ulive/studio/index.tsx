import React from 'react'
import Image from '@/components/Image'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
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
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<UliveStudio.ItemProps>[] = [
    {
      title: '场次id',
      dataIndex: 'planId'
    },
    {
      title: '直播场次标题',
      dataIndex: 'liveTitle'
    },
    {
      title: '主播',
      dataIndex: 'anchorNickName'
    },
    {
      title: '计划开播',
      dataIndex: 'liveAnticipatedStartTime',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    },
    {
      title: '直播时间',
      dataIndex: 'liveStartTime',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    },
    {
      title: '直播间',
      width: 200,
      align: 'center',
      render: () => {
        return (
          <div>
            <img
              onClick={this.showQrcode}
              width={30}
              height={30}
              src="https://axure-file.lanhuapp.com/6c74a568-2a43-4303-b380-de2eec294975__9abb445b2c0c5bfdd5970c937d437273.svg" alt=""
            >
            </img>
            <Divider type="vertical" />
            <span onClick={() => this.showVideo()} className='href'>查看</span>
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'liveStatus',
      render: (text) => {
        return LiveStatusEnum[text]
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        return TypeEnum[text]
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 350,
      render: (text, record) => {
        const canStopPlay = [70, 90].indexOf(record.liveStatus) > -1
        const canUp = [70, 90].indexOf(record.liveStatus) > -1
        const canDown = [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
        return (
          <div>
            <span onClick={this.showView.bind(this, record.planId)} className='href'>详情</span>&nbsp;&nbsp;
            <span onClick={(canUp || canDown) ? this.changeStatus.bind(this, record) : undefined} className={(canUp || canDown) ? 'href' : ''}>{record.status === 0 ? '上架' : '下架'}</span>&nbsp;&nbsp;
            <span onClick={canStopPlay ? this.closeDown.bind(this, record) : undefined} className={canStopPlay ? 'href' : ''}>停播</span>&nbsp;&nbsp;
            <span onClick={this.setTop.bind(this, record)} className='href'>{record.liveTop === 0 ? '置顶' : '取消置顶'}</span>&nbsp;&nbsp;
            <span onClick={this.uploadCover.bind(this, record)} className='href'>上传封面</span>&nbsp;&nbsp;
          </div>
        )
      }
    }
  ]
  public componentDidMount () {
    this.showVideo()
  }
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
  public showQrcode = () => {
    const hide = this.props.alert({
      width: 400,
      content: (
        <div className='text-center'>
          <QRCode
            value='http://www.baidu.com'
            // // detail={item}
            // hide={() => {
            //   hide()
            // }}
          />
        </div>
      ),
      footer: null
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
  public show (type: 1 | 2 | 3, item?: Anchor.ItemProps) {
  }
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
  public showVideo () {
    const hide = this.props.alert({
      content: (
        <Video
          // detail={item}
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
          rangeMap={{
            liveTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='liveTitle' />
              <FormItem name='nickName' />
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
