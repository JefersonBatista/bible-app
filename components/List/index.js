import styles from './list.module.css'

export default function List({ selRef, title, items, handleChange }) {
  return (
    <div className={styles.list}>
      {/* <label htmlFor={id} className={styles.title}>{title}</label> */}
      <label className={styles.title}>{title}</label>
        <select ref={selRef} onChange={handleChange}>
          {items.map(item =>
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          )}
        </select>
    </div>
  )
}
