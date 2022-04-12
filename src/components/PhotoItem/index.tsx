import * as style from './styles'

type Props = {
  url: string;
  name: string;
}

export const PhotoItem = ({url, name}: Props) => {
  return (
    <style.Container>
      <img src={url} alt={name} />
    </style.Container>
  )
}
