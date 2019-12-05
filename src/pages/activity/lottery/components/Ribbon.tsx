import React from 'react'
import { Button } from 'antd'

function Main ({ status, id }: any) {
  return (
    <div>
      <Button type='link'>查看</Button>
      {[0, 1, 3].includes(status) && (
        <Button
          type='link'
          onClick={() => {
            APP.history.push(`/activity/lottery/${id}`)
          }}
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