import React, {FC, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {Avatar, Button, Card, Form, Input, Modal, Pagination, Switch, Table, Tag} from "antd";
import {useDebounce, useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";
import {getEmailOptionalRule, getPhoneOptionalRule, getRequiredRule, getUserNameRule} from "@/rules";
import SingleImageUpload, {SERVER_STATIC_PATH} from "@/components/SingleImageUpload/SingleImageUpload";
import Frame from "@/components/Frame/Frame";
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';

export const columns = [
  {title: '用户名', width: 140, dataIndex: 'username'},
  {
    title: '头像',
    width: 50,
    align: 'center',
    dataIndex: 'avatar_url',
    render: (text: string) => {
      return <Avatar size="small" shape="square" src={SERVER_STATIC_PATH + text}/>;
    }
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'enable',
    align: 'center',
    render: enable => {
      return <Tag color={enable ? 'success' : 'warning'}>{enable ? '启用' : '禁用'}</Tag>
    }
  },
  {title: '真实姓名', width: 120, dataIndex: 'real_name'},
  {title: '电话号码', width: 120, dataIndex: 'phone'},
  {title: '邮箱', dataIndex: 'email'},
];

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};
const PersonnelModal: FC<{ onComplete: () => void }> = (props, ref) => {
  const {run: createRun, loading: createLoading} = useRequest<AfterResponse<any>>((data) => http.post("/v1/personnel", data), {
    manual: true,
  });
  const {run: updateRun, loading: updateLoading} = useRequest<AfterResponse<any>>((id, data) => http.put("/v1/personnel/" + id, data), {manual: true});
  const [visible, setVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isLoading = createLoading || updateLoading;
  const [form] = Form.useForm();
  const id = useRef(null);
  const showModal = useCallback(() => {
    id.current = null;
    setVisible(true);
    form.resetFields();
  }, [form, setVisible]);
  const handleSubmit = (values) => {
    const execute = () => isEditMode ? updateRun(id.current, values) : createRun(values);
    execute().then(result => {
      if (isHttpError(result)) {
        result.showAlert();
        return;
      }
      setVisible(false);
      props.onComplete();
    });
  };
  const fields = useMemo(() => [
    {
      label: "用户名",
      name: "username",
      rules: [
        getRequiredRule("用户名"),
        getUserNameRule("用户名"),
      ],
      render: () => <Input disabled={isEditMode} placeholder="请输入用户名"/>,
    },
    {
      label: isEditMode ? "重置密码" : "密码",
      name: "password",
      rules: !isEditMode ? [
        getRequiredRule("密码"),
      ] : [],
      render: () => <Input type="password" placeholder={`请输入密码${isEditMode ? '(可选)' : ''}`}/>,
    },
    {
      label: "头像",
      name: "avatar_url",
      rules: [],
      render: () => <SingleImageUpload/>,
    },
    {
      label: "真实姓名",
      name: "real_name",
      render: () => <Input placeholder="请输入真实姓名(可选)"/>,
    },
    {
      label: "手机号码",
      name: "phone",
      rules: [
        getPhoneOptionalRule("手机号码"),
      ],
      render: () => <Input placeholder="请输入手机号码(可选)"/>,
    },
    {
      label: "邮箱地址",
      name: "email",
      rules: [
        getEmailOptionalRule("邮箱地址"),
      ],
      render: () => <Input placeholder="请输入邮箱地址(可选)"/>,
    },
    {
      label: "启用状态",
      name: "enable",
      valuePropName: "checked",
      render: () => <Switch disabled={id.current === 1}/>,
    }
  ], [isEditMode]);
  useImperativeHandle(ref, () => {
    return {
      open() {
        setIsEditMode(false);
        showModal();
      },
      openEdit(row: any) {
        setIsEditMode(true);
        showModal();
        id.current = row.id;
        form.setFieldsValue({
          username: row.username,
          avatar_url: row.avatar_url,
          real_name: row.real_name,
          phone: row.phone,
          email: row.email,
          enable: row.enable,
        });
      }
    };
  });
  return (
    <Modal forceRender title={(!isEditMode ? '添加' : '编辑') + '用户'}
           keyboard={!isLoading}
           maskClosable={!isLoading}
           closable={!isLoading}
           visible={visible}
           onCancel={() => setVisible(false)}
           footer={null}
    >
      <Form {...layout} form={form} initialValues={{enable: true}} onFinish={handleSubmit}>
        {fields.map(field => {
          return (
            <Form.Item validateFirst rules={field.rules} key={field.name} name={field.name} label={field.label}
                       valuePropName={field.valuePropName || 'value'}>
              {field.render()}
            </Form.Item>
          );
        })}
        <Form.Item style={{textAlign: 'right'}}>
          <Button loading={isLoading} htmlType="submit" type="primary">提交</Button>
          <Button onClick={() => setVisible(false)} disabled={isLoading} style={{marginLeft: '20px'}}>取消</Button>
        </Form.Item>
      </Form>
    </Modal>
  );

};

// @ts-ignore
const PersonnelModalWithRef = forwardRef(PersonnelModal);
const Personnel: FC = props => {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const {data, refresh, params, loading, pagination} = useRequest(({current, pageSize, filters}) => {
    return http.get("/v1/personnel", {
      params: {
        page: current,
        per_page: pageSize,
        q: debouncedQ,
      }
    });
  }, {
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
    refreshDeps: [debouncedQ]
  });
  const ref = useRef<{
    open: () => void;
    openEdit: (row: any) => void;
  }>(null);

  return (
    <Frame>
      <PersonnelModalWithRef onComplete={refresh} ref={ref}/>
      <Card title={<>
        <Input value={q} onChange={e => setQ(e.target.value)} allowClear prefix={<SearchOutlined/>} style={{width: '240px'}} placeholder="输入关键字搜索"/>
      </>}
            extra={
              <>
                <Button type="primary" onClick={() => {
                  if (ref.current) {
                    ref.current.open();
                  }
                }}><PlusOutlined/>添加用户</Button>
              </>
            }
            style={{marginTop: '20px'}}>
        <Table tableLayout="fixed" loading={loading} size="small" bordered pagination={false} rowKey="id"
               dataSource={data?.list} columns={[
          ...columns,
          {
            title: '操作',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (row) => {
              return (
                <>
                  <Button onClick={() => ref.current!.openEdit(row)} type="link">编辑</Button>
                </>
              );
            }
          }
        ] as any}/>
        <div style={{marginTop: '20px', textAlign: 'right'}}>
          <Pagination showTotal={total => <span>共{total}条</span>} disabled={loading} showQuickJumper
                      current={pagination.current} onChange={pagination.changeCurrent} total={pagination.total}/>
        </div>
      </Card>
    </Frame>
  );
};

export default Personnel;
