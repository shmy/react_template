import React, {FC} from 'react';
import Frame from "@/components/Frame/Frame";
import {Card, Pagination, Table} from "antd";
import {useRequest} from "@umijs/hooks";
import http from "@/utils/http";
import Dayjs from "dayjs";

const columns = [
  {
    title: '登录人',
    dataIndex: 'personnel_id',
    width: 120,
  },
  {
    title: '应用',
    dataIndex: 'application_id',
    width: 120,
  },
  {
    title: '结果',
    dataIndex: 'successful',
    width: 60,
    render: v => {
      return <span>{v ? '成功' : '失败'}</span>;
    }
  },
  {
    title: '时间',
    dataIndex: 'created_at',
    width: 200,
    render: v => {
      return <span>{Dayjs(v).format("YYYY-MM-DD HH:mm:ss")}</span>;
    }
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: 140,
  },
  {
    title: 'IP区域',
    dataIndex: 'region',
    width: 140,
  },
  {
    title: '终端',
    dataIndex: 'userAgent'
  }
];

interface LogProps {

}

const Log: FC<LogProps> = props => {
  const {data, loading, pagination} = useRequest(({current, pageSize}) => http.get('/v1/log', {
    params: {
      page: current,
      per_page: pageSize,
    }
  }), {
    manual: false,
    paginated: true,
    loadingDelay: 300,
    formatResult: (v: any) => {
      return {
        list: v.result,
        total: v.count,
      };
    },
    defaultLoading: true,
  });
  return (
    <Frame>
      <Card title={<span>登录日志</span>}>

        <Table tableLayout="fixed" loading={loading} size="small" bordered pagination={false} rowKey="id"
               dataSource={data?.list} columns={columns}/>
        <div style={{marginTop: '20px', textAlign: 'right'}}>
          <Pagination showTotal={total => <span>共{total}条</span>} disabled={loading} showQuickJumper
                      current={pagination.current} onChange={pagination.changeCurrent} total={pagination.total}/>
        </div>
      </Card>
    </Frame>
  );
};

export default Log;
