import React from 'react';
import { Form, FormItem, Alert } from '@/packages/common/components';
import { Tabs, Button, Card, Table, Modal } from 'antd';
import { NAME_SPACE, defaultConfig } from './config';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router-dom';
import { parseQuery } from '@/util/utils';
import { getRemittanceDetail, submitRemittance, getRemittanceLog, cancelRemittance } from './api';
import { FormInstance } from '@/packages/common/components/form';
import Image from '@/components/Image';
import { formatMoneyWithSign } from '../../../pages/helper';
import { AlertComponentProps } from '@/packages/common/components/alert';
import { pick } from 'lodash';
const { TabPane } = Tabs;
interface Props extends FormComponentProps, AlertComponentProps, RouteComponentProps<{id: string}> {

}
class WithdrawForm extends React.Component<Props, any> {
  id: string = '';
  form: FormInstance;
  cancelform: FormInstance;
  readOnly: boolean = false;
  columns = [{
    title: '内容',
    dataIndex: 'operateDesc'
  }, {
    title: '时间',
    dataIndex: 'createTime'
  }, {
    title: '操作人',
    dataIndex: 'operateName'
  }]
  constructor(props: Props) {
    super(props);
    this.id = props.match.params.id;
    this.readOnly = (parseQuery() as any).readOnly === '1';
    this.state = {
      canCancel: true,
      canSubmit: true,
      dataSource: []
    }
  }
  componentDidMount() {
    this.id !== '' && this.fetchData();
    this.getLog();
  }
  // 获取详情
  fetchData() {
    getRemittanceDetail(this.id).then(res => {
      console.log('res => ', res);
      res.transferAmount = formatMoneyWithSign(res.transferAmount);
      res.serviceCharge = formatMoneyWithSign(res.serviceCharge);
      this.form.setValues(res);
      this.setState(pick(res, ['canCancel', 'canSubmit']))
    })
  }
  // 提现操作日志
  getLog() {
    getRemittanceLog(this.id).then(res => {
     this.setState({ dataSource: res.list })
    })
  }
  // 提交打款
  handleSubmit = () => {
    if (this.id === '') return;
    Modal.confirm({
      title: '是否提交打款？',
      content: '确认后将会打款给对应用户',
      onOk: () => {
        submitRemittance(this.id).then(res => {
          if (res) {
            APP.history.push('/finance/withdraw');
          }
        })
      }
    })
  }
  render() {
    const { canCancel, canSubmit, dataSource } = this.state;
    return (
      <Card bodyStyle={{ paddingTop: 4 }}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='提现详情' key='1'>
            <Form
              getInstance={ref => this.form = ref}
              readonly={this.readOnly}
              style={{ marginTop: 10, width: 800 }}
              config={defaultConfig}
              namespace={NAME_SPACE}
              addonAfter={(
                (canSubmit || canCancel) ?
                (
                  <FormItem>
                    {canSubmit && <Button type='primary' onClick={this.handleSubmit}>提交打款</Button>}
                    {canCancel && <Button type='primary' className='ml10' onClick={() => {
                        this.props.alert({
                          title: '是否取消提现？',
                          content: (
                            <Form
                              getInstance={ref => this.cancelform = ref}
                              labelCol={{ span: 0}}
                              wrapperCol={{ span: 24 }}
                            >
                              <FormItem
                                placeholder='请输入取消原因（用户可见）*必填'
                                type='textarea'
                                name='remark'
                                verifiable
                                fieldDecoratorOptions={{
                                  rules: [{
                                    required: true,
                                    message: '请输入取消原因（用户可见）*必填'
                                  }]
                                }}
                                controlProps={{
                                  rows: 5,
                                  maxLength: 200
                                }}
                              />
                            </Form>
                          ),
                          onOk: (hide) => {
                            this.cancelform.props.form.validateFields((err, vals) => {
                              if (!err) {
                                cancelRemittance({
                                  id: this.id,
                                  remark: vals.remark
                                }).then(res => {
                                  if (res) {
                                    hide();
                                    APP.history.push('/finance/withdraw');
                                  }
                                })
                              }
                            })
                          }
                        })
                      }}>取消提现</Button>}
                  </FormItem>
                ): null
              )}
            >
              <FormItem name='transferNo'/>
              <FormItem name='moneyAccountTypeDesc'/>
              <FormItem name='transferAmount'/>
              <FormItem name='serviceCharge' />
              <FormItem name='memberMobile' />
              <FormItem name='createTime' type='date'/>
              <FormItem name='realName' />
              <FormItem name='bankCardNo' label='到账银行卡' />
              <FormItem name='idCardNo' label='持卡人身份证号' />
              <FormItem name='idCardFaceUrl' hidden/>
              <FormItem
                inner={(form) => {
                  return (
                    <>
                      <Image style={{ width: 150, height: 100 }} src={form.getFieldValue('idCardFaceUrl')}/>
                      <Image
                        style={{ marginLeft: 20, width: 150, height: 100 }}
                        src={form.getFieldValue('idCardBackUrl')}
                      />
                    </>
                  )
                }}
              />
              <FormItem name='phone' />
            </Form>
          </TabPane>
          <TabPane tab='信息记录' key='2'>
            <Table
              rowKey='id'
              columns={this.columns}
              dataSource={dataSource}
            />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Alert(WithdrawForm);