import React, {FC} from 'react';
import styles from './Frame.module.scss';

interface FrameProps {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const Frame: FC<FrameProps> = props => {
  return (
    <div onScroll={(evt) => {
      props.onScroll && props.onScroll(evt);
    }} className={styles.frame}>
      <div className={styles.frameInner}>
        {props.children}
      </div>
    </div>
  );
};

export default Frame;
