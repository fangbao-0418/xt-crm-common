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
    <>
      {[5, 6].includes(props.type) ? (
        <span
          className='href mr8'
          onClick={props.onView}
        >
            查看
        </span>
      ) : (
        <div>
          <span
            className='href mr8'
            onClick={props.onView}
          >
            查看
          </span>
          {props.onCopy && (
            <span
              className='href mr8'
              onClick={props.onCopy}
            >
              复制
            </span>
          )}
          <span
            className='href mr8'
            onClick={props.onEdit}
          >
            编辑
          </span>
          {props.moduleId === 'sessions' && (
            <span
              className='href mr8'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否确认删除',
                  onOk: props.onDelete
                })
              }}
            >
              删除
            </span>
          )}
          {3 === Number(status) && (
            <span
              className='href mr8'
              onClick={() => {
                confirmOpen(props.onUpdate, 1)
              }}
            >
              开启
            </span>
          )}
          {[0, 1].includes(Number(status)) && (
            <span
              className='href mr8'
              onClick={() => {
                confirmOpen(props.onUpdate, props.status === 3 ? 1 : 0)
              }}
            >
              {props.status === 3 ? '开启' : '关闭'}
            </span>
          )}
          {props.moduleId === 'sessions' && (
            <span
              className='href mr8'
              onClick={props.onJumpToReward}
            >
              查看用户中奖信息
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default Main