import React from 'react';
import { Form, Card, Input, InputNumber, Button, Table } from 'antd';
import { editColumns } from './contant';
import CascaderCity from '@/components/cascader-city';
interface State {
  visible: boolean;
  templateData: any[];
}
let uid = 1;
class edit extends React.Component<{}, State> {
  state: State = {
    visible: false,
    templateData: [],
  };
  render() {
    return (
      <>
        <CascaderCity
          visible={this.state.visible}
          onOk={(areas: any) => {
            console.log('areas=>', areas);
            const { templateData } = this.state;
            this.setState({
              templateData: [...templateData, { areas, uid: uid++ }],
              visible: false,
            });
          }}
          onCancel={() => this.setState({ visible: false })}
        />
        <Card title="运费模板设置">
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="模板名称" required={true}>
              <Input style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="运费设置">
              <Card
                type="inner"
                title={
                  <>
                    <span>默认运费：</span>
                    <InputNumber style={{ width: 80 }} />
                    <span className="ml10">元</span>
                  </>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                >
                  为指定地区添加运费
                </Button>
                <Table
                  rowKey="uid"
                  className="mt10"
                  columns={editColumns}
                  dataSource={this.state.templateData}
                ></Table>
              </Card>
            </Form.Item>
          </Form>
        </Card>
      </>
    );
  }
}
export default edit;
