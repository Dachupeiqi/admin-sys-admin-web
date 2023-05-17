import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Radio } from 'antd';
import { md5Hash } from '../../utils/utils';


@connect(state => ({
  dictType: state.dictType,
}))
@Form.create()
class DictTypeCard extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };

        formData.status = parseInt(formData.status, 10);

        if (formData.password && formData.password !== '') {
          formData.password = md5Hash(formData.password);
        }
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      dictType: { formType, formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title={formTitle}
        width={600}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="字典类型名称">
            {getFieldDecorator('name', {
              initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入字典类型名称',
                },
              ],
            })(<Input placeholder="请输入字典类型名称" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="字典类型编码">
            {getFieldDecorator('type', {
              initialValue: formData.type,
              rules: [
                {
                  required: true,
                  message: '请输入字典类型编码',
                },
              ],
            })(
              <Input
                placeholder="字典类型编码"
              />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="状态">
            {getFieldDecorator('status', {
              initialValue: formData.status===1? formData.status.toString() : '2',
            })(
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              initialValue: formData.remark,
            })(<Input placeholder="备注" />)}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default DictTypeCard;
