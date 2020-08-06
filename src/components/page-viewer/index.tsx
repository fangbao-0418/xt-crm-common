import React, { useRef, useEffect } from 'react'
import Viewer from 'viewerjs'

interface Props {
  el: HTMLElement
}

const pattern = /\.(png|jpe?g|gif)/

class PageViewer extends React.Component<Props> {
  public componentDidMount () {
    this.view()
  }
  public componentDidUpdate () {
    this.view()
  }
  public view () {
    const el = this.props.el
    if (!el) {
      return
    }
    try {
      const els = document.querySelectorAll<HTMLAnchorElement>('.ant-upload-list-item-actions>a')
      let i = 0
      els?.forEach?.((c) => {
        if (pattern.test(c.href)) {
          (function (index) {
            c.onclick = function (e: Event) {
              e.preventDefault?.()
              e.stopPropagation?.()
              const viewer = new Viewer(el, {
                filter(image: HTMLImageElement) {
                  return pattern.test(image.src)
                },
                hide () {
                  viewer.destroy()
                }
              })
              viewer.view(index)
            }
          })(i)
          i++
        }
      })
    } catch (e) {
      APP.error(e)
    }
  }
  public render () {
    return null
  }
}
export default PageViewer
