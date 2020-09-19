import React, { Component } from "react";
import { Card, Row, Col, Form, Icon } from "antd";
import { getFrontCategorys, getCategory } from "./api";
import _ from "lodash";
import "./category.scss";
import HaodianForm from "./components/HaodianForm";
import YouxuanForm from "./components/YouxuanForm";
import { If } from "@/packages/common/components";
interface State {
  cateList: any[];
  currId: number;
  detail: any;
  isShow: boolean;
}
class InterFaceCategory extends Component<any, State> {
  public state: State = {
    cateList: [],
    currId: -1,
    detail: {},
    isShow: false,
  };

  public componentDidMount() {
    console.log('componentDidMountcomponentDidMountcomponentDidMountcomponentDidMount')
    this.getCategorys();
  }

  public getCategorys = (id?: any) => {
    getFrontCategorys(this.props.channel).then((data) => {
      this.setState({
        cateList: data.records,
        currId: id || -1,
      });
    });
  };

  //获取单个类目信息
  public getCategory(id: any) {
    getCategory(id).then((detail: any) => {
      this.setState({ detail, currId: id, isShow: true });
    });
  }
  render() {
    const {
      channel,
      form: { getFieldValue },
    } = this.props;
    const { detail } = this.state;
    console.log('this.state.currId', this.state.currId)
    return (
      <div className="intf-cat-box">
        <Card>
          <Row className="intf-cat-list">
            {this.state.cateList.map((val, i) => {
              return (
                <Col
                  className={this.state.currId == val.id ? "act" : ""}
                  span={3}
                  key={val.id}
                  onClick={() => this.getCategory(val.id)}
                >
                  {val.showType === 0 && (
                    <Icon
                      type="home"
                      style={{ paddingRight: "10px", color: "red" }}
                    />
                  )}
                  {val.name}
                </Col>
              );
            })}
            <Col
              span={3}
              onClick={() => {
                this.setState({ isShow: true, currId: -1, detail: {} });
              }}
            >
              +添加类目
            </Col>
          </Row>
        </Card>
        <Card style={{ display: this.state.isShow ? "block" : "none" }}>
          <div style={{display: channel === "1" ? "block" : "none" }}>
            <YouxuanForm
              detail={detail}
              currId={this.state.currId}
              getCategorys={this.getCategorys}
            />
          </div>
          <div style={{ display: channel === "2" ? "block" : "none" }}>
            <HaodianForm
              detail={detail}
              currId={this.state.currId}
              getCategorys={this.getCategorys}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default Form.create<any>()(InterFaceCategory);
