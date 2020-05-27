import React from 'react'
import Image from '@/components/Image'
import Form, { FormInstance } from '@/packages/common/components/form'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import SelectFetch from '@/packages/common/components/select-fetch'
import If from '@/packages/common/components/if'
import { param } from '@/packages/common/utils'
import { Tag, Divider, Popover, Button, Popconfirm, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, TypeEnum, LiveStatusEnum } from './config'
import View from './components/View'
import CloseDown from './components/CloseDown'
import UploadCover from './components/UploadCover'
import CouponSelector from './components/CouponSelector'
import * as api from './api'
import { fetchTagList } from '../config/api'
import TextArea from 'antd/lib/input/TextArea'

interface Props extends AlertComponentProps {
}

interface State {
  rowKeys: any[]
}

class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public state: State = {
    rowKeys: []
  }
  public columns: ColumnProps<UliveStudio.ItemProps>[] = [
    {
      title: '场次id111',
      dataIndex: 'planId',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (text, record) => {
        return (
          <div>
            {text}
            {record.liveTop === 1 && (
            <>
             <br />
            排序 { record.topSort }
            </>)}
          </div>
        )
      }
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
        return (
          <span
            className='href'
            onClick={() => {
              APP.href(`/user/detail?memberId=${record.memberId}`, '__target')
            }
            }
          >
            {text || record.anchorPhone}
          </span>

        )
      }
    },
    {
      title: '直播封面',
      dataIndex: 'liveCoverUrl',
      width: 120,
      render: (text) => {
        return (
          <Popover
            content={(
              <Image src={text} width={240} height={240} />
            )}
          >
            <Image src={text} width={80} height={80} />
          </Popover>
        )
      }
    },
    // {
    //   title: '计划开播',
    //   dataIndex: 'liveAnticipatedStartTime',
    //   width: 200,
    //   render: (text) => {
    //     return APP.fn.formatDate(text) || ''
    //   }
    // },
    // {
    //   title: '直播时间',
    //   dataIndex: 'liveStartTime',
    //   width: 200,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{APP.fn.formatDate(text) || ''}</div>
    //         <div>{APP.fn.formatDate(record.liveEndTime) || ''}</div>
    //       </>
    //     )
    //   }
    // },
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
                <Divider type='vertical' />
                <span
                  onClick={() => this.showVideo(record)}
                  className='href'
                >
                  查看
                </span>
              </>
            )}
            {record.playbackUrl && [51, 60].indexOf(record.liveStatus) > -1 && (
              <>
                <Divider type='vertical' />
                <span
                  onClick={() => this.showVideo(record)}
                  className='href'
                >
                  查看回放
                </span>
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
          <span
            onClick={() => {
              APP.history.push(`/ulive/inform/${record.planId}`)
            }}
            className='href'
          >
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
        const canSetTop = record.isCarousel === 0 && record.status === 1 && [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
        return (
          <div>
            <span onClick={this.showView.bind(this, record.planId)} className='href'>
              详情
            </span>&nbsp;&nbsp;
            <If condition={[0, 1].indexOf(record.status) > -1}>
              <span onClick={(canUp || canDown) ? this.changeStatus.bind(this, record) : undefined} className={(canUp || canDown) ? 'href' : ''}>
                {record.status === 0 ? '上架' : '下架'}
              </span>&nbsp;&nbsp;
            </If>
            <If condition={record.status === 6}><span> 断网下架</span>&nbsp;&nbsp;</If>
            <If condition={[51, 60].indexOf(record.liveStatus) === -1}>
              <span onClick={canStopPlay ? this.closeDown.bind(this, record) : undefined} className={canStopPlay ? 'href' : ''}>
                停播
              </span>&nbsp;&nbsp;
            </If>
            <If condition={record.liveStatus === 60}>
              <span onClick={this.stopPlayback.bind(this, record)} className={'href'}>
                停播回放
              </span>&nbsp;&nbsp;
            </If>
            {record.anchorType !== 10 && (
              <span onClick={canSetTop ? this.setTop.bind(this, record) : undefined} className={canSetTop ? 'href' : ''}>
                {record.liveTop === 0 ? '置顶' : '取消置顶'}
              </span>
            )}&nbsp;&nbsp;
            {/* {record.anchorType === 10 && (<span onClick={this.uploadCover.bind(this, record)} className='href'>上传封面</span>)} */}
            <span onClick={this.setCoupon.bind(this, record)} className={'href'}>
              优惠券
            </span>
          </div>
        )
      }
    }
  ]
  public setCoupon (record: UliveStudio.ItemProps) {
    // let selectedRowKeys = []
    this.props.alert({
      width: 800,
      content: (
        <CouponSelector />
      ),
      onOk: () => {

      }
    })
  }
  public stopPlayback (record: UliveStudio.ItemProps) {
    if (this.props.alert) {
      let reason = ''
      const hide = this.props.alert({
        title: '停播回放',
        content: (
          <div>
            <TextArea
              placeholder='请输入停播原因'
              onChange={(e) => {
                reason = e.target.value
              }}
            />
          </div>
        ),
        onOk: () => {
          api.stopPlayback({
            planId: record.planId,
            forbidReason: reason
          }).then(() => {
            hide()
            this.listpage.refresh()
          })
        }
      })
    }
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
    if (record.liveTop === 0) {
      let form: FormInstance
      const hide = this.props.alert({
        width: 300,
        content: (
          <Form
            getInstance={(ref) => form = ref}
          >
            <div>数字越大排序越靠前</div>
            <div className='mt8'>
              <FormItem
                name='sort'
                type='number'
                placeholder='请输入正整数'
                style={{
                  marginBottom: 8
                }}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                verifiable
                fieldDecoratorOptions={{
                  rules: [
                    { required: true, message: '请输入序号' }
                  ]
                }}
                controlProps={{
                  precision: 0,
                  min: 1,
                  style: {
                    width: '100%'
                  }
                }}
              />
            </div>
          </Form>
        ),
        onOk: () => {
          form.props.form.validateFields((err) => {
            if (err) {
              return
            }
            const values = form.getValues()
            console.log(values, 'values')
            api.setTop({
              planId: record.planId,
              topSort: values.sort,
              isTop: record.liveTop === 0 ? 1 : 0
            }).then(() => {
              hide()
              this.refresh()
            })
          })
        }
      })
      return
    } else {
      const hide = this.props.alert({
        width: 300,
        content: (
          <div className='text-center'>
            确定是否取消置顶
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
  }
  public showQrcode = (record: UliveStudio.ItemProps) => {
    // module_live/pages/room/index
    api.getWxQrcode({
      page: 'module_live/pages/room/index',
      scene: `id=${record.planId}`
      // page: 'pages/product/product',
      // scene: 'pid=782&index=2'
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
  /**
   * 批量审核
   * @param auditStatus {(0|1)} - 0-审核不通过 1-审核通过
   */
  public multiAudit = (auditStatus: 0 | 1) => () => {
    if (this.state.rowKeys.length === 0) {
      APP.error('请选择待审核的直播')
      return
    }
    let reason = ''
    if (auditStatus === 0) {
      const hide = this.props.alert({
        content: (
          <div>
            <div className='mb8'>请填写审核原因（审核不通过时为必填）</div>
            <div>
              <TextArea
                onChange={(e) => {
                  reason = e.target.value
                }}
              />
            </div>
          </div>
        ),
        onOk: () => {
          if (!reason) {
            APP.error('请填写审核原因')
            return
          }
          api.multiAudit({
            auditReason: reason,
            auditStatus: 0,
            planIds: this.state.rowKeys
          }).then((res) => {
            res = res || {}
            const planIds = res.planIds || []
            hide()
            const hide2 = this.props.alert({
              width: 400,
              content: (
                <div className='text-center'>
                  共有{planIds.length}场直播审核不通过成功!
                </div>
              ),
              onOk: () => {
                hide2()
              }
            })
            this.setState({
              rowKeys: []
            })
            this.listpage.refresh()
          })
        }
      })
    } else {
      const hide = this.props.alert({
        width: 400,
        content: (
          <div className='text-center'>
            确定是否全部批量审核通过？
          </div>
        ),
        onOk: () => {
          api.multiAudit({
            auditStatus: 1,
            planIds: this.state.rowKeys
          }).then((res: any) => {
            hide()
            res = res || {}
            const planIds = res.planIds || []
            // APP.success(`共有${planIds.length}场直播成功审核通过`)
            const hide2 = this.props.alert({
              width: 400,
              content: (
                <div className='text-center'>
                  共有{planIds.length}场直播成功审核通过
                </div>
              ),
              onOk: () => {
                hide2()
              }
            })
            this.setState({
              rowKeys: []
            })
            this.listpage.refresh()
          })
        }
      })
    }
  }
  public showVideo (record: UliveStudio.ItemProps) {
    const liveStatus = record.liveStatus
    const isPlayBack = [51, 60].indexOf(liveStatus) > -1
    const query = param({
      version: new Date().getTime(),
      playUrl: isPlayBack ? (record.playbackUrl || []).join(',') : record.playUrl,
      liveCoverUrl: record.liveCoverUrl,
      isLive: isPlayBack ? '' : 'live'
    })
    let url = location.pathname.replace(/index.html/, '') + 'video.html?' + query
    // url = 'http://assets.hzxituan.com/upload/2020-03-17/020bfc50-ec64-41cd-9a42-db1b7e92864e-k7vplmky.html?' + query
    url = 'http://test-crmadmin.hzxituan.com/issue50/video.html?' + query
    // url = 'http://localhost:3000/video.html?' + query
    window.open(url, '喜团直播', 'top=120,left=150,width=800,height=500,scrollbars=0,titlebar=1', false)
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
          reserveKey='ulive-studio'
          getInstance={(ref) => {
            this.listpage = ref
          }}
          columns={this.columns}
          onFormChange={(field, value) => {
            if (field === 'liveTagId') {
              this.listpage.form.setValues({
                liveTop: undefined
              }, true)
            } else if (field === 'liveTop') {
              this.listpage.form.setValues({
                liveTagId: undefined
              }, true)
            }
          }}
          tableProps={{
            rowKey: 'planId',
            rowSelection: {
              selectedRowKeys: this.state.rowKeys,
              onChange: (keys: string[] | number[]) => {
                if (keys.length > 20) {
                  APP.error('批量审批场次不可超过20条')
                  return
                }
                this.setState({
                  rowKeys: keys
                })
              },
              getCheckboxProps: (record) => {
                return {
                  disabled: record.liveStatus !== 10
                }
              }
            },
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
              <FormItem name='anchorPhone' />
              <FormItem label='场次ID' name='planId' />
              {/* <FormItem name='type' /> */}
              <FormItem name='liveTime' />
              <FormItem
                name='liveTagId'
                label='直播标签'
                inner={(form) => {
                  return (
                    <SelectFetch
                      fetchData={() => {
                        return fetchTagList().then((res) => {
                          const data = res || []
                          return data.map((item: {title: string, id: any}) => {
                            return {
                              label: item.title,
                              value: item.id
                            }
                          })
                        })
                      }}
                    />
                  )
                }}
              />
              <FormItem name='liveTop' />
            </>
          )}
          addonAfterSearch={(
            <div>
              <Button
                className='mr10'
                type='primary'
                onClick={this.multiAudit(1)}
              >
                批量通过
              </Button>
              <Button onClick={this.multiAudit(0)}>审核不通过</Button>
            </div>
          )}
          api={api.getStudioList}
        />
      </div>
    )
  }
}
export default Alert(Main)
