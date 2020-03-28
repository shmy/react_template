import React, {FC, forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";
import {Button, Form, Input, Modal, Table, message as AntMessage, Card} from "antd";
import {getRequiredRule} from "@/rules";
import {PlusOutlined, ExportOutlined, ImportOutlined} from '@ant-design/icons';
import FileSaver from "file-saver";

const PolicyModal = (props: { appId: number, onComplete: () => void }, ref) => {
  const [visible, setVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {loading, run} = useRequest<AfterResponse<any>>((appId, data) => http.post('/v1/policy/' + appId, data), {
    manual: true,
  });
  const {loading: updateLoading, run: updateRun} = useRequest<AfterResponse<any>>((appId, data) => http.put('/v1/policy/' + appId + '/update', data), {
    manual: true,
  });
  const [form] = Form.useForm();
  const beforeData = useRef<any>(null);
  const isLoading = loading || updateLoading;
  const handleSubmit = (values) => {
    if (isEditMode) {
      updateRun(props.appId, {before: beforeData.current, after: values}).then(result => {
        if (isHttpError(result)) {
          result.showAlert();
          return;
        }
        if (result === false) {
          AntMessage.warning('不能与其他数据重复， 请检查');
          return;
        }
        props.onComplete();
        setVisible(false);
      });
    } else {
      run(props.appId, values).then(result => {
        if (isHttpError(result)) {
          result.showAlert();
          return;
        }
        if (result === false) {
          AntMessage.warning('不能与其他数据重复， 请检查');
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
        beforeData.current = null;
        setIsEditMode(false);
        setVisible(true);
        form.resetFields();
      },
      openEdit(row: any) {
        beforeData.current = row;
        setIsEditMode(true);
        setVisible(true);
        form.setFieldsValue({
          subject: row.subject,
          object: row.object,
          action: row.action,
        });
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
      <Form form={form} onFinish={handleSubmit} layout="horizontal">
        <Form.Item name="subject" rules={[getRequiredRule("角色")]} label="角色">
          <Input placeholder="角色"/>
        </Form.Item>
        <Form.Item name="object" rules={[getRequiredRule("对象")]} label="对象">
          <Input placeholder="对象"/>
        </Form.Item>
        <Form.Item name="action" rules={[getRequiredRule("动作")]} label="动作">
          <Input placeholder="动作"/>
        </Form.Item>
        <Form.Item style={{textAlign: 'right'}}>
          <Button loading={isLoading} htmlType="submit" type="primary">提交</Button>
          <Button disabled={isLoading} style={{marginLeft: '20px'}} onClick={() => setVisible(false)}>取消</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const PolicyModalWithForward = forwardRef(PolicyModal);

const columns = [
  {
    title: '角色',
    dataIndex: 'subject',
    width: 200,
  },
  {
    title: '对象',
    dataIndex: 'object',
    width: 200,
  },
  {
    title: '动作',
    dataIndex: 'action',
  },
];

// TODO: 使用checkbox进行管理
interface PolicySettingProps {
  id: number;
}

const PolicySetting: FC<PolicySettingProps> = props => {
  const {data, refresh} = useRequest(() => http.get('/v1/policy/' + props.id));
  const {run} = useRequest((data) => http.put('/v1/policy/' + props.id + '/remove', data), {manual: true});
  const {run: importRun} = useRequest((data) => http.post('/v1/policy/' + props.id + '/import', data), {manual: true});
  const ref = useRef<{
    open: () => void,
    openEdit: (row: any) => void,
  }>(null);
  const handleRemove = (values) => {
    run({
      subject: values.$$subject,
      object: values.$$object,
      action: values.action,
    }).then((result: any) => {
      if (result === true) {
        refresh();
      }
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
      if(this.result) {
        importRun(JSON.parse(this.result as string));
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
        <Button type="primary" onClick={handleOpenModal}><PlusOutlined/>添加角色权限</Button>
        <Button onClick={handleExport} style={{marginLeft: '10px'}} type="primary"><ExportOutlined/>导出</Button>
        <Button style={{position: 'relative', marginLeft: '10px', overflow: 'hidden'}}
                type="primary"><ImportOutlined/>导入
          <input style={{opacity: '0', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 0}}
                 onChange={handleFileChange}
                 accept="application/json"
                 type="file"/>
        </Button>
      </>}>

        <Table size="small" bordered pagination={false} rowKey={row => row.id}
               dataSource={data as any}
               columns={[
                 ...columns,
                 {
                   title: '操作',
                   width: 140,
                   render: (row) => {
                     if (row.action) {
                       return (
                         <>
                           <Button onClick={() => {
                             if (ref.current) {
                               ref.current.openEdit({
                                 subject: row.$$subject,
                                 object: row.$$object,
                                 action: row.action,
                               });
                             }
                           }} type="link">编辑</Button>
                           <Button onClick={() => handleRemove(row)} type="link">删除</Button>
                         </>
                       );
                     }
                     return null;
                   }
                 }
               ]}/>
      </Card>

    </div>

  );
};

export default PolicySetting;
