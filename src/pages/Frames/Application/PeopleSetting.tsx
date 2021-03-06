import React, {FC, forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";
import {message as AntMessage, Button, Card, Form, Modal, Select, Table, Checkbox, Spin, Popconfirm} from "antd";
import {columns} from "@/pages/Frames/Personnel/Personnel";
import {PlusOutlined} from '@ant-design/icons';
import {getRequiredRule} from "@/rules";
import allSettled from "promise.allsettled";

interface PeopleSettingProps {
  id: number;
}

const PeopleModal = (props: { appId: number, onComplete: () => void }, ref) => {
  const [visible, setVisible] = useState(false);
  const {data, loading, run} = useRequest<AfterResponse<any>>(() => http.get('/v1/personnel/option'), {
    manual: true,
  });
  const {run: submitRun, loading: submitting} = useRequest((appId: number, ids: number[]) => {
    return allSettled(ids.map((id) => {
      return http.post("/v1/app/" + appId + "/personnel", {id});
    }))
  }, {
    manual: true,
  });
  const [form] = Form.useForm();
  const isLoading = loading || submitting;
  const handleSubmit = (values) => {
    submitRun(props.appId, values.people).then(result => {
      const rejects: any[] = [];
      result.forEach((item, index) => {
        if (item.status === "rejected") {
          rejects.push(values.people[index]);
        }
      });
      if (rejects.length === values.people.length) {
        AntMessage.warning('全部添加失败！');
      } else if (rejects.length > 0) {
        form.setFieldsValue({
          people: rejects
        });
        AntMessage.warning('部分添加成功，你可以继续尝试！');
        props.onComplete();
      } else {
        setVisible(false);
        AntMessage.success('添加成功！');
        props.onComplete();
      }
    });
  };
  useImperativeHandle(ref, () => {
    return {
      open() {
        run();
        setVisible(true);
        form.resetFields();
      },
    };
  });
  return (
    <Modal title={'添加人员'}
           keyboard={!isLoading}
           maskClosable={!isLoading}
           closable={!isLoading}
           forceRender
           visible={visible}
           onCancel={() => setVisible(false)}
           footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="horizontal">
        <Form.Item name="people" rules={[getRequiredRule("人员", false)]} label="人员">
          <Select placeholder="请选择人员" mode="multiple" filterOption={(input, option) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
            {(data || []).map(item => {
              return (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {/*<Form.Item name="object" rules={[getRequiredRule("对象")]} label="对象">*/}
        {/*  <Input placeholder="对象"/>*/}
        {/*</Form.Item>*/}
        {/*<Form.Item name="action" rules={[getRequiredRule("动作")]} label="动作">*/}
        {/*  <Input placeholder="动作"/>*/}
        {/*</Form.Item>*/}
        <Form.Item style={{textAlign: 'right'}}>
          <Button loading={isLoading} htmlType="submit" type="primary">提交</Button>
          <Button disabled={isLoading} style={{marginLeft: '20px'}} onClick={() => setVisible(false)}>取消</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const PeopleModalWithForward = forwardRef(PeopleModal);

const CheckboxComponent: FC<{ onChange: () => void; label: string, value: boolean }> = props => {
  return (
    <div style={{padding: '10px 0'}}>
      <Checkbox checked={props.value} onChange={props.onChange}>{props.label}</Checkbox>
    </div>
  );
};
const RoleModal = (props: { appId: number }, ref) => {
  const [visible, setVisible] = useState(false);
  const [personnelId, setPersonnelId] = useState(0);
  const {data, mutate, loading, run} = useRequest<AfterResponse<any>>((appId, personnelId) => http.get(`/v1/app/${appId}/personnel/${personnelId}/role`), {
    manual: true,
    loadingDelay: 300,
  });
  const {run: createRun, loading: createLoading} = useRequest<AfterResponse<any>>((appId: number, personnelId: number, name: string) => {
    return http.post(`/v1/app/${appId}/personnel/${personnelId}/role`, {name});
  }, {
    manual: true,
    loadingDelay: 300,
  });
  const {run: removeRun, loading: removeLoading} = useRequest<AfterResponse<any>>((appId: number, personnelId: number, name: string) => {
    return http.delete(`/v1/app/${appId}/personnel/${personnelId}/role`, {params: {name}});
  }, {
    manual: true,
    loadingDelay: 300,
  });
  const isLoading = loading || createLoading || removeLoading;
  const handleChange = (item, index: number) => {
    const fn = !item.value ? () => createRun(props.appId, personnelId, item.label) : () => removeRun(props.appId, personnelId, item.label);
    fn().then(result => {
      if (result === true) {
        mutate(data => {
          data[index].value = !item.value;
          return data;
        });
      }
    });
  };
  useImperativeHandle(ref, () => {
    return {
      open(personnelId) {
        setPersonnelId(personnelId);
        setVisible(true);
        run(props.appId, personnelId);
      },
    };
  });
  return (
    <Modal title="分配角色"
           keyboard={!isLoading}
           maskClosable={!isLoading}
           closable={!isLoading}
           forceRender
           visible={visible}
           onCancel={() => setVisible(false)}
           footer={null}
    >
      <Spin spinning={isLoading}>
        {(data || []).map((item, index) => {
          return (
            <CheckboxComponent onChange={() => handleChange(item, index)} key={item.label} value={item.value}
                               label={item.label}/>
          );
        })}
      </Spin>
    </Modal>
  );
};
const RoleModalWithForward = forwardRef(RoleModal);

const PeopleSetting: FC<PeopleSettingProps> = props => {
  const {data, refresh} = useRequest(() => http.get('/v1/app/' + props.id + '/personnel'));
  const {run: removeRun} = useRequest<AfterResponse<any>>((personnelId) => http.delete('/v1/app/' + props.id + '/personnel', {params: {id: personnelId}}), {manual: true});
  const ref = useRef<{ open: () => void }>(null);
  const ref2 = useRef<{ open: (id: number) => void }>(null);
  const handleRemove = id => {
    removeRun(id).then(result => {
      if (isHttpError(result)) {
        result.showAlert();
        return;
      }
      refresh();
    });
  };
  return (
    <div>
      <PeopleModalWithForward onComplete={refresh} appId={props.id} ref={ref}/>
      <RoleModalWithForward appId={props.id} ref={ref2}/>
      <Card extra={
        <>
          <Button onClick={() => ref.current && ref.current.open()} type="primary"><PlusOutlined/>添加人员</Button>
        </>
      }
            style={{marginTop: '20px'}}>
        <Table size="small" bordered pagination={false} rowKey={row => row.id}
               dataSource={data as any}
               columns={[
                 ...columns,
                 {
                   title: '操作',
                   width: 140,
                   render: (row) => {
                     return (
                       <>
                         <Button onClick={() => ref2.current && ref2.current.open(row.id)} type="link">管理</Button>
                         <Popconfirm onConfirm={() => handleRemove(row.id)} title={<span>确实要移除吗？</span>} >
                           <Button type="link">移除</Button>
                         </Popconfirm>
                       </>
                     );
                   }
                 }
               ] as any}/>
      </Card>
    </div>
  );
};

export default PeopleSetting;
