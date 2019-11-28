declare module HomeIcon {
  export interface ItemProps {
    id: any
    title: string
    imgUrl?: string | Array<{uid: string, url: string}>
    sort: number,
    platform: number,
    platformArray?: Array
  }
}