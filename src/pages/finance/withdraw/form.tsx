import React from 'react';
import { Form, FormItem } from '@/packages/common/components';
import { Tabs, Button, Card } from 'antd';
import { NAME_SPACE, defaultConfig } from './config';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router-dom';
import { parseQuery } from '@/util/utils';
const { TabPane } = Tabs;
interface Props extends FormComponentProps, RouteComponentProps<{id: string}> {

}
class WithdrawForm extends React.Component<Props, any> {
  id: number = -1;
  readOnly: boolean = false;
  constructor(props: Props) {
    super(props);
    this.id = +props.match.params.id;
    this.readOnly = (parseQuery() as any).readOnly === '1';
  }
  render() {
    return (
      <Card bodyStyle={{ paddingTop: 4 }}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='提现详情' key='1'>
            <Form
              readonly={this.readOnly}
              style={{ marginTop: 10, width: 800 }}
              config={defaultConfig}
              namespace={NAME_SPACE}
              addonAfter={(
                <FormItem>
                  <Button type='primary'>提交打款</Button>
                  <Button type='primary' className='ml10'>取消提现</Button>
                </FormItem>
              )}
            >
              <FormItem name='transferNo'/>
              <FormItem name='moneyAccountTypeDesc'/>
              <FormItem name='transferAmount'/>
              <FormItem name='serviceCharge' />
              <FormItem name='memberMobile' />
              <FormItem name='createTime' />
              <FormItem name='realName' />
              <FormItem name='bankCardNo' label='到账银行卡' />
              <FormItem name='idCardNo' label='持卡人身份证号' />
              <FormItem name='idCardAddress' />
              <FormItem name='phone' />
              <FormItem label='持卡人身份证'></FormItem>
            </Form>
          </TabPane>
          <TabPane tab='信息记录' key='2'>

          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default WithdrawForm;