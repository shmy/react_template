import React, {FC, useMemo} from 'react';
import Frame from "@/components/Frame/Frame";
import {Card, Tabs} from "antd";
import BasicSetting from "@/pages/Frames/Application/BasicSetting";
import {RouteComponentProps} from 'react-router-dom';
import PolicySetting from "@/pages/Frames/Application/PolicySetting";
import PeopleSetting from "@/pages/Frames/Application/PeopleSetting";

interface DetailProps extends RouteComponentProps<{ id: string }> {

}

const Detail: FC<DetailProps> = props => {
  const id: number = useMemo(() => {
    return +props.match.params.id;
  }, [props.match]);
  return (
    <Frame>
      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基本设置" key="1">
            <BasicSetting id={id}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="人员设置" key="2">
            <PeopleSetting id={id}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="角色权限" key="3">
            <PolicySetting id={id}/>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Frame>
  );
};

export default Detail;
