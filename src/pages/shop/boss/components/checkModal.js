import React, { Component } from 'react';
import { Modal, message } from 'antd';
import If from '@/packages/common/components/if'
import { connect } from '@/util/utils';
import { batchExport } from '../api';


const unionArr2Map = function (arr) {
  const arrMap = {}
  arr.forEach(item => {
    if (item.errorCode === 0) {
      if (arrMap['00000']) {
        arrMap['00000'].num += 1
      } else {
        arrMap['00000'] = {
          num: 1,
          errorMsg: item.errorMsg
        }
      }
    } else {
      if (arrMap[item.errorCode]) {
        arrMap[item.errorCode].num += 1
      } else {
        arrMap[item.errorCode] = {
          num: 1,
          errorMsg: item.errorMsg
        }
      }
    }
  })
  return arrMap
}

@connect(state => ({
  modal: state['shop.boss'].checkModal,
  checkArr: state['shop.boss'].checkArr,
  phones: state['shop.boss'].phones
}))
export default class extends Component {

  /** 确定操作 */
  handleOk = () => {
    const { checkArr, dispatch } = this.props
    const phones = checkArr.filter(item => item.errorCode === 0).map(item => item.phone)
    if(!phones.length) return message.warn('没有小店可以开通, 请检查数据');
    const phonesStr = phones.join(',')
    dispatch['shop.boss'].createShop({ phones: phonesStr });
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        checkModal: {
          visible: false
        }
      }
    });
  }

  handleExport = () => {
    batchExport({
      phones: this.props.phones
    })
  }

  render() {
    const { modal, checkArr } = this.props

    const checkInfo = unionArr2Map(checkArr);

    const failData = Object.keys(checkInfo).filter(item => item !== '00000')

    return (
      <Modal
        visible={modal.visible}
        okText="确认开通"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <p style={{ fontWeight: 600, fontSize: 24, textAlign: "center", margin: '16px 0' }}>
            共识别到{checkInfo['00000'] && checkInfo['00000'].num || 0}个用户可开通小店
          </p>
          <If condition={failData.length}>
            另
            {
              failData.map((item) => (
                <span>, {checkInfo[item].num}个用户{checkInfo[item].errorMsg}</span>
              ))
            }
            <span onClick={this.handleExport} className="href"> 导出</span>
          </If>
          <p style={{ marginTop: 32 }}>
            提示：如有无法识别字符请检查手机号长度或者内容结尾删除空格等不合格字符
          </p>
        </div>
      </Modal>
    )
  }
}