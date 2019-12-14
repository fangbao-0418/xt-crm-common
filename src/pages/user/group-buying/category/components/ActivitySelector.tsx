import React from 'react'
import { Button, Icon, Form, Modal } from 'antd'
import styles from './style.module.styl'
import _ from 'lodash'
import { activityType } from '@/enum'
import ListPage from '@/packages/common/components/list-page'
import DateFns from 'date-fns'
import { getPromotionList } from '@/pages/activity/api'
import { getDefaultConfig } from './config'

interface State {
  selectedRowKeys: string[] | number[],
  selectedRows: any[]
  visible: boolean,
}
class Main extends React.Component<any, State> {
  public state: State = {
    selectedRowKeys: [],
    selectedRows: [],
    visible: false
  }
  public constructor (props: any) {
    super(props)
    this.handleCancelModal = this.handleCancelModal.bind(this)
    this.handleOkModal = this.handleOkModal.bind(this)
  }
  public columns = [{
    title: '活动ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '活动名称',
    dataIndex: 'title',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
  },
  {
    title: '活动类型',
    dataIndex: 'type',
    render: (text: any) => (
      <>
        {activityType.getValue(text)}
      </>
    ),
  },
  {
    title: '活动状态',
    dataIndex: 'status',
    render: (text: any) => <>{text === 0 ? '关闭' : '开启'}</>,
  }]
  public handleCancelModal () {

  }
  public handleOkModal () {

  }
  public render() {
    const { selectedRowKeys, selectedRows, visible } = this.state
    return (
      <>
        <Modal
          title="选择活动"
          visible={visible}
          width={1000}
          onCancel={this.handleCancelModal}
          onOk={this.handleOkModal}
        >
          <ListPage
            rangeMap={{
              time: {
                fields: ['startTime', 'endTime']
              }
            }}
            columns={this.columns}
            formConfig={getDefaultConfig()}
            api={getPromotionList}
            tableProps={{
              rowSelection: {
                selectedRowKeys,
                onChange: (selectedRowKeys: string[] | number[]) => {
                  console.log('selectedRowKeys changed: ', selectedRowKeys)
                  this.setState({
                    selectedRowKeys
                  })
                }
              }
            }}
          />
        </Modal>
        <div className={styles['intf-cat-rebox']}>
          {selectedRows.map((val: any, i: number) => {
            return (
              <div className={styles['intf-cat-reitem']} key={i}>
                {val.title}{' '}
                <span
                  className={styles['close']}
                  onClick={() => {
                    selectedRows.splice(i, 1)
                    this.setState({ selectedRows })
                  }}
                >
                  <Icon type='close' />
                </span>
              </div>
            )
          })}
          <Button
            type='link'
            onClick={() => this.setState({ visible: true })}
          >
            +添加活动
          </Button>
        </div>
      </>
    )
  }
}
export default Main
// const GetActivityModal = Form.create<any>()(GetActivity)
// class Main extends React.Component {
//   public state = {
//     actText: [],
//     actList: [],
//     visible1: false,
//     modalPage: {
//       current: 1,
//       total: 0,
//       pageSize: 10,
//     },
//     activityParams: {},
//     visible1Type: null,
//     selectedRows: [],
//     secondCategoryVOS: [],
//     cateText: [],
//     selectedRowKeys: [],
//     secondaryIndex: 0,
//     selectedSecondary: []
//   }
//   public handleClickModal = (data = {}) => {
//     const { type, index, secondaryActText }: any = data;
    
//     if(type === 'secondary'){
//       this.setState({
//         visible1Type: type,
//         visible1: true,
//         secondaryIndex: index,
//         selectedRowKeys: secondaryActText ? secondaryActText.map((val: any) => val.id) : [],
//         selectedSecondary: secondaryActText || []
//       });
//     } else {
//       this.setState({
//         visible1Type: null,
//         visible1: true,
//         selectedRowKeys: this.state.actText.map((val: any) => val.id),
//         selectedRows: this.state.actText
//       });
//     }
//   }
//   public handleCancelModal = (e: any) => {
//     this.setState({
//       visible1: false,
//     })
//   }
//   public handleOkModal = (e: any) => {
//     const { visible1Type, secondCategoryVOS, secondaryIndex, selectedSecondary } = this.state;
    
//     if(visible1Type !== null){
//       const item: any = secondCategoryVOS[secondaryIndex]
//       if(secondaryIndex !== null && item && item.type !== 4){
//         item && (item.productCategoryVOS = selectedSecondary)
//       }
//       return this.setState({
//         secondaryActText: selectedSecondary,
//         visible1: false,
//         secondCategoryVOS
//       })
//     }

//     this.setState({
//       actText: this.state.selectedRows,
//       productCategoryVOS: [...this.state.cateText, ...this.state.selectedRows],
//       visible1: false
//     })
//   }
//   handlenChanageSelectio = (selectedRowKeys: any[], selectedRows: any[]) => {
//     const { visible1Type, selectedSecondary } = this.state;

//     const objKeys: any = {};
//     let currSelectedRows = [];
//     if(visible1Type !== null){
//       selectedSecondary.forEach((val: any) => {
//         objKeys[val.id] = val;
//       })
//     } else {
//       this.state.selectedRows.forEach((val: any) => {
//         objKeys[val.id] = val;
//       })
//     }
    
//     selectedRows.forEach(val => {
//       objKeys[val.id] = val;
//     })
//     for (const key in objKeys) {
//       currSelectedRows.push(objKeys[key]);
//     }
//     currSelectedRows = currSelectedRows.filter(val => {
//       return selectedRowKeys.includes(val.id)
//     })

//     if(visible1Type !== null){
//       return this.setState({
//         selectedRowKeys,
//         selectedSecondary: currSelectedRows
//       });
//     } 

//     this.setState({
//       selectedRowKeys,
//       selectedRows: currSelectedRows
//     });
//   };
//   public render() {
//     const { actList, visible1, modalPage, selectedRowKeys } = this.state
//     return (
//       <>
//         <GetActivityModal
//           handleCancelModal={this.handleCancelModal}
//           handleOkModal={this.handleOkModal}
//           actList={actList}
//           handlenChanageSelectio={this.handlenChanageSelectio}
//         />
      
//       </>
//     )
//   }
// }

// export default Main
