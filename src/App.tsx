import React from "react";
import Router from "./routes";
import styles from "./app.module.css";
function App() {
  return (
    <main className={styles.wrapper}>
      <Router />
    </main>
  );
}

export default App;
