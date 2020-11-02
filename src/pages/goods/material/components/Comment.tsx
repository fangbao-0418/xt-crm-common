import React from 'react'
import { ReplyInfoProps } from '../interface'
import styles from '../style.module.styl'
import * as api from '../api'
import { Pagination, Popconfirm } from 'antd'

interface ReplyInfo2Props extends ReplyInfoProps {
  onRemove?: () => void
  onRecover?: () => void
}

function ReportInfo (props: ReplyInfo2Props) {
  return (
    <div className={styles['report-info']}>
      <div className='clear'>
        <div className={styles['report-info-avatar']}>
          <img src={props.headImage} />
        </div>
        <div className={styles['report-info-right']}>
          <div>
            {props.nickName}
            <div className='fr font12'>
              {props.status === 2 && (
                <>
                  <span style={{ color: '#999' }}>
                  （已删除）
                  </span>
                  <Popconfirm
                    title='是否恢复该评论'
                    onConfirm={props.onRecover}
                  >
                    <span
                      className='href'
                    >
                      恢复
                    </span>
                  </Popconfirm>
                </>
              )}
              {props.status === 1 && (
                <Popconfirm
                  title='是否删除该评论'
                  onConfirm={props.onRemove}
                >
                  <span className='error'>删除</span>
                </Popconfirm>
              )}
            </div>
          </div>
          <div>{APP.fn.formatDate(props.createTime)}</div>
          <div className={styles['report-info-content']}>{props.content}</div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  id: number
}

interface State {
  dataSource: ReplyInfoProps[]
  total: number
  page: number
  pageSize: number
}

class Main extends React.Component<Props, State> {
  public state: State = {
    dataSource: [],
    total: 0,
    page: 1,
    pageSize: 5
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchCommentList({
      materialId: this.props.id,
      page: this.state.page,
      pageSize: this.state.pageSize
    }).then((res) => {
      this.setState({
        dataSource: res.records,
        total: res.total
      })
    })
  }
  public render () {
    const { dataSource, total, pageSize, page } = this.state
    if (total === 0) {
      return null
    }
    return (
      <div className={styles.comment}>
        <div>
          共{total}条评论
        </div>
        {
          dataSource.map((item) => {
            return (
              <div className='mt10'>
                <ReportInfo
                  {...item}
                  onRemove={() => {
                    api.removeComment(item.id).then(() => {
                      this.fetchData()
                    })
                  }}
                  onRecover={() => {
                    api.recoverComment(item.id).then(() => {
                      this.fetchData()
                    })
                  }}
                />
              </div>
            )
          })
        }
        <Pagination
          className='mt20'
          total={total}
          current={page}
          pageSize={pageSize}
          onChange={(page) => {
            // this.payload.page = page
            this.setState({
              page
            }, () => {
              this.fetchData()
            })
           
          }}
        />
      </div>
    )
  }
}
export default Main
