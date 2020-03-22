import React, {FC} from 'react';
import {Button, Form, Input} from "antd";
import styles from './Login.module.scss';
import {RouteComponentProps} from "react-router-dom";
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";

const Login: FC<RouteComponentProps> = props => {
  const {run} = useRequest<AfterResponse<any>>((username, password) => http.post("/login", {
    username,
    password
  }), {manual: true});

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
  return (
    <div className={styles.login}>
      <Form onFinish={handleSubmit}>
        <h1 style={{textAlign: 'center'}}>建华旅游单点登录系统</h1>
        <Form.Item name="username" rules={[{required: true, message: '请输入账户'}]} label="账户">
          <Input placeholder="请输入账户"/>
        </Form.Item>
        <Form.Item name="password" rules={[{required: true, message: '请输入密码'}]} label="密码">
          <Input type="password" placeholder="请输入密码"/>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block type="primary">立即登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
