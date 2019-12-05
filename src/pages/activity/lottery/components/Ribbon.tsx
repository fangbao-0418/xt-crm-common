import React from 'react'
import { Button } from 'antd'

function Main ({ status, onView, onEdit }: any) {
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
      {3 === Number(status) && <Button type='link'>开启</Button>}
      {[0, 1].includes(Number(status)) && <Button type='link'>关闭</Button>}
    </div>
  )
}

export default Main