import React from "react";
import { Button, Radio } from "antd";
import Form, {
  FormItem,
  FormInstance,
} from "@/packages/common/components/form";
import { getFieldsConfig, locationMap, displayFromMap } from "./config";
import RelevanceGoods from "./components/RelevanceGoods";
import RelevanceShop from "./components/RelevanceShop";
import { withRouter, RouteComponentProps } from "react-router";
import * as api from "./api";
interface Props extends RouteComponentProps<{ id: string }> {}
interface State {
  readonly: boolean
  detail: any
}
class Main extends React.Component<Props, State> {
  public form: FormInstance;
  public id = this.props.match.params.id;
  public state: State = {
    readonly: false,
    detail: {}
  };
  public componentDidMount() {
    this.fetchData();
  }
  public fetchData() {
    if (this.id !== "-1") {
      api.fetchDetail(this.id).then((res) => {
        res.location = locationMap.value[res.location];
        res.displayFrom = displayFromMap.value[res.displayFrom];
        res.productRecommendSpuList = res.productRecommendSpuVOList || [];
        console.log('res.relationShop', res.relationShop)
        this.form.setValues(res);
        this.setState({ detail: res })
        this.setState({
          readonly: res.status === 0 ? true : false,
        });
      });
    }
  }
  public save = () => {
    this.form.props.form.validateFields((err) => {
      if (err) {
        APP.error("请检查输入项");
        return;
      }
      const values = this.form.getValues();
      values.location = values.location.reduce((a: number, b: number) => a + b);
      values.displayFrom = values.displayFrom.reduce(
        (a: number, b: number) => a + b
      );
      
      // 喜团优选
      if (values.channel === 1) {
        const productRecommendSpuList = values.productRecommendSpuList || [];
        values.productRecommendSpuList = productRecommendSpuList.map(
          (item: any) => {
            return {
              ...item,
            };
          }
        );
      }
      values.id = this.id === "-1" ? undefined : this.id;


      // 喜团好店
      if (values.channel === 2) {
        // 关联商品
        if (values.relationType === 10) {
          values.relationIdList = (values.relationGoods || []).map((item: any) => item.productId);
          delete values.relationGoods
        }
        // 关联店铺
        if (values.relationType === 20) {
          values.relationIdList = (values.relationShop || []).map((item: any) => item.shopId);
          delete values.relationShop
        }
      }
      if (this.id === "-1") {
        api.add(values).then(() => {
          APP.success("保存成功");
          APP.history.push("/interface/goods-recommend");
        });
      } else {
        api.update(values).then(() => {
          APP.success("保存成功");
          APP.history.push("/interface/goods-recommend");
        });
      }
    });
  };
  public render() {
    const { readonly, detail } = this.state
    return (
      <div
        style={{
          padding: 20,
          background: "#fff",
        }}
      >
        <Form
          readonly={readonly}
          getInstance={(ref) => {
            this.form = ref;
          }}
          config={getFieldsConfig()}
          rangeMap={{
            date: {
              fields: ["startTime", "endTime"],
            },
          }}
        >
          <FormItem
            verifiable
            name="channel"
            controlProps={{ style: { width: 300 } }}
            type="select"
            options={[
              {
                label: "喜团优选",
                value: 1,
              },
              {
                label: "喜团好店",
                value: 2,
              },
            ]}
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "请输入推荐渠道",
                },
              ],
            }}
          />
          <FormItem
            verifiable
            name="name"
            controlProps={{ style: { width: 300 } }}
          />
          <FormItem
            style={{
              marginBottom: 0,
            }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            inner={(form) => {
              const channel = form.getFieldValue("channel");
              return channel === 1 ? (
                <FormItem verifiable name="location" type="checkbox" />
              ) : (
                <FormItem
                  verifiable
                  name="location"
                  type="checkbox"
                  options={[
                    { label: "全部", value: 0 },
                    { label: "支付结果页", value: 8 },
                    { label: "个人中心", value: 4 },
                    { label: "购物车", value: 2 },
                    { label: "商品详情", value: 1 },
                    { label: "拼团详情", value: 16 },
                    { label: "升级团长页", value: 32 },
                    { label: "商品搜索页", value: 64 },
                  ]}
                />
              );
            }}
          />

          <FormItem verifiable name="date" />
          <FormItem name="displayFrom" verifiable />
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: 0 }}
            inner={(form) => {
              const channel = form.getFieldValue("channel");
              return (
                <>
                  {channel === 1 ? (
                    <FormItem
                      label="关联商品"
                      required
                      inner={(form) => {
                        return form.getFieldDecorator(
                          "productRecommendSpuList",
                          {
                            rules: [
                              {
                                validator: (rule, value, cb) => {
                                  if (!value || value.length === 0) {
                                    cb("关联商品不能为空");
                                  }
                                  cb();
                                },
                              },
                            ],
                          }
                        )(<RelevanceGoods channel={1} readonly={readonly} />);
                      }}
                    />
                  ) : (
                    <>
                      <FormItem
                        label="推荐内容"
                        required
                        inner={(form) => {
                          return form.getFieldDecorator("relationType", {
                            initialValue: detail.relationType,
                          })(
                            <Radio.Group>
                              <Radio value={10}>关联商品</Radio>
                              <Radio value={20}>关联店铺</Radio>
                            </Radio.Group>
                          );
                        }}
                      />
                      <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        style={{ marginBottom: 0 }}
                        inner={(form) => {
                          const relationType = form.getFieldValue(
                            "relationType"
                          );
                          console.log('relationType', relationType)
                          return relationType === 10 ? (
                            <FormItem
                              inner={(form) => {
                                return form.getFieldDecorator(
                                  "relationGoods",
                                  {
                                    initialValue: detail.relationGoods,
                                    rules: [
                                      {
                                        validator: (rule, value, cb) => {
                                          if (!value || value.length === 0) {
                                            cb("关联商品不能为空");
                                          } else {
                                            cb();
                                          }
                                        },
                                      },
                                    ],
                                  }
                                )(<RelevanceGoods channel={2} readonly={readonly} />);
                              }}
                            />
                          ) : (
                            <FormItem
                              inner={(form) => {
                                return form.getFieldDecorator(
                                  "relationShop",
                                  {
                                    initialValue: detail.relationShop,
                                    rules: [
                                      {
                                        validator: (rule, value, cb) => {
                                          if (!value || value.length === 0) {
                                            cb("关联店铺不能为空");
                                          } else {
                                            cb();
                                          }
                                        },
                                      },
                                    ],
                                  }
                                )(<RelevanceShop readonly={readonly} />);
                              }}
                            />
                          );
                        }}
                      />
                    </>
                  )}
                </>
              );
            }}
          />
          <FormItem>
            <Button hidden={readonly} type="primary" onClick={this.save}>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default withRouter(Main);
