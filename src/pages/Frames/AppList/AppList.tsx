import React, {FC} from 'react';
import {useRequest} from "@umijs/hooks";
import http from "@/utils/http";
import {Row, Spin} from "antd";
import AppItem from "@/components/AppItem/AppItem";
import Frame from "@/components/Frame/Frame";

interface AppListProps {

}

const AppList: FC<AppListProps> = props => {
  const {data, loading, refresh} = useRequest<any>(() => http.get('/v1/personnel/apps'),);
  return (
    <Frame>
      <Row style={{marginTop: '10px'}} gutter={[16, 16]}>
        {(data || []).map(app => {
          return (
            <AppItem key={app.id} app={app} manageable={false}/>
          );
        })}
      </Row>
      <div style={{textAlign: 'center'}}><Spin spinning={loading} delay={300}/></div>
    </Frame>
  );
};

export default AppList;
