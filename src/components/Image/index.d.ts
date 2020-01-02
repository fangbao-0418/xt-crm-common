interface Props {
  className?: string
  src: string | undefined
  style?: React.CSSProperties
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
  onClick?: () => void
}
export default (props: Props) => React.ReactNode