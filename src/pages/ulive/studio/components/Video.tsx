import React from 'react'
import { TcPlayer } from '@/util/TcPlayer-module-2.3.2'
interface Props {
  detail: UliveStudio.ItemProps
  hide?: () => void
}
class Main extends React.Component<Props> {
  public componentDidMount () {
    this.initConfig()
  }
  public initConfig () {
    // const 
    const detail = this.props.detail
    let config = JSON.parse(localStorage.getItem('tc') || 'null')
    if (!detail.playUrl) {
      return
    }
    // http://xtliveqq.bizliveplay.myqcloud.com/live/203.flv?txSecret=fa0a64ea4bb23584cc1cdfce13a7ef7c&txTime=5E0ABBAB
    config = config ? config : {
      live: true,
      flv: detail.playUrl,
      // autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      // "poster": '',
      width:  '480', // 视频的显示宽度，请尽量使用视频分辨率宽度
      height: '320', // 视频的显示高度，请尽量使用视频分辨率高度
    }
    config.listener = (msg: any) => {
      // player.play()
      // console.log(msg, player, 'xxxx')
    }
    var player = new TcPlayer('id_test_video', config);
  }
  public render () {
    return (
      <div>
        <div id="id_test_video" style={{width: '100%', height: 'auto'}}></div>
      </div>
    )
  }
}
export default Main
