import React from 'react';
import logo from "@/assets/logo.png";
import styles from "@/App.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src={logo} alt=""/>
      <h3>Hello React</h3>
    </div>
  );
};

export default App;
