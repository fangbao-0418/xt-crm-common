import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import CarouselEdit from './components/CarouselEdit'
import { CarouselItem } from './interface'
import * as api from './api'

interface Props extends AlertComponentProps {}

class Main extends React.Component<Partial<Props>> {
  public columns: any[] = [
    {
      title: '场次ID',
      dataIndex: '场次ID',
      width: 150
    },
    {
      title: '直播标题',
      dataIndex: '直播标题'
    },
    {
      title: '状态',
      dataIndex: '状态'
    },
    {
      title: '排序',
      dataIndex: '排序'
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: () => {
        return (
          <div>
            <span className='href'>
              修改
            </span>&nbsp;&nbsp;
            <span className='href'>
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public carouselRef: CarouselEdit | null
  public edit = (record?: CarouselItem) => {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 400,
        content: (
          <CarouselEdit
            ref={(ref) => this.carouselRef = ref}
            // record={record}
          />
        ),
        onOk: () => {
          if (this.carouselRef) {
            this.carouselRef.save().then(() => {
              hide()
              this.listpage.refresh()
            })
          }
        }
      })
    }
  }
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          api={api.fetchCarouselList}
          getInstance={(ref) => this.listpage = ref}
          addonAfterSearch={(
            <div style={{marginTop: -10}}>
              <Button
                type='primary'
                onClick={this.edit.bind(this, undefined)}
              >
                新建标签
              </Button>
            </div>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)