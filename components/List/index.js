import styles from './list.module.css'

export default function List({ title, items, value, handleChange }) {
  return (
    <div className={styles.list}>
      <label className={styles.title}>{title}</label>
        <select value={value} onChange={handleChange}>
          {items.map(item =>
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          )}
        </select>
    </div>
  )
}
