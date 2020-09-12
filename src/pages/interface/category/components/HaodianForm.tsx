import React from "react";
import { Form, FormItem } from "@/packages/common/components";
import { Checkbox, Button, Radio, Icon } from "antd";
import CategoryModal, { CategoryModalProps } from './CategoryModal';

interface State {
  checkCate: boolean;
  checkAct: boolean;
  actText: any[];
  cateText: any[];
}
class Main extends React.Component<{}, State> {
  public modalRef: CategoryModalProps | null
  public state = {
    checkCate: false,
    checkAct: false,
    actText: [],
    cateText: [],
  };
  public handleAdd = () => {
    this.modalRef?.open()
  }
  public render() {
    return (
      <>
        <CategoryModal
          ref={(ref) => this.modalRef = ref }
          onOk={(res) => {
            this.setState({ cateText: res })
          }}
        />
        <Form>
          <FormItem
            name="name"
            label="前台类目名称"
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入前台类目名称",
                },
                {
                  max: 5,
                  message: "最大支持五个字符!",
                },
              ],
            }}
          />
          <FormItem
            name="sort"
            label="排序"
            type="number"
            controlProps={{
              style: {
                width: "100%",
              },
            }}
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入排序数字",
                },
              ],
            }}
          />
          <FormItem
            name="relationShop"
            label="关联店铺"
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入关联店铺",
                },
              ],
            }}
            inner={(form) => {
              return (
                <div>
                  <Checkbox
                    checked={this.state.checkCate}
                    onChange={(e) => {
                      this.setState({
                        checkCate: e.target.checked,
                      });
                    }}
                  >
                    关联类目
                  </Checkbox>
                  {this.state.checkCate ? (
                    <div className="intf-cat-rebox">
                      {this.state.cateText.map((val: any, i: number) => {
                        return (
                          <div className="intf-cat-reitem" key={i}>
                            {val.name}
                            <span
                              className="close"
                              onClick={() => {
                                const cateText = this.state.cateText;
                                cateText.splice(i, 1);
                                this.setState({ cateText });
                              }}
                            >
                              <Icon type="close" />
                            </span>
                          </div>
                        );
                      })}
                      <Button type="link" onClick={this.handleAdd}>+添加类目</Button>
                    </div>
                  ) : (
                    ""
                  )}
                  <Checkbox
                    checked={this.state.checkAct}
                    onChange={(e) => {
                      this.setState({
                        checkAct: e.target.checked,
                      });
                    }}
                  >
                    关联活动
                  </Checkbox>
                  {this.state.checkAct ? (
                    <div className="intf-cat-rebox">
                      {this.state.actText.map((val: any, i: number) => {
                        return (
                          <div className="intf-cat-reitem" key={i}>
                            {val.title}
                            <span
                              className="close"
                              onClick={() => {
                                const actText = this.state.actText;
                                actText.splice(i, 1);
                                this.setState({ actText });
                              }}
                            >
                              <Icon type="close" />
                            </span>
                          </div>
                        );
                      })}
                      <Button type="link">+添加活动</Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            }}
          />
          <FormItem
            name="status"
            label="类目开关"
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "请选择类目开关",
                },
              ],
            }}
            inner={(form) => {
              return (
                <Radio.Group>
                  <Radio value={1} style={{ display: "block" }}>
                    展示
                  </Radio>
                  <Radio value={2} style={{ display: "block" }}>
                    不展示
                  </Radio>
                </Radio.Group>
              );
            }}
          />
          {/* {getFieldDecorator("status", {
            initialValue: 1,
            rules: [
              {
                required: true,
                message: "请选择类目开关",
              },
            ],
          })(
            <Radio.Group>
              <Radio value={1} style={{ display: "block" }}>
                展示
              </Radio>
              <Radio value={2} style={{ display: "block" }}>
                不展示
              </Radio>
            </Radio.Group>
          )}
        </FormItem> */}
          <FormItem>
            <div style={{ textAlign: "right" }}>
              <Button type="danger" ghost style={{ marginRight: "10px" }}>
                删除
              </Button>
              <Button type="primary">保存</Button>
            </div>
          </FormItem>
        </Form>
      </>
    );
  }
}

export default Main;
