import React from 'react'
import { parseQuery } from '@/packages/common/utils'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import List from '@/packages/common/components/list-page'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, ComplainTypeEnum } from './config'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Image from '@/components/Image'
import CloseDown from './components/CloseDown'
import * as api from './api'
import { withRouter, RouteComponentProps } from 'react-router'
interface Props extends AlertComponentProps, RouteComponentProps<{id: string}>{}
interface State {
  detail?: UliveStudio.ItemProps
}
class Main extends React.Component<Props, State> {
  public form: FormInstance
  public id = this.props.match.params.id
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'reportNickname',
      title: '举报人'
    },
    {
      dataIndex: 'phone',
      title: '联系方式'
    },
    {
      dataIndex: 'type',
      title: '举报类型',
      render: (text) => {
        return ComplainTypeEnum[text]
      }
    },
    {
      dataIndex: 'otherTypeContent',
      title: '内容详情'
    },
    {
      dataIndex: 'screenshotsUrl',
      title: '截图',
      align: 'center',
      render: (text) => {
        const arr: string[] = text.split(',')
        return (
          <div>
            {
              arr.map((item) => {
                return <span style={{margin: '0 2px'}}><Image src={item} width={40} height={40} /></span>
              })
            }
          </div>
        )
      }
    },
    {
      dataIndex: 'createTime',
      title: '生成时间',
      width: 200,
      align: 'center',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    }
  ]
  public state: State = {
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchPlanInfo(this.id).then((res) => {
      this.setState({
        detail: res
      }, () => {
        if (res) {
          this.form.setValues(res)
        }
      })
    })
  }
  public getParams () {
    const params = parseQuery()
    params.liveStatus = Number(params.liveStatus || 0)
    params.status = Number(params.status || 0)
    return params
  }
  public changeStatus = () => {
    const record = this.state.detail
    if (!record) {
      return
    }
    const hide = this.props.alert({
      content: (
        <div className='text-center'>
          确定是否{record.status === 0 ? '上架' : '下架'}
        </div>
      ),
      onOk: () => {
        api.changeStatus({
          planId: record.planId as number,
          status: record.status === 0 ? 1 : 0
        }).then(() => {
          hide()
        })
      }
    })
  }
  public closeDown () {
    const record = this.state.detail
    if (!record) {
      return
    }
    const hide = this.props.alert({
      width: 400,
      content: (
        <CloseDown
          detail={record}
          hide={() => {
            hide()
          }}
        />
      ),
      footer: null
    })
  }
  public render () {
    const record = this.state.detail
    if (!record) {
      return null
    }
    const canDown = [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
    const canUp = [70, 90].indexOf(record.liveStatus) > -1 && record.type === 0
    const canStopPlay = [70, 90].indexOf(record.liveStatus) > -1
    return (
      <div style={{background: '#ffffff', padding: 20}}>
        <div>
          <Form
            layout='inline'
            getInstance={(ref) => {
              this.form = ref
            }}
            config={getFieldsConfig()}
            readonly
          > 
            <FormItem>
              <Button onClick={() => { APP.history.push('/ulive/studio') }} style={{marginRight: 30}} type='primary'>返回</Button>
            </FormItem>
            <FormItem name='anchorNickName'/>
            <FormItem label='房间ID' name='planId'/>
            <FormItem label='直播标题' name='liveTitle'/>
            <FormItem name='liveStatus' />
            <FormItem
              style={{
                float: 'right'
              }}
            >
              {(canUp || canDown) && (
                <Button onClick={this.changeStatus} style={{marginRight: 10}} type='primary'>
                  {record.status === 0 ? '上架' : '下架'}
                </Button>
              )}
              {canStopPlay && <Button onClick={this.closeDown.bind(this, record)} type='primary'>停播</Button>}
            </FormItem>
          </Form>
        </div>
        <List
          processPayload={(payload) => {
            return {
              ...payload,
              livePlanId: this.id
            }
          }}
          api={api.fetchComplainList}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default withRouter(Alert(Main))
