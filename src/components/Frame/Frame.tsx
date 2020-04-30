import React, {FC} from 'react';
import styles from './Frame.module.scss';

interface FrameProps {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const Frame: FC<FrameProps> = props => {
  const handleScroll = (evt) => {
    props.onScroll && props.onScroll(evt);
  };
  return (
    <div onScroll={handleScroll} className={styles.frame}>
      <div className={styles.frameInner}>
        {props.children}
      </div>
    </div>
  );
};

export default Frame;
