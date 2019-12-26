import React from 'react'
import { Card, Input, Icon, Modal } from 'antd'
interface Props {
  title: string,
  sort: number,
  extra?: boolean
}
class Main extends React.Component<Props, any> {
  public onChange = () => {}
  public render () {
    const { title, sort, children, extra } = this.props
    return (
      <Card
        size='small'
        title={title}
        extra={
          extra && (<div>
            序号：
            <Input
              size='small'
              style={{ width: 60, marginRight: 10 }}
              value={sort}
              onChange={e => {
              
              }}
            />
            <Icon
              className='pointer'
              type='delete'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否删除楼层',
                  onOk: () => {
                    this.onChange();
                  },
                });
              }}
            />
          </div>)
        }
      >
        {children}
      </Card>
    )
  }
}

export default Main