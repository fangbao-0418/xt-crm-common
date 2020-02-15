import React from 'react';
import { Button, Modal } from 'antd';
import { statusEnums } from './config'
import { ListPageInstanceProps  } from '@/packages/common/components/list-page';
import { ListPage, If } from '@/packages/common/components'
import { getPage, over } from './api';
import styles from './style.module.styl'
class SprinkleCash extends React.Component {
  list: ListPageInstanceProps;
  // 跳转
  jumpTo(id: number, readOnly?: boolean) {
    let path: string = `/activity/sprinkle-cash/form/${id}`;
    if (readOnly) {
      path += '?readOnly=1'
    }
    APP.history.push(path);
  }

  // 结束
  handleOver = (id: number) => {
    Modal.confirm({
      title: `确定结束 活动ID：${id} 吗`,
      okText: '确定结束',
      onOk: () => {
        over({ id }).then(res => {
          if (res) {
            APP.success('确定结束成功');
            this.list.refresh();
          }
        })
      }
    })
  }

  render() {
    return (
      <>
        <div className='mb10'>
          <Button onClick={() => this.jumpTo(-1)}>新增配置</Button>
        </div>
        <ListPage
          getInstance={ref => this.list = ref}
          api={getPage}
          columns={[{
            title: '活动ID',
            width: 100,
            dataIndex: 'id'
          }, {
            title: '活动日期',
            width: 200,
            dataIndex: 'activityDate'
          }, {
            title: '任务可发起次数上限',
            width: 160,
            dataIndex: 'maxDailyTaskNum'
          }, {
            title: '任务奖励',
            width: 100,
            dataIndex: 'awardValue'
          }, {
            title: '活动规则',
            dataIndex: 'rule',
            render: (text: string) => (
              <div className={styles['ellipsis-clamp4']} dangerouslySetInnerHTML={{ __html: text }}></div>
            )
          }, {
            title: '活动状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number) => statusEnums[value]
          }, {
            title: '操作',
            width: 180,
            render: (record: any) => {
              return (
                <>
                  <If condition={[statusEnums['未开始'], statusEnums['进行中']].includes(record.status)}>
                    <Button type='link' onClick={() => this.jumpTo(record.id)}>编辑</Button>
                    <Button type='link' onClick={this.handleOver.bind(null, record.id)}>结束</Button>
                  </If>
                  <If condition={[statusEnums['已结束'], statusEnums['已关闭']].includes(record.status)}>
                    <Button type='link' onClick={() => this.jumpTo(record.id, true)}>查看</Button>
                  </If>
                </>
              )
            }
          }
        ]}
        />
      </>
    )
  }
}

export default SprinkleCash;