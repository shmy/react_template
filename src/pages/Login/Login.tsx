import React from 'react';
import {Button, Form, Input} from "antd";
import styles from './Login.module.scss';

const Login: React.FC = props => {
  const handleSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className={styles.login}>
      <Form onFinish={handleSubmit}>
        <h3>欢迎登录</h3>
        <Form.Item name="username" rules={[{required: true, message: '请输入账户'}]} label="账户">
          <Input placeholder="请输入账户" />
        </Form.Item>
        <Form.Item name="password" rules={[{required: true, message: '请输入密码'}]} label="密码">
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block type="primary">立即登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
