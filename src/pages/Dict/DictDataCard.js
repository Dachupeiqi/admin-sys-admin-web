import {connect} from "dva";
import {Form} from "@ant-design/compatible";
import React, {PureComponent} from "react";
import {Input, InputNumber, Modal, Radio} from "antd";


@connect(state => ({
  loading: state.loading.models.dictData,
  dictData: state.dictData,
}))
@Form.create()
class DictDataCard extends  PureComponent{
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.status = parseInt(formData.status, 10);
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
      dictData: { formTitle, formVisible, formData, submitting , dataType},

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
          <Form.Item {...formItemLayout} label="名称">
            {getFieldDecorator('label', {
              initialValue: formData.Label,
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="值">
            {getFieldDecorator('value', {
              initialValue: formData.Value,
              rules: [
                {
                  required: true,
                  message: '请输入值',
                },
              ],
            })(<Input placeholder="请输入值" />)}
          </Form.Item>


          <Form.Item {...formItemLayout} label="排序">
            {getFieldDecorator('sort', {
              initialValue: formData.Sort,
              rules: [
                {
                  required: true,
                  message: '请输入排序',
                },
              ],
            })(<InputNumber min={1} max={10000} defaultValue={1} />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="字典Type">
            {getFieldDecorator('type', {
              initialValue: dataType,
            })(<Input placeholder="请输入字典Type" disabled />)}
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
            })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
          </Form.Item>


        </Form>
      </Modal>
    );
  }

}


export  default  DictDataCard;
