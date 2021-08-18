import styles from './list.module.css'

// I need to replace the item with a selection of item
export default function List({ title, item }) {
  return (
    <div className={styles.list}>
      <div className={styles.title}>{title}</div>
      <div>{item}</div>
    </div>
  )
}
