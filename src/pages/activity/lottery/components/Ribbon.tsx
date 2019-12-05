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

function Main ({ status, onView, onEdit, onUpdate, onDelete}: any) {
  return (
    <div>
      <Button
        type='link'
        onClick={onView}
      >
        查看
      </Button>
      {[0, 1, 3].includes(status) && (
        <Button
          type='link'
          onClick={onEdit}
        >
          编辑
        </Button>
      )}
      <Button type='link' onClick={() => {
        Modal.confirm({
          title: '系统提示',
          content: '是否确认删除',
          onOk: onDelete
        })
      }}>删除</Button>
      {3 === Number(status) && (
        <Button
          type='link'
          onClick={() => {
            confirmOpen(onUpdate, 1)
          }}
        >
          开启
        </Button>
      )}
      {[0, 1].includes(Number(status)) && (
        <Button
          type='link'
          onClick={() => {
            confirmOpen(onUpdate, 0)
          }}
        >
          关闭
        </Button>
      )}
    </div>
  )
}

export default Main