import React from 'react'
import { Button, Icon, Form, Modal, Input, Table, Select, DatePicker } from 'antd'
import styles from './style.module.styl'
import _ from 'lodash'
import { FormComponentProps } from 'antd/es/form'
import { activityType } from '@/enum'
const FormItem = Form.Item
import moment from 'moment'
import DateFns from 'date-fns'
import { getPromotionList } from '@/pages/activity/api'
const { Option } = Select
const { RangePicker } = DatePicker

const actColumns = (data = []) => {
  return [
    {
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
    }
  ]
}
interface Props extends FormComponentProps {
  getPromotionList: (params: any) => void,
  handleCancelModal: (e:any) => void,
  handleOkModal: (e:any) => void,
  actList: any[],
  selectedRowKeys: any[],
  modalPage: any,
  visible1: boolean,
  handleTabChangeModal: any,
  handlenChanageSelectio: any
}
class GetActivity extends React.Component<Props, any> {
  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props
    validateFields((err, vals) => {
      if (!err) {
        let params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: 1,
          pageSize: 20,
        };
        params = _.omitBy(params, (val, key) => {
          return key === 'time' || _.isNil(val) || val === '';
        });
        this.props.getPromotionList(params);
      }
    });
  };
  render() {
    const { 
      handleCancelModal,
      handleOkModal, 
      actList,
      selectedRowKeys,
      modalPage, 
      visible1,
      handleTabChangeModal, 
      handlenChanageSelectio,
      form
    } = this.props;
    const { getFieldDecorator, resetFields } = form;
    return <Modal
        title="选择活动"
        visible={visible1}
        width={1000}
        onCancel={handleCancelModal}
        onOk={handleOkModal}
      >
        <Form layout="inline" style={{marginBottom: '20px'}}>
            <FormItem label="活动名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(<Input placeholder="请输入活动名称" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="活动ID">
              {getFieldDecorator('promotionId', {
                initialValue: ''
              })(<Input placeholder="请输入活动ID" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="商品名称">
              {getFieldDecorator('productName',{
                initialValue: ''
              })(
                <Input placeholder="请输入商品名称" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="商品ID">
              {getFieldDecorator('productId', {
                initialValue: ''
              })(
                <Input placeholder="请输入商品ID" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="活动类型">
              {getFieldDecorator('type', {
                initialValue: ""
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  {activityType.getArray().map((val, i) => (
                    <Option value={val.key} key={i}>
                      {val.val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="活动状态">
              {getFieldDecorator('status', {
                initialValue: ""
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  <Option value="0">关闭</Option>
                  <Option value="1">开启</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="有效时间">
              {getFieldDecorator('time', {
                initialValue: ['',''],
              })(
                <RangePicker
                  style={{ width: 430 }}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />,
              )}
            </FormItem>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={() => resetFields()}>
                重置
              </Button>
            </div>
          </Form>
        <Table
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: handlenChanageSelectio,
          }}
          columns={actColumns()}
          dataSource={actList}
          pagination={modalPage}
          onChange={handleTabChangeModal}
          rowKey={(record: any) => record.id}
        />
      </Modal>
  }
}

const GetActivityModal = Form.create<Props>()(GetActivity)
class Main extends React.Component {
  public state = {
    actText: [],
    actList: [],
    visible1: false,
    modalPage: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    activityParams: {},
    visible1Type: null,
    selectedRows: [],
    secondCategoryVOS: [],
    cateText: [],
    selectedRowKeys: [],
    secondaryIndex: 0,
    selectedSecondary: []
  }
  public handleClickModal = () => {}
  public handleCancelModal = (e: any) => {
    this.setState({
      visible1: false,
    })
  }
  public handleOkModal = (e: any) => {
    const { visible1Type, secondCategoryVOS, secondaryIndex, selectedSecondary } = this.state;
    
    if(visible1Type !== null){
      const item: any = secondCategoryVOS[secondaryIndex]
      if(secondaryIndex !== null && item && item.type !== 4){
        item && (item.productCategoryVOS = selectedSecondary)
      }
      return this.setState({
        secondaryActText: selectedSecondary,
        visible1: false,
        secondCategoryVOS
      })
    }

    this.setState({
      actText: this.state.selectedRows,
      productCategoryVOS: [...this.state.cateText, ...this.state.selectedRows],
      visible1: false
    })
  }
  public getPromotionList = (params?: any) => {
    const { activityParams, modalPage } = this.state;

    const nowParams = params || activityParams;
    // page.current += 1;
    getPromotionList({
      ...nowParams,
      page: params ? 1 : modalPage.current,
      pageSize: modalPage.pageSize,
    }).then(res => {
      modalPage.total = res.total;

      this.setState({
        actList: res.records,
        modalPage: { ...modalPage, current: params ? 1 : modalPage.current},
        activityParams: nowParams
      });
    });
  };
  public handleTabChangeModal = (e: any) => {
    this.setState(
      {
        modalPage: e,
      },
      () => {
        this.getPromotionList();
      },
    );
  };
  handlenChanageSelectio = (selectedRowKeys: any[], selectedRows: any[]) => {
    const { visible1Type, selectedSecondary } = this.state;

    const objKeys: any = {};
    let currSelectedRows = [];
    if(visible1Type !== null){
      selectedSecondary.forEach((val: any) => {
        objKeys[val.id] = val;
      })
    } else {
      this.state.selectedRows.forEach((val: any) => {
        objKeys[val.id] = val;
      })
    }
    
    selectedRows.forEach(val => {
      objKeys[val.id] = val;
    })
    for (const key in objKeys) {
      currSelectedRows.push(objKeys[key]);
    }
    currSelectedRows = currSelectedRows.filter(val => {
      return selectedRowKeys.includes(val.id)
    })

    if(visible1Type !== null){
      return this.setState({
        selectedRowKeys,
        selectedSecondary: currSelectedRows
      });
    } 

    this.setState({
      selectedRowKeys,
      selectedRows: currSelectedRows
    });
  };
  public render() {
    const { actList, visible1, modalPage, selectedRowKeys } = this.state
    return (
      <>
        <GetActivityModal
          handleCancelModal={this.handleCancelModal}
          handleOkModal={this.handleOkModal}
          actList={actList}
          selectedRowKeys={selectedRowKeys}
          modalPage={modalPage}
          visible1={visible1}
          handleTabChangeModal={this.handleTabChangeModal}
          handlenChanageSelectio={this.handlenChanageSelectio}
          getPromotionList={this.getPromotionList}
        />
      <div className={styles['intf-cat-rebox']}>
        {this.state.actText.map((val: any, i: number) => {
          return (
            <div className={styles['intf-cat-reitem']} key={i}>
              {val.title}{' '}
              <span
                className={styles['close']}
                onClick={() => {
                  const actText = this.state.actText
                  actText.splice(i, 1)
                  this.setState({ actText })
                }}
              >
                <Icon type={styles['close']} />
              </span>
            </div>
          )
        })}
        <Button type='link' onClick={this.handleClickModal}>
          +添加活动
        </Button>
      </div>
      </>
    )
  }
}

export default Main
