import React, {FC, useEffect, useRef} from 'react';
import {Button, Form, Input} from "antd";
import styles from './Login.module.scss';
import {RouteComponentProps} from "react-router-dom";
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";

const Login: FC<RouteComponentProps> = props => {
  const {run, loading} = useRequest<AfterResponse<any>>((username, password) => http.post("/login", {
    username,
    password
  }), {
    manual: true,
    loadingDelay: 300,
  });
  const inputRef = useRef<Input>(null);
  const handleSubmit = (values) => {
    run(values.username, values.password).then(result => {
      if (isHttpError(result)) {
        result.showAlert();
        return;
      }
      window.localStorage.setItem('token', result.token);
      props.history.replace('/');
    });
  };
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);
  return (
    <div className={styles.loginPage}>
      <div className={styles.login}>
        <Form size="large" onFinish={handleSubmit}>
          <h1 style={{textAlign: 'center'}}>建华旅游单点登录系统</h1>
          <Form.Item name="username" rules={[{required: true, message: '请输入账户'}]}>
            <Input ref={inputRef} placeholder="请输入账户"/>
          </Form.Item>
          <Form.Item name="password" rules={[{required: true, message: '请输入密码'}]}>
            <Input type="password" placeholder="请输入密码"/>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType="submit" block type="primary">立即登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
