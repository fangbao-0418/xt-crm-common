interface Props {
  className?: string
  src: string
  style?: React.CSSProperties
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}
export default (props: Props) => React.ReactNode