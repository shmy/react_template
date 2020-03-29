import React, {FC, useEffect, useState} from 'react';
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse} from "@/utils/http";
import {Button, Checkbox, Input, Tooltip} from "antd";
import {EnterOutlined} from "@ant-design/icons";
import _ from "lodash";
import styles from "./PolicyCheckbox.module.scss";

const DoubleInput: FC<{ onSubmit: (s: string[]) => void }> = props => {
  const [object, setObject] = useState('');
  const [action, setAction] = useState('');
  const handleSubmit = () => {
    if (object && action) {
      props.onSubmit([object, action]);
      setObject('');
      setAction('');
    }
  };
  const handleKeyDown = e => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className={styles.doubleInput}>
      <Input allowClear onKeyDown={handleKeyDown} className={styles.input} size="small"
             onChange={e => setObject(e.target.value.trim())} value={object} placeholder="新对象"/>
      <Input allowClear onKeyDown={handleKeyDown} className={styles.input} size="small"
             onChange={e => setAction(e.target.value.trim())} value={action} placeholder="新动作"
             style={{marginLeft: '10px'}}/>
      <Button style={{marginLeft: '10px'}} htmlType="button" onClick={handleSubmit} disabled={!object || !action}
              size="small"
              type="primary"><EnterOutlined/></Button>
    </div>
  );
};
const SingleInput: FC<{ onSubmit: (s: string) => void }> = props => {
  const [value, setValue] = useState('');
  const handleKeyDown = e => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      if (value) {
        props.onSubmit(value);
        setValue('');
      }
    }
  };
  const handleSubmit = () => {
    if (value) {
      props.onSubmit(value);
      setValue('');
    }
  };
  return (
    <Input allowClear size="small" onKeyDown={handleKeyDown} onChange={e => setValue(e.target.value.trim())}
           value={value}
           placeholder="新动作" suffix={<EnterOutlined onClick={handleSubmit}/>} style={{width: '100%'}}/>
  );
};
type checkboxValue = string[];

interface PolicyCheckboxProps {
  appId: number;
  value?: checkboxValue;
  onChange?: (s: checkboxValue) => void;
}

const PolicyCheckbox: FC<PolicyCheckboxProps> = props => {
  const {data: fetchData, mutate, loading: fetchLoading, run: fetchRun} = useRequest<AfterResponse<any>>((appId) => http.get('/v1/policy/' + appId + '/oc'), {
    manual: true,
    initialData: []
  });
  const [value, setValue] = useState<checkboxValue>([]);
  const handleChange = (v, e) => {
    const checked = e.target.checked;
    const newValue = [...value];
    if (checked) {
      newValue.push(v);
    } else {
      _.remove(newValue, item => item === v);
    }
    setValue(newValue);
    props.onChange && props.onChange(newValue);
  };
  const handleActionAdded = (index: number, value: string) => {
    mutate(data => {
      const newData = [...data];
      // 判断是否存在
      const r = _.find(newData[index].children, item => item.action === value);
      if (!r) {
        const object = newData[index].object;
        newData[index].children.push({$$object: object, action: value});
        handleChange(`${object} ${value}`, {target: {checked: true}});
      }
      return newData;
    });
  };
  const handleOCSubmit = ([object, action]: string[]) => {
    const newData = [...fetchData];
    // 判断是否存在
    const index = _.findIndex(newData, item => item.object === object);
    if (index !== -1) {
      handleActionAdded(index, action);
      return;
    }
    // 不存在 添加
    newData.unshift({
      id: object,
      object,
      children: [
        {
          // id: 15,
          action,
          $$object: object,
        }
      ]
    });
    handleChange(`${object} ${action}`, {target: {checked: true}});
    mutate(newData);
  };
  useEffect(() => {
    fetchRun(props.appId);
  }, []);
  useEffect(() => {
    setValue(props.value || []);
  }, [props.value]);
  return (
    <div>
      <div>
        <DoubleInput onSubmit={handleOCSubmit}/>
      </div>
      {fetchData.map((item, index) => {
        return (
          <div className={styles.item} key={item.object}>
            <div>
              <div className={styles.title}><Tooltip placement="topLeft" title={item.object}>{item.object}</Tooltip>
              </div>
              <div>
                <SingleInput onSubmit={(value: string) => handleActionAdded(index, value)}/>
              </div>
            </div>
            <ul className={styles.ul}>
              {item.children.map(curr => {
                const v = `${curr.$$object} ${curr.action}`;
                const checked = _.findIndex(value, item => item === v) !== -1;
                return <li key={curr.action}><Checkbox style={{width: '100%'}} onChange={(e) => handleChange(v, e)}
                                                       checked={checked}>{curr.action}</Checkbox></li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PolicyCheckbox;
