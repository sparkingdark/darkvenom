// @flow
import type { Element } from 'react'

import styles from './styles.module.css'

type Props = {
  image: string,
  lqpiImage: string,
  title: string
}

const FeaturedImage = (props: Props): Element<'header'> => (
  <header className={styles.header}>
    <img
      alt={props.title}
      className={`lazyload ${styles.image}`}
      data-src={props.image}
      title={props.title}
      src={props.lqpiImage}
    />
  </header>
)

export default FeaturedImage
