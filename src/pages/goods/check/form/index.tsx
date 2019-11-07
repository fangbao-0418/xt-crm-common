import React from 'react';
import { getFieldsConfig } from './config';
import Form, { FormInstance } from '@/packages/common/components/form';
import { namespace } from '../model';
import { Button, Card } from 'antd';

class Main extends React.Component {
  public form: FormInstance;
  public payload: GoodsCheck.payloadProps;
  public reset() {
    this.form.props.form.resetFields();
    this.payload = {
      pageSize: 10,
      page: 1,
    };
    APP.dispatch({
      type: `${namespace}/fetchList`,
      payload: this.payload
    });
  }
  public handleClick = () => {
    const value = this.form.getValues();
    this.payload = {
      ...this.payload,
      ...value,
      page: 1,
    };
    APP.dispatch({
      type: `${namespace}/fetchList`,
      payload: this.payload
    });
  }
  public render() {
    return (
      <Card title="筛选">
        <Form
          layout="inline"
          config={getFieldsConfig()}
          getInstance={ref => {
            this.form = ref;
          }}
          addonAfter={
            <div
              style={{
                // display: 'inline-block',
                lineHeight: '40px',
                verticalAlign: 'top',
              }}
            >
              <Button
                type="primary"
                className="mr10"
                onClick={this.handleClick}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  this.reset();
                }}
              >
                清除
              </Button>
            </div>
          }
        ></Form>
      </Card>
    );
  }
}
export default Main;
