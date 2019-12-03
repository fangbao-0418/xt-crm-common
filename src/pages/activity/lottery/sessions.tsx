import React from 'react'
import { Button, Card, Table, DatePicker, Icon, Row, Input } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import styles from './style.module.styl'
import { options } from './config'
import SelectFetch from '@/packages/common/components/select-fetch'
const { Column, ColumnGroup } = Table
interface Prize {

}
class Main extends React.Component {
  public form: FormInstance
  public list: Prize[] = [
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    },
    {
      No: 1,
      type: 1,
      setting: '',
      alias: '',
      image: '',
      riskControlLevel: '',
      num: '',
      limit: '',
      sill: '',
      user: '',
      head: '',
      districtChief: '',
      partner: ''
    }
  ]
  public render () {
    return (
      <Form
        getInstance={ref => this.form = ref}
        addonAfter={(
          <div style={{marginTop: 100}}>
            <Button type='danger'>确认</Button>
            <Button className='ml10'>保存</Button>
            <Button className='ml10'>取消</Button>
          </div>
        )}
      >
        <Card title='场次信息'>
          <FormItem
            name='name'
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
            name='beginTime'
            type='date'
            label='开始时间'
            verifiable
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('beginTime')(
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
          <Table dataSource={this.list}>
            <Column
              title='序号'
              dataIndex='No'
              key='No'
            />
            <Column
              width={158}
              title={<span className={styles.required}>奖品类型</span>}
              dataIndex='type'
              key='type'
              render={type => (
                <SelectFetch options={options}/>
              )}
            />
            <Column
              title={<span className={styles.required}>奖品设置</span>}
              dataIndex='setting'
              key='setting'
            />
            <Column
              title='简称'
              dataIndex='alias'
              key='alias'
            />
            <Column
              title={<span className={styles.required}>图片</span>}
              dataIndex='image'
              key='image'              
            />
            <Column
              width={100}
              title='风控级别'
              dataIndex='riskControlLevel'
              key='riskControlLevel'
              render={riskControlLevel => (
                <Input />
              )}
            />
            <Column
              width={100}
              title={<span className={styles.required}>奖品库存</span>}
              dataIndex='stock'
              key='stock'
              render={stock => (
                <Input />
              )}
            />
            <Column
              title='发出数量'
              dataIndex='num'
              key='num'
            />
            <Column
              title='单人限领'
              dataIndex='limit'
              key='limit'
              render={limit => (
                <Input />
              )}
            />
            <Column
              title='订单门槛'
              dataIndex='sill'
              key='sill'
              render={sill => (
                <Input />
              )}
            />
            <ColumnGroup title={<span className={styles.required}>中奖概率%</span>}>
              <Column
                title='普通用户'
                dataIndex='user'
                key='user'
                render={user => (
                  <Input />
                )}
              />
              <Column
                title='团长'
                dataIndex='head'
                key='head'
                render={head => (
                  <Input />
                )}
              />
              <Column
                title='区长'
                dataIndex='districtChief'
                key='districtChief'
                render={districtChief => (
                  <Input />
                )}
              />
              <Column
                title='合伙人'
                dataIndex='partner'
                key='partner'
                render={partner => (
                  <Input />
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