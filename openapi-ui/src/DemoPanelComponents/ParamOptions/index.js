import React, { useState } from 'react';

import styles from './styles.module.css';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';
import FormMultiSelect from 'DemoPanelComponents/FormMultiSelect';

function ParamOptions() {
  const [showOptional, setShowOptional] = useState(false);

  const pathParams = useSelector((state) => state.params.path);
  const queryParams = useSelector((state) => state.params.query);
  const cookieParams = useSelector((state) => state.params.cookie);
  const headerParams = useSelector((state) => state.params.header);

  const allParams = [
    ...pathParams,
    ...queryParams,
    ...cookieParams,
    ...headerParams,
  ];

  const requiredParams = allParams.filter((p) => p.required);
  const optionalParams = allParams.filter((p) => !p.required);

  return (
    <>
      {requiredParams.map((param) => {
        if (param.schema.type === 'array' && param.schema.items.enum) {
          return <ParamMultiSelectFormItem param={param} />;
        }
        return <ParamTextFormItem param={param} />;
      })}
      {optionalParams.length > 0 && (
        <>
          <button
            className={styles.showMoreButton}
            onClick={() => setShowOptional((prev) => !prev)}
          >
            <span
              style={{
                width: '1.5em',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {showOptional ? '-' : '+'}
            </span>
            {showOptional
              ? 'hide optional parameters'
              : 'show optional parameters'}
          </button>
          {showOptional && (
            <div>
              {optionalParams.map((param) => {
                return <ParamTextFormItem param={param} />;
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

function ParamMultiSelectFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormMultiSelect
      label={param.name}
      type={param.type}
      options={param.schema.items.enum}
      onChange={(e) => {
        const values = Array.prototype.filter
          .call(e.target.options, (o) => o.selected)
          .map((o) => o.value);

        updateParam({
          ...param,
          value: values.length > 0 ? values : undefined,
        });
      }}
    />
  );
}

function ParamTextFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <div className="nick-form-item">
      <code>{param.name}</code>
      <span style={{ opacity: 0.6 }}> — {param.type}</span>
      <div>
        <input
          className={styles.input}
          type="text"
          placeholder={param.description || param.name}
          value={param.value}
          onChange={(e) => updateParam({ ...param, value: e.target.value })}
        />
      </div>
    </div>
  );
}

export default ParamOptions;
