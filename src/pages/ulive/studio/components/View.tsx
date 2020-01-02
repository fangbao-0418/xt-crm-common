import React from 'react'
import { Row, Col, Button, Input, Tag } from 'antd'
import classNames from 'classnames'
import { If } from '@/packages/common/components'
import styles from './style.module.styl'
import * as api from '../api'
import { TypeEnum, LiveStatusEnum } from '../config'
import Image from '@/components/Image'
const TextArea = Input.TextArea

interface Props {
  id: number
  hide?: (refresh?: boolean) => void
}

/** -1-未知,1-待审核,2-直播中/直播完 ,3-未过审/停播  */
type ViewType = -1 | 1 | 2 | 3

interface State {
  statistics: {label: string, value: any}[]
  type: ViewType
  detail: Partial<UliveStudio.ItemProps>
}

class Main extends React.Component<Props, State> {
  public state: State = {
    statistics: [
      {
        label: '直播人气',
        value: 0
      },
      {
        label: '直播时长',
        value: 0
      },
      {
        label: '实付订单',
        value: 0
      },
      {
        label: '实付金额',
        value: 0
      },
      {
        label: '访问UV',
        value: 0
      },
      {
        label: '点赞UV',
        value: 0
      }
    ],
    type: -1,
    detail: {
      liveTitle: '',
      liveAnticipatedStartTime: 0,
      type: 0
    }
  }
  public auditReason = ''
  // public constructor (props: Props) {
  //   super(props)
  //   this.hide = this.hide.bind(this)
  // }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    const id = this.props.id
    api.fetchPlanInfo(id).then((res) => {
      if (!res) {
        return
      }
      const liveData = res.liveData
      let type: ViewType = -1
      /** 待审核 */
      if (res.liveStatus === 10) {
        type = 1
      /** 直播中/直播完 */
      } else if ([60, 90].indexOf(res.liveStatus) > -1) {
        type = 2
      /** 未过审/停播 */
      } else if ([20, 50].indexOf(res.liveStatus) > -1) {
        type = 3
      }
      const statistics = liveData ? [
        {
          label: '直播人气',
          value: liveData.callOnPv
        },
        {
          label: '直播时长',
          value: liveData.totalTime
        },
        {
          label: '实付订单',
          value: liveData.orderActualPayTotal
        },
        {
          label: '实付金额',
          value: liveData.orderTotalPayMoney
        },
        {
          label: '访问UV',
          value: liveData.callOnUv
        },
        {
          label: '点赞UV',
          value: liveData.giveThumbsUpUv
        }
      ] : this.state.statistics
      this.setState({
        type,
        statistics,
        detail: res
      })
    })
  }
  public hide = (e: any, refresh: boolean = false) => {
    if (this.props.hide) {
      this.props.hide(refresh)
    }
  }
  public audit (status: 0 | 1) {
    const id = this.props.id
    api.audit({
      auditReason: this.auditReason,
      planId: id,
      auditStatus: status
    }).then(() => {
      this.hide(null, true)
    })
  }
  public render () {
    const { detail, statistics, type } = this.state
    console.log(type, 'type')
    return (
      <div className={styles.view}>
        <div className={classNames(styles['base-info'], 'mb20')}>
          <div className={styles.cover}>
            <Image
              src={detail.liveCoverUrl}
              width={190}
              height={190}
            />
          </div>
          <div className={styles['base-info-right']}>
            <div>
              <Row>
                <Col span={24}>标题：{detail.liveTitle}</Col>
              </Row>
              <Row>
                <Col span={12}>场次ID：{detail.planId}</Col>
                {/* <Col span={12}>房间号：</Col> */}
              </Row>
              <Row>
                <Col span={24}>计划开播：{APP.fn.formatDate(detail.liveAnticipatedStartTime) || ''}</Col>
              </Row>
              <Row>
                <Col span={24}>直播时间：{[(APP.fn.formatDate(detail.liveStartTime) || '--'), (APP.fn.formatDate(detail.liveEndTime) || '--')].join(' 至 ')}</Col>
                {/* <Col span={24}>结束时间：{APP.fn.formatDate(detail.liveAnticipatedStartTime)}</Col> */}
              </Row>
              <Row>
                <Col span={12}>直播状态：{LiveStatusEnum[detail.liveStatus || 0]}</Col>
                <Col span={12}>类型：{TypeEnum[(detail.type || 0)]}</Col>
              </Row>
              <Row>
                <Col span={24}>主播昵称：{detail.anchorNickName}</Col>
              </Row>
              <Row>
                <Col span={24}>主播手机号：{detail.anchorPhone}</Col>
              </Row>
              {/* <div>
                <Tag color='#108ee9'>待开播</Tag>
              </div> */}
            </div>
          </div>
        </div>

        <If condition={type === 1}>
          <div>
            请填写审核原因（审核不通过时为必填）
          </div>
          <div className='mt10'>
            <TextArea
              onChange={(e) => {
                this.auditReason = e.target.value
              }}
              placeholder='请输入...'
            />
          </div>
          <div className='text-center mt20'>
            <Button className='mr10' type='primary' onClick={this.audit.bind(this, 1)}>审核通过</Button>
            <Button className='mr10' type='danger' onClick={this.audit.bind(this, 0)}>审核不通过</Button>
            <Button onClick={this.hide}>关闭</Button>
          </div>
        </If>
        <If condition={type === 2}>
          <div className={classNames(styles.statistics)}>
            {
              statistics.map((item, index) => {
                return (
                  <div key={index} className={styles['statistics-item']}>
                    <div className={styles['statistics-item-result']}>{item.value}</div>
                    <div className={styles['statistics-item-label']}>{item.label}</div>
                  </div>
                )
              })
            }
          </div>
          <div className='mt10'>
            注：数据统计或有1小时的延迟
          </div>
          <div className='text-center mt20'>
            <Button onClick={this.hide}>关闭</Button>
          </div>
        </If>
        <If condition={type === 3}>
          <div>
            审核原因：
          </div>
          <div>
            {detail.auditReason || '无审核原因'}
          </div>
          <div className='mt10'>
            停播原因：
          </div>
          <div>
            {detail.stopReson || ''}
          </div>
          <div className='text-center mt20'>
            <Button onClick={this.hide}>关闭</Button>
          </div>
        </If>
      </div>
    )
  }
}
export default Main
