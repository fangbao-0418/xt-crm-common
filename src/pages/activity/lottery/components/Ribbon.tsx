import React from 'react'
import { Button, Modal } from 'antd'

/**  确认开启关闭 */
function confirmOpen (fn: any, open: number) {
  Modal.confirm({
    title: '系统提示',
    content: `是否确认${open === 1 ? '开启' : '关闭'}`,
    onOk: fn.bind(null, open)
  })    
}

function Main (props: any) {
  return (
    <div>
      <Button
        type='link'
        onClick={props.onView}
      >
        查看
      </Button>
      <Button
        type='link'
        onClick={props.onEdit}
      >
        编辑
      </Button>
      {props.moduleId === 'sessions' && <Button type='link' onClick={() => {
        Modal.confirm({
          title: '系统提示',
          content: '是否确认删除',
          onOk: props.onDelete
        })
      }}>删除</Button>}
      {3 === Number(status) && (
        <Button
          type='link'
          onClick={() => {
            confirmOpen(props.onUpdate, 1)
          }}
        >
          开启
        </Button>
      )}
      {[0, 1].includes(Number(status)) && (
        <Button
          type='link'
          onClick={() => {
            confirmOpen(props.onUpdate, props.status === 3 ? 1: 0)
          }}
        >
          {props.status === 3 ? '开启' : '关闭'}
        </Button>
      )}
      {props.moduleId === 'sessions' && (
        <Button
          type='link'
          onClick={props.onJumpToReward}
        >
          查看用户中奖信息
        </Button>
      )}
    </div>
  )
}

export default Main