import { Props } from './index'
class Data {
  props: Props
  pressedEl: HTMLElement | undefined
  pressed = false
  tempEl: HTMLElement | undefined
  $wrapperEl: HTMLElement | null = null
  position: DOMRect[] = []
  wrapClassName: string = ''
  movedIndex = -1
  public constructor (props: Props) {
    this.props = props
    this.wrapClassName = (props.className || '-draggabled') + '-wrapper'
  }
  /**
   * 鼠标按下时 获取位置序列
   */
  public handleMouseDown (e: any) {
    this.$wrapperEl = document.querySelector(`.${this.wrapClassName}`)
    if (!(this.$wrapperEl && this.$wrapperEl.contains(e.target))) {
      return
    }
    e.preventDefault()
    const target = e.target
    console.log(this, 'this')
    this.pressedEl = this.getSelectEl(target)
    this.pressed = true
    if (this.pressedEl) {
      this.getAllPosition()
      this.pressedEl.className = ((this.pressedEl.className || '') + ' dragging').replace(/dragging/g, 'dragging')
      this.createTempEl()
    }
  }
  public handleMouseUp () {
    this.pressed = false
    if (!this.pressedEl) {
      return
    }
    this.pressedEl.className = this.pressedEl.className && this.pressedEl.className.replace(/dragging/g, '')
    if (this.tempEl && document.body.contains(this.tempEl)) {
      document.body.removeChild(this.tempEl)
    }
  }
  /**
   * 鼠标移动时 获取位置索引
   */
  public handleMouseMove (e: any) {
    if (!this.pressed || !this.pressedEl || !this.tempEl) {
      return
    }
    const { pageX, pageY } = e
    let { width, height } = getComputedStyle(this.pressedEl)
    const x = pageX - parseInt(width || '') / 2
    const y = pageY - parseInt(height || '') / 2
    this.getMovedIndex(pageX, pageY)
    this.tempEl.setAttribute('style', `position:absolute;left:${x}px;top:${y}px;width:${width};height:${height}`)
  }
  /** 创建临时元素 */
  public createTempEl () {
    if (!this.pressedEl) {
      return
    }
    const tempEl = document.createElement('div')
    const { x, y } = (this.pressedEl as HTMLElement).getBoundingClientRect() as DOMRect
    const { width, height } = getComputedStyle(this.pressedEl as HTMLElement)
    tempEl.className = this.props.className || ''
    tempEl.setAttribute('style', `user-select:none;position:absolute;left:${x}px;top:${y}px;width:${width};height:${height}`)
    tempEl.appendChild(this.pressedEl.cloneNode(true))
    document.body.appendChild(tempEl)
    this.tempEl = tempEl
  }
  public getAllPosition () {
    const { dragElement } = this.props
    const selector = '.'+ this.wrapClassName + ' ' + dragElement
    const draggabledElements = document.querySelectorAll(selector)
    this.position = []
    draggabledElements.forEach((item, index) => {
      this.position.push(item.getBoundingClientRect() as DOMRect)
    })
  }
  public getMovedIndex (x: number, y: number) {
    let isBefore = true
    // console.log(x, y, this.position, 'position')
    let tempIndex = -1
    let index = this.position.findIndex((item, I) => {
      const cx = item.x + item.width / 2
      const cy = item.y
      if (y > cy && y < cy + item.height) {
        if (x < cx) {
          isBefore = true
          return true
        } else {
          tempIndex = I
          isBefore = false
        }
      }
    })
    index = isBefore ? index : tempIndex + 1
    if (index === -1) return
    this.movedIndex = index
    if (this.pressedEl && this.pressedEl.parentElement && this.movedIndex > -1) {
      this.pressedEl.parentElement.insertBefore(this.pressedEl, this.pressedEl.parentElement.children[this.movedIndex])
      for (let j = 0; j < this.pressedEl.parentElement.children.length; j++) {
        const child =  this.pressedEl.parentElement.children[j] as HTMLElement
        const { top, left} = child.getBoundingClientRect() as DOMRect
        console.log(left, top, 'xxxx', child, 'xxxx')
        child.setAttribute('data-style', `${top}px;left:${left}px;`)
        // child.setAttribute('style', child.getAttribute('style')+`position:fixed;top:${top}px;left:${left}px;`)
      }
    }

    return this.movedIndex
  }
  public getSelectEl (el: any): HTMLElement | undefined {
    const { type, value } = this.getdragElementInfo()
    const id = el.id
    if (typeof el.className !== 'string') {
      console.warn('draggable element is not a valid element')
      return
    }
    const className = (el.className || '').split(/\s+/)
    const parentEl = el.parentElement
    if (id && type === 'id' && id.indexOf(value) > -1) {
      return el
    } else if (className && type === 'class' && className.indexOf(value) > -1) {
      return el
    } else if (parentEl.nodeName === 'BODY') {
      console.warn('draggable element not found')
      return
    } else {
      return this.getSelectEl(parentEl)
    }
  }
  public getdragElementInfo () {
    const { dragElement } = this.props
    const obj: {type: 'id' | 'class', value: string} = {
      type: 'id',
      value: ''
    }
    if (/^#/.test(dragElement)) {
      obj.type = 'id'
      obj.value = dragElement.replace(/^#/, '')
    } else if (/^\./.test(dragElement)) {
      obj.type = 'class'
      obj.value = dragElement.replace(/^\./, '')
    }
    return obj
  }
}
export default Data

