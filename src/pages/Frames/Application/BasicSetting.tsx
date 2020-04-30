import React, {FC, useEffect} from 'react';
import {message as AntMessage, Button, Form, Input, Spin, Switch, Upload} from "antd";
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse, isHttpError} from "@/utils/http";
import SingleImageUpload from "@/components/SingleImageUpload/SingleImageUpload";
import {getRequiredRule, getUrlRule} from "@/rules";

interface BasicSettingProps {
  id: number;
}

export const fields = [
  {
    label: "应用名称",
    name: "name",
    rules: [
      getRequiredRule("应用名称"),
    ],
    render: () => <Input placeholder="应用名称"/>,
  },
  {
    label: "应用logo",
    name: "logo_url",
    rules: [
      getRequiredRule("应用logo", false),
    ],
    render: () => <SingleImageUpload/>,
  },
  {
    label: "应用登录回调地址",
    name: "url",
    rules: [
      getRequiredRule("应用登录回调地址"),
      getUrlRule("应用登录回调地址"),
    ],
    render: () => <Input placeholder="应用登录回调地址"/>,
  },
  {
    label: "应用简介",
    name: "intro",
    render: () => <Input.TextArea rows={4} placeholder="应用简介(可选)"/>,
  },
  {
    label: "启用状态",
    name: "enable",
    valuePropName: "checked",
    render: () => <Switch/>,
  }
];
export const initialValues = {enable: true};
export const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
const BasicSetting: FC<BasicSettingProps> = props => {
  const {loading, data} = useRequest(() => http.get('/v1/app/' + props.id));
  const {loading: updateLoading, run} = useRequest<AfterResponse<any>>((data) => http.put('/v1/app/' + props.id, data), {
    manual: true,
  });
  const [form] = Form.useForm();
  const handleSubmit = (values) => {
    run(values).then((result) => {
      if (isHttpError(result)) {
        result.showAlert();
        return;
      }
      AntMessage.success('保存成功');
    });
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: (data as any).name,
        url: (data as any).url,
        logo_url: (data as any).logo_url,
        intro: (data as any).intro,
        enable: (data as any).enable,
      })
    }
  }, [data]);
  return (
    <Form {...layout} onFinish={handleSubmit} form={form} initialValues={initialValues} style={{width: '400px'}}
          layout="horizontal">
      <Spin delay={300} spinning={loading || updateLoading}>
        {fields.map(field => {
          return (
            <Form.Item validateFirst rules={field.rules} key={field.name} name={field.name} label={field.label}
                       valuePropName={field.valuePropName || 'value'}>
              {field.render()}
            </Form.Item>
          );
        })}
        <Form.Item>
          <Button htmlType="submit" type="primary">保存设置</Button>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default BasicSetting;
