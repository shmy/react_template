import React, {FC, forwardRef, useImperativeHandle, useMemo, useRef, useState} from 'react';
import Frame from "@/components/Frame/Frame";
import {Avatar, Button, Card, Col, Form, Input, message as AntMessage, Modal, Row, Spin, Switch} from "antd";
import styles from "./Application.module.scss";
import {SearchOutlined, LoginOutlined, SettingOutlined} from '@ant-design/icons';
import {RouteComponentProps} from "react-router-dom";
import {useDebounce, useRequest} from "@umijs/hooks";
import http from "@/utils/http";
import {fields, initialValues} from "@/pages/Frames/Application/BasicSetting";
import {SERVER_STATIC_PATH} from "@/components/SingleImageUpload/SingleImageUpload";

const ApplicationModal = (props: { onAdded: () => void }, ref) => {
  const [visible, setVisible] = useState(false);
  const {loading, error, run} = useRequest((data) => http.post('/v1/app', data), {
    manual: true,
  });
  const handleSubmit = (values) => {
    run(values).then(() => {
      AntMessage.success('添加成功');
      setVisible(false);
      props.onAdded();
    });
  };
  useImperativeHandle(ref, () => {
    return {
      open() {
        setVisible(true);
      }
    }
  });
  return (
    <Modal title="添加应用"
           keyboard={!loading}
           maskClosable={!loading}
           closable={!loading}
           destroyOnClose
           visible={visible}
           onCancel={() => setVisible(false)}
           footer={null}
    >
      <Form onFinish={handleSubmit} initialValues={initialValues} layout="horizontal">
        <Spin spinning={loading} delay={300}>
          {fields.map(field => {
            return (
              <Form.Item validateFirst rules={field.rules} key={field.name} name={field.name} label={field.label}
                         valuePropName={field.valuePropName || 'value'}>
                {field.render()}
              </Form.Item>
            );
          })}
          <Form.Item style={{textAlign: 'right'}}>
            <Button htmlType="submit" type="primary">确定</Button>
            <Button style={{marginLeft: '20px'}} onClick={() => setVisible(false)}>取消</Button>
          </Form.Item>
        </Spin>
      </Form>
    </Modal>
  );
};
const ApplicationModalWithForward = forwardRef(ApplicationModal);

const Application: FC<RouteComponentProps> = props => {
  const {data, loading, refresh} = useRequest(() => http.get('/v1/app'));
  const [keyword, setKeyword] = useState();
  const debouncedValue = useDebounce(keyword, 300);
  const ref = useRef<{ open: () => void } | null>(null);
  const filteredItems = useMemo(() => {
    if (!data) {
      return [];
    }
    if (!debouncedValue) {
      return data;
    }
    return (data as any).filter(item => item.name.indexOf(debouncedValue) !== -1);
  }, [debouncedValue, data]);
  const handleClick = () => {
    if (ref.current) {
      ref.current.open();
    }
  };
  return (
    <Frame>
      <ApplicationModalWithForward onAdded={refresh} ref={ref}/>
      <Card>
        <Button onClick={handleClick} type="primary">添加应用</Button>
        <Input value={keyword} onChange={(e: any) => setKeyword(e.target.value)} prefix={<SearchOutlined/>}
               style={{width: '300px', marginLeft: '20px'}} placeholder="搜索应用" allowClear/>
      </Card>
      <Row style={{marginTop: '10px'}} gutter={[16, 16]}>
        {filteredItems.map(app => {
          return (
            <Col key={app.id} xs={24} sm={12} md={8} lg={6} xxl={4}>
              <Card actions={[
                <Button type="link" onClick={() => {
                  window.open(app.url + '?access_token=dsakj12hydsajkhsfdkjh');
                }}><LoginOutlined/>进入</Button>,
                <Button type="link" onClick={() => {
                  props.history.push('application/' + app.id.toString());
                }}><SettingOutlined/>管理</Button>
              ]} hoverable>
                <div>
                  <Avatar size="large"
                          src={SERVER_STATIC_PATH + app.logoUrl}/>
                  <span className={styles.appTitle}>{app.name}</span>
                </div>
                <p className={styles.appIntro}>{app.intro}</p>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div style={{textAlign: 'center'}}><Spin spinning={loading} delay={300}/></div>

    </Frame>
  );
};

export default Application;
