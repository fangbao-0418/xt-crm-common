import React from 'react'
// import { TcPlayer } from '@/util/TcPlayer-module-2.3.2'
interface Props {
  hide?: () => void
}
class Main extends React.Component<Props> {
  public componentDidMount () {
    console.log(TcPlayer)
    var player = new TcPlayer('id_test_video', {
      // live: true,
      // "m3u8": "http://200002949.vod.myqcloud.com/200002949_b6ffc.f240.m3u8", //请替换成实际可用的播放地址
      "rtmp": "rtmp://xtliveqq.bizlivepush.myqcloud.com/live/100000000000000?txSecret=7c4114ad1c9164d893d22a19d07b8d0b&txTime=5E01CCE8",
      "flv": "http://xtliveqq.bizliveplay.myqcloud.com/live/100000000000000.flv?txSecret=49e36e59a8b505dc651b068b25865926&txTime=5E01CCE8",
      // "autoplay" : true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      "poster" : "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551572091333939.png",
      "width" :  '480', //视频的显示宽度，请尽量使用视频分辨率宽度
      "height" : '320', //视频的显示高度，请尽量使用视频分辨率高度,
      "listener": (msg: any) => {
        // player.play()
        console.log(msg, player, 'xxxx')
      },
      "flash": false
    });
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
