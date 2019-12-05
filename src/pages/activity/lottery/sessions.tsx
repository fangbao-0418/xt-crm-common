import React from 'react'
import { Button, Card, Table, DatePicker, Icon, Row, Input, InputNumber } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import styles from './style.module.styl'
import SelectFetch from '@/packages/common/components/select-fetch'
import { prizeOptions } from './config'
import Upload from '@/components/upload'
import PrizeSelect from './components/PrizeSelect'
import * as api from './api'
const { Column, ColumnGroup } = Table
interface State {
  awardList: Lottery.LuckyDrawAwardListVo[]
}
class Main extends React.Component<any, State> {
  public form: FormInstance
  public state: State
  /** 活动ID */
  public luckyDrawId: number
  /** 场次ID */
  public id: number
  public constructor (props: any) {
    super(props)
    this.luckyDrawId = +props.match.params.id
    this.id = +props.match.params.id
    this.handleSave = this.handleSave.bind(this)
    this.initAwardList()
  }
  /** 初始化奖品列表 */
  public initAwardList () {
    let res: any = []
    for (let i = 0; i < 7; i++) {
      res[i] = {
        id: i + 1,
        awardType: null,
        awardValue: '',
        awardTitle: '',
        awardPicUrl: '',
        controlLevel: null,
        awardNum: null,
        receiveNum: null,
        restrictNum: null,
        restrictOrderAmount: null,
        normalUserProbability: null,
        headUserProbability: null,
        areaUserProbability: null,
        cityUserProbability: null,
        defaultAward: 1
      }
    }
    res[res.length] = {
      defaultAward: 0
    }
    this.state = {
      awardList: res
    }
  }
  /**
   * 设置单元格值
   * @param id 
   * @param index 
   * @param val 
   */
  public setCellValue (id: string, index: number, val: any) {
    const { awardList } = this.state
    const item: any = awardList[index] || {}
    item[id] = val
    this.setState({ awardList })
  }
  /**
   * 获取单元格值
   * @param id 
   * @param index 
   */
  public getCellValue (id: string, index: number) {
    const { awardList } = this.state
    const item: any = awardList[index] || {}
    return item[id]
  }
  /**
   * 绑定组件，注入onchange，value属性
   * @param id 
   * @param index 
   */
  public getFieldDecorator (id: string, index: number) {
    return (node: any) => {
      return React.cloneElement(node, {
        onChange: (e: any) => {
          switch (node.type.name) {
            case 'Input':
              this.setCellValue(id, index, e.target.value)
              break
            case 'InputNumber':
              this.setCellValue(id, index, e)
              break
            default:
              this.setCellValue(id, index, e)
          }
        },
        value: this.getCellValue(id, index)
      })
    }
  }
  /** 新增、编辑活动场次 */
  public handleSave () {
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        const { awardList } = this.state
        let msg, res
        /** 新增场次 */
        if (this.id === -1) {
          msg = '新增场次'
          res = api.saveSession({
            luckyDrawId: this.luckyDrawId,
            awardList,
            ...vals
          })
        } else {
          msg = '编辑场次'
          res = api.saveSession({
            luckyDrawId: this.luckyDrawId,
            awardList,
            id: this.id,
            ...vals
          })
        }
        if (res) {
          APP.success(`${msg}成功`)
        }
      }
    })
  }
  /** 取消 */
  public handleCancel () {
    APP.history.go(-1)
  }
  public render () {
    return (
      <Form
        getInstance={ref => this.form = ref}
        addonAfter={(
          <div style={{marginTop: 100}}>
            <Button type='danger' onClick={this.handleSave}>保存</Button>
            <Button className='ml10' onClick={this.handleCancel}>取消</Button>
          </div>
        )}
      >
        <Card title='场次信息'>
          <FormItem
            name='title'
            type='input'
            label='场次名称'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
            controlProps={{
              style: {
                width: 172
              }
            }}
          />
          <FormItem
            label='开始时间'
            verifiable
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('startTime')(
                    <DatePicker showTime/>
                  )}
                  <span className='ml10'>
                    <Icon
                      type='info-circle'
                      theme='filled'
                      style={{
                        color: '#1890ff',
                        marginRight: 4
                      }}
                    />
                    <span>场次的开始时间默认不能早于活动开始时间和上一场次结束时间。</span>
                  </span>
                </div>
              )
            }}
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
          />
          <FormItem
            name='endTime'
            type='date'
            label='结束时间'
            verifiable
            controlProps={{
              showTime: true
            }}
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
          />
        </Card>
        <Card title='奖品列表'>
          <Table
            className={styles['prize-list']}
            dataSource={this.state.awardList}
            pagination={false}
            scroll={{ x: true }}
          >
            <Column
              title='序号'
              dataIndex='id'
              key='id'
              width={80}
              render={(id: any, record: Lottery.LuckyDrawAwardListVo) => {
                return record.defaultAward === 1 ? id : '兜底'
              }}
            />
            <Column
              width={158}
              title={<span className={styles.required}>奖品类型</span>}
              dataIndex='awardType'
              key='awardType'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('awardType', index)(<SelectFetch options={prizeOptions}/>)
              )}
            />
            <Column
              width={140}
              title={<span className={styles.required}>奖品设置</span>}
              dataIndex='awardValue'
              key='awardValue'
              render={(arg1, record: Lottery.LuckyDrawAwardListVo, index: number) => (
                this.getFieldDecorator('awardValue', index)(<PrizeSelect awardType={record.awardType}/>)
              )}
            />
            <Column
              title={<span className={styles.required}>简称</span>}
              dataIndex='awardTitle'
              key='awardTitle'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('awardTitle', index)(<Input />)
              )}
            />
            <Column
              width={120}
              title={<span className={styles.required}>图片</span>}
              dataIndex='awardPicUrl'
              key='awardPicUrl'
              render={awardPicUrl => (
                <Upload listType='picture-card' />
              )}           
            />
            <Column
              width={100}
              title='风控级别'
              dataIndex='controlLevel'
              key='controlLevel'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('controlLevel', index)(<InputNumber min={0} max={1}/>)
              )}
            />
            <Column
              width={100}
              title={<span className={styles.required}>奖品库存</span>}
              dataIndex='awardNum'
              key='awardNum'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('awardNum', index)(<InputNumber />)
              )}
            />
            <Column
              title='发出数量'
              dataIndex='receiveNum'
              key='receiveNum'
            />
            <Column
              title='单人限领'
              dataIndex='restrictNum'
              key='restrictNum'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('restrictNum', index)(<InputNumber />)
              )}
            />
            <Column
              title='订单门槛'
              dataIndex='restrictOrderAmount'
              key='restrictOrderAmount'
              render={(arg1, arg2, index) => (
                this.getFieldDecorator('restrictOrderAmount', index)(<InputNumber />)
              )}
            />
            <ColumnGroup title={<span className={styles.required}>中奖概率%</span>}>
              <Column
                title='普通用户'
                dataIndex='normalUserProbability'
                key='normalUserProbability'
                render={(arg1, arg2, index) => (
                  this.getFieldDecorator('normalUserProbability', index)(<InputNumber min={0} max={100} />)
                )}
              />
              <Column
                title='团长'
                dataIndex='headUserProbability'
                key='headUserProbability'
                render={(arg1, arg2, index) => (
                  this.getFieldDecorator('headUserProbability', index)(<InputNumber min={0} max={100} />)
                )}
              />
              <Column
                title='区长'
                dataIndex='areaUserProbability'
                key='areaUserProbability'
                render={(arg1, arg2, index) => (
                  this.getFieldDecorator('areaUserProbability', index)(<InputNumber min={0} max={100} />)
                )}
              />
              <Column
                title='合伙人'
                dataIndex='cityUserProbability'
                key='cityUserProbability'
                render={(arg1, arg2, index) => (
                  this.getFieldDecorator('cityUserProbability', index)(<InputNumber min={0} max={100} />)
                )}
              />
            </ColumnGroup>
          </Table>
        </Card>
        <Card type='inner' title='规则说明'>
          <Row type='flex'>
            <Icon
              type='info-circle'
              theme='filled'
              style={{
                color: '#1890ff',
                marginRight: 4,
                marginTop: 4
              }}
            />
            <div>
              <div>奖品列表根据活动类型固定数量奖品，红包雨10个奖品，九宫格8个奖品；</div>
              <div>兜底奖品行一直置底；</div>
              <div>奖品类型包括：现金、优惠券、实物、元宝，(兜底商品多一个“谢谢惠顾”)；</div>
              <div>奖品设置：现金、元宝填写非负整数，优惠券和实物选择对应券（实物本期也是使用优惠券）；</div>
              <div>简称：奖品简称，用于前台展示；</div>
              <div>图片：用于前台展示，规格尺寸根据设计需求而定，可以删除后重新上传；</div>
              <div>风控级别：0和1，0为无风控基别，1风控级别为高；</div>
              <div>奖品库存：本场次可发放奖品的总量，活动进行中可以调整；</div>
              <div>发出数量：本场次发出商品的数量；</div>
              <div>单人限领：本场次活动中，单人最高可中奖数量；</div>
              <div>订单门槛：满足订单金额门槛才可以抽中对应奖品（仅限九宫格，红包雨订单门槛置灰）；</div>
              <div>中奖概率：非负整数，0-100；</div>
            </div>
          </Row>
        </Card>
      </Form>
    )
  }
}
export default Main