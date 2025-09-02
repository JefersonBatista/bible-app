import styles from "./skeletonLoader.module.css";

function SkeletonLoader({ width = "100%", height = "1em" }) {
  return (
    <div
      className={styles.pulse}
      style={{
        backgroundColor: "#eee",
        borderRadius: "4px",
        width,
        height,
      }}
    />
  );
}

export default SkeletonLoader;
