import React from 'react'
import { TcPlayer } from '@/util/TcPlayer-module-2.3.2'
interface Props {
  hide?: () => void
}
class Main extends React.Component<Props> {
  public componentDidMount () {
    console.log(TcPlayer)
    var player = new TcPlayer('id_test_video', {
      "m3u8": "http://2157.liveplay.myqcloud.com/2157_358535a.m3u8", //请替换成实际可用的播放地址
      "autoplay" : true,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      "poster" : "http://www.test.com/myimage.jpg",
      "width" :  '480',//视频的显示宽度，请尽量使用视频分辨率宽度
      "height" : '320'//视频的显示高度，请尽量使用视频分辨率高度
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
