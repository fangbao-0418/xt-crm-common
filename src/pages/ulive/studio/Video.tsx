import React from 'react'
import { parseQuery } from '@/packages/common/utils'
class Main extends React.Component<{}> {
  public player: any
  public componentDidMount () {
    this.initConfig()
  }
  public componentWillUnmount () {
    if (this.player) {
      console.log(this.player, '-----')
      // this.player.pause()
      this.player.destroy()
    }
  }
  public initConfig () {
    // const 
    const query = parseQuery() || {};
    // console.log(query, '----')
    const detail = {
      playUrl: query.playUrl,
      liveCoverUrl: query.liveCoverUrl
    }
    let config = JSON.parse(localStorage.getItem('tc') || 'null')
    if (!detail.playUrl) {
      return
    }
    const https = /https/.test(window.location.origin) ? true : false
    // const playUrl = (detail.playUrl || '').replace(/https?:\/\//, https ? 'https://' : 'http://')
    const playUrl = (detail.playUrl || '')
    // http://xtliveqq.bizliveplay.myqcloud.com/live/203.flv?txSecret=fa0a64ea4bb23584cc1cdfce13a7ef7c&txTime=5E0ABBAB
    config = {
      posterImage: true,
      live: true,
      m3u8: playUrl.replace('.flv', '.m3u8'),
      flv: playUrl,
      // autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      poster: detail.liveCoverUrl,
      width:  '100%', // 视频的显示宽度，请尽量使用视频分辨率宽度
      height: '100%', // 视频的显示高度，请尽量使用视频分辨率高度
    }
    config.listener = (msg: any) => {
      // this.player.play()
      // console.log(msg, player, 'xxxx')
    }
    this.player = new TcPlayer('id_test_video', config);
  }
  public render () {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div id="id_test_video" style={{width: '100%', height: '100%'}}></div>
      </div>
    )
  }
}
export default Main
