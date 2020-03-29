import React, {FC, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";
import {Button, Form, Input, Modal, Table, message as AntMessage, Card, Checkbox, Spin} from "antd";
import {getRequiredRule} from "@/rules";
import {PlusOutlined, ExportOutlined, ImportOutlined} from '@ant-design/icons';
import FileSaver from "file-saver";
import PolicyCheckbox from "@/components/PolicyCheckbox/PolicyCheckbox";
import {layout} from "@/pages/Frames/Application/BasicSetting";

const PolicyModal = (props: { appId: number, onComplete: () => void }, ref) => {
  const [visible, setVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {loading, run} = useRequest<AfterResponse<any>>((appId, data) => http.post('/v1/policy/' + appId + '/import', data), {
    manual: true,
  });
  const {loading: fetchLoading, run: fetchRun} = useRequest<AfterResponse<any>>((appId, role) => http.get('/v1/policy/' + appId + '/oc_by_role', {params: {role}}), {
    manual: true,
  });
  const {loading: updateLoading, run: updateRun} = useRequest<AfterResponse<any>>((appId, data) => http.put('/v1/policy/' + appId + '/update_by_role', data), {
    manual: true,
  });
  const beforeData = useRef<string[]>([]);
  const [form] = Form.useForm();
  const isLoading = loading || updateLoading || fetchLoading;
  const handleSubmit = (values) => {
    if (isEditMode) {
      const deleted: {object: string; action: string;}[] = [];
      const created: {object: string; action: string;}[] = [];
      beforeData.current.forEach(item => {
        if (_.findIndex(values.policy, curr => curr === item) === -1) {
          const [object, action] = item.split(' ');
          deleted.push({object, action});
        }
      });
      values.policy.forEach(item => {
        if (_.findIndex(beforeData.current, curr => curr === item) === -1) {
          const [object, action] = item.split(' ');
          created.push({object, action});
        }
      });
      updateRun(props.appId, {subject: values.subject, deleted, created}).then(result => {
        if (isHttpError(result)) {
          result.showAlert();
          return;
        }
        props.onComplete();
        setVisible(false);
      });
    } else {
      const result = values.policy.map((key: string) => {
        const [object, action] = key.split(' ');
        return {
          subject: values.subject,
          object,
          action,
        };
      });
      run(props.appId, result).then(result => {
        if (isHttpError(result)) {
          result.showAlert();
          return;
        }
        props.onComplete();
        setVisible(false);
        return;
      });
    }
  };
  useImperativeHandle(ref, () => {
    return {
      open() {
        beforeData.current = [];
        form.resetFields();
        setIsEditMode(false);
        setVisible(true);
      },
      openEdit(roleName: string) {
        beforeData.current = [];
        form.resetFields();
        fetchRun(props.appId, roleName).then((data) => {
          if (isHttpError(data)) {
            return;
          }
          beforeData.current = data;
          form.setFieldsValue({subject: roleName, policy: data});
        });
        setIsEditMode(true);
        setVisible(true);
      }
    };
  });
  return (
    <Modal title={(!isEditMode ? '添加' : '编辑') + '角色权限'}
           keyboard={!isLoading}
           maskClosable={!isLoading}
           closable={!isLoading}
           forceRender
           visible={visible}
           onCancel={() => setVisible(false)}
           footer={null}
    >
      <Spin spinning={isLoading}>
        <Form {...layout} form={form} initialValues={{policy: []}} onFinish={handleSubmit} layout="horizontal">
          <Form.Item name="subject" rules={[getRequiredRule("角色")]} label="角色">
            <Input disabled={isEditMode} placeholder="角色"/>
          </Form.Item>
          <Form.Item name="policy" rules={[getRequiredRule("权限", false)]} label="选择权限">
            <PolicyCheckbox appId={props.appId}/>
          </Form.Item>
          <Form.Item style={{textAlign: 'right'}}>
            <Button loading={isLoading} htmlType="submit" type="primary">提交</Button>
            <Button disabled={isLoading} style={{marginLeft: '20px'}} onClick={() => setVisible(false)}>取消</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
const PolicyModalWithForward = forwardRef(PolicyModal);

const columns = [
  {
    title: '角色',
    dataIndex: 'subject',
  },
];

interface PolicySettingProps {
  id: number;
}

const PolicySetting: FC<PolicySettingProps> = props => {
  const {data, refresh} = useRequest(() => http.get('/v1/policy/' + props.id));
  const {run: importRun} = useRequest((data) => http.post('/v1/policy/' + props.id + '/import', data), {manual: true});
  const {run: removeRun} = useRequest((role) => http.delete('/v1/policy/' + props.id + '/remove', {params: {role}}), {manual: true});
  const ref = useRef<{
    open: () => void,
    openEdit: (roleName: string) => void,
  }>(null);
  const handleRemove = (roleName: string) => {
    removeRun(roleName).then(() => {
      refresh();
    });
  };
  const handleOpenModal = () => {
    if (ref.current) {
      ref.current.open();
    }
  };
  const handleExport = async () => {
    const data = await http.get('/v1/policy/' + props.id + '/export');
    const blob = new Blob([JSON.stringify(data)], {type: "application/json;charset=utf-8"});
    FileSaver.saveAs(blob, `policy-${props.id}-${Date.now()}.json`);
  };
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    e.target.value = '';
    const fr = new FileReader();
    fr.onload = function () {
      if (this.result) {
        importRun(JSON.parse(this.result as string)).then(() => {
          refresh();
        });
      }
    };
    fr.onerror = function () {
      AntMessage.warning('导入失败');
    };
    fr.readAsText(file, 'utf-8');
  };
  return (
    <div>
      <PolicyModalWithForward onComplete={refresh} appId={props.id} ref={ref}/>
      <Card extra={<>
        <Button type="primary" onClick={handleOpenModal}><PlusOutlined/>添加角色&权限</Button>
        <Button onClick={handleExport} style={{marginLeft: '10px'}} type="primary"><ExportOutlined/>导出</Button>
        <Button style={{position: 'relative', marginLeft: '10px', overflow: 'hidden'}}
                type="primary"><ImportOutlined/>导入
          <input style={{opacity: '0', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 0}}
                 onChange={handleFileChange}
                 accept="application/json"
                 type="file"/>
        </Button>
      </>}>

        <Table size="small" bordered pagination={false} rowKey={row => row.subject}
               dataSource={data as any}
               columns={[
                 ...columns,
                 {
                   title: '操作',
                   width: 140,
                   align: 'center',
                   render: (row) => {
                     return (
                       <>
                         <Button onClick={() => ref.current && ref.current.openEdit(row.subject)} type="link">编辑</Button>
                         <Button onClick={() => handleRemove(row.subject)} type="link">删除</Button>
                       </>
                     );
                   }
                 }
               ]}/>
      </Card>

    </div>

  );
};

export default PolicySetting;
