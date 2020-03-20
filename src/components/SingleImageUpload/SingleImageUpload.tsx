import React, {FC, useEffect, useRef, useState} from 'react';
import {useRequest} from "@umijs/hooks";
import http from "@/utils/http";
import styles from "./SingleImageUpload.module.scss";
import {Spin} from "antd";
import {PlusOutlined} from '@ant-design/icons';

export const SERVER_STATIC_PATH = '/static/';
interface SingleImageUploadProps {
  value?: string;
  onChange?: (s: string) => void;
}

const SingleImageUpload: FC<SingleImageUploadProps> = props => {
  const {run, loading} = useRequest((fd: FormData) => http.post('/v1/upload/file', fd), {
    manual: true,
  });
  const [value, setValue] = useState<string>('');
  const ref = useRef<HTMLInputElement>(null);
  const setValueAndNotify = (value: string) => {
    setValue(value);
    props.onChange && props.onChange(value);
  };
  const handleFileChange = e => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    e.target.value = '';
    const fd = new FormData();
    fd.append('file', file);
    run(fd).then((result: any) => {
      setValueAndNotify(result);
    })
  };
  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);
  let content = (
    <>
      <PlusOutlined className={styles.placeholder} />
      <input accept="image/*" onChange={handleFileChange} ref={ref} type="file"/>
    </>
  );
  if (loading) {
    content = <Spin className={styles.spinner} spinning />;
  }
  if (value) {
    content = <img onClick={() => setValueAndNotify('')} src={SERVER_STATIC_PATH + value} alt=""/>;
  }
  return (
    <div className={styles.upload}>
      {content}
    </div>
  );
};

export default SingleImageUpload;
