
import {connect} from "dva";
import {Form} from "@ant-design/compatible";
import React, {PureComponent} from "react";
import {Badge, Button, Card, Col, Input, Modal, Radio, Row, Select, Table} from "antd";
import {formatDate} from "@/utils/utils";
import styles from "@/pages/Dict/DictList.less";
import PButton from "@/components/PermButton";
import PageHeaderLayout from "@/layouts/PageHeaderLayout";
import UserCard from "@/pages/User/UserCard";
import RoleSelect from "@/pages/User/RoleSelect";
import DictDataCard from "@/pages/Dict/DictDataCard";


@connect(state => ({
  loading: state.loading.models.dictData,
  dictData: state.dictData,
}))
@Form.create()
class DictDataList extends  PureComponent{

  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    // this.dispatch({
    //   type: 'dictData/fetch',
    //   search: {
    //   },
    //   pagination: {},
    // });


  }

  onItemEditClick = item => {
    this.dispatch({
      type: 'dictData/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'dictData/loadForm',
      payload: {
        type: 'A',
      },
    });
  };


  onDelOKClick(id) {
    this.dispatch({
      type: 'dictData/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  onItemDelClick = item => {
    Modal.confirm({
      title: `确定删除【字典数据：${item.Label}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  handleTableSelectRow = (record, selected) => {
    const keys = [];
    const rows = [];
    if (selected) {
      keys.push(record.id);
      rows.push(record);
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = pagination => {
    this.dispatch({
      type: 'dictData/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'dictData/fetch',
      search: {},
      pagination: {},
    });
  };

  onSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }

      const formData = { ...values };

      this.dispatch({
        type: 'dictData/fetch',
        search: formData,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  onDataFormSubmit = data => {
    this.dispatch({
      type: 'dictData/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'dictData/changeFormVisible',
      payload: false,
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  }


  renderDataForm() {
    return <DictDataCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="模糊查询">
              {getFieldDecorator('QueryValue')(<Input placeholder="请输入需要查询的内容" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Select
                  style={{
                    width: 120,
                  }}
                  options={[
                    {
                      value: '1',
                      label: '启用',
                    },
                    {
                      value: '2',
                      label: '停用',
                    },
                  ]}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden', paddingTop: 4 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      dictData: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRows, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '名称',
        dataIndex: 'Label',
      },
      {
        title: '值',
        dataIndex: 'Value',
      },
      {
        title: '排序',
        dataIndex: 'Sort',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return(


      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  onClick={() => this.onItemEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  type="danger"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                selectedRows[0].status === 2 && (
                  <PButton
                    key="enable"
                    code="enable"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].status === 1 && (
                  <PButton
                    key="disable"
                    code="disable"
                    type="danger"
                    onClick={() => this.onItemDisableClick(selectedRows[0])}
                  >
                    禁用
                  </PButton>
                ),
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.handleTableSelectRow,
                }}
                loading={loading}
                rowKey={record => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.onTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </div>

    )
  }

}


export  default  DictDataList;
