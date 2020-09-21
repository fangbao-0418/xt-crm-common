import React, { useState, useEffect } from 'react';
import { formatUseTime, formatAvlRange } from '@/pages/helper';
import { Modal, Input, Button } from 'antd';
import QRCode from 'qrcode.react';
import './index.scss';
import ClipboardJS from "clipboard";
import { h5Host } from '@/util/baseHost';
function CouponCard({ info = {}, visible, setVisible }) {
  let ruleVo = info.ruleVO || {};
  const [isOpen, setIsOpen] = useState(false);
  let faceValue = ruleVo.faceValue;
  faceValue = faceValue.split(':');
  let msg = '';
  let price = '';
  switch (ruleVo.useSill) {
    // 无门槛
    case 0:
      msg = '无门槛';
      price = faceValue[0] / 100;
      break;
    // 满减
    case 1:
      msg = `满${faceValue[0] / 100}元可用`;
      price = faceValue[1] / 100;
      break;
    default:
      break;
  }
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    new ClipboardJS('#copy-btn');
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [visible])
  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={() => { setVisible(false) }}
      footer={null}
    >
      <div className="coupon-wrapper">
        <div className="coupon-card">
          <div className="coupon-card__top">
            <div className="coupon-card__amount">
              <div className="price-symbol">
                <span className="symbol">¥</span>
                <span className="price">{price}</span>
              </div>
              <p>{msg}</p>
            </div>
            <div className="coupon-card__info">
              <div className="coupon-title">
                <span className="coupon-rule">{formatAvlRange(ruleVo.avlRange)}</span>{info.baseVO.name.slice(0, 20)}
              </div>
              <div className="coupon-date">{formatUseTime(ruleVo, 'YYYY.MM.DD', '-')}</div>
              {info.baseVO.description && <div className="coupon-range">
                <div className="coupon-range__text">{info.baseVO.description}</div>
                <span className={`arrow-icon ${isOpen ? 'bottom' : 'right'}`} onClick={handleClick}></span>
              </div>}
            </div>
          </div>
          {isOpen && info.baseVO.description && <div className="coupon-card__bottom">{info.baseVO.description}</div>}
        </div>
        <QRCode className="qr-code" size={240} value={`${h5Host}#/coupon/${info.baseVO && info.baseVO.id}/share`} />
        <div className="copy-qr-code">
          <Input id="copy-input" readOnly value={`${h5Host}#/coupon/${info.baseVO && info.baseVO.id}/share`} />
          <Button id="copy-btn" data-clipboard-target="#copy-input" className="ml10" type="primary">复制</Button>
        </div>
      </div>
    </Modal>
  );
}
export default CouponCard;