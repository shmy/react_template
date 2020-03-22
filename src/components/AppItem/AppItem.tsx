import React, {FC, useMemo} from 'react';
import {Avatar, Button, Card, Col} from "antd";
import {SERVER_STATIC_PATH} from "@/components/SingleImageUpload/SingleImageUpload";
import styles from "./AppItem.module.scss";
import {LoginOutlined, SettingOutlined} from '@ant-design/icons';
import history from "@/utils/history";

interface AppItemProps {
  app: {
    id: number;
    name: string;
    logo_url: string;
    intro: string;
  };
  manageable: boolean;
}

const AppItem: FC<AppItemProps> = ({app, manageable}) => {
  const actions = useMemo(() => {
    const result = [<Button type="link" onClick={() => handleEnter(app.id)}><LoginOutlined/>进入</Button>];
    if (manageable) {
      result.push(<Button type="link" onClick={() => {
        history.push('application/' + app.id.toString());
      }}><SettingOutlined/>管理</Button>)
    }
    return result;
  }, [manageable]);
  const handleEnter = id => {
    const token = window.localStorage.getItem("token");
    window.open(`/sso/${id}/${token}?t=${Date.now()}`);
  };
  return (
    <Col key={app.id} xs={24} sm={12} md={8} lg={6} xxl={4}>
      <Card actions={actions} hoverable>
        <div>
          <Avatar size="large"
                  src={SERVER_STATIC_PATH + app.logo_url}/>
          <span className={styles.appTitle}>{app.name}</span>
        </div>
        <p className={styles.appIntro}>{app.intro}</p>
      </Card>
    </Col>
  );
};

export default AppItem;
