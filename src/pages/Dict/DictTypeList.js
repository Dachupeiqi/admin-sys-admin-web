import {connect} from "dva";
import {Form} from "@ant-design/compatible";
import React, {PureComponent} from "react";
import styles from "@/pages/Dict/DictList.less";
import PButton from "@/components/PermButton";
import {Avatar, Button, List, Modal} from "antd";
import DictTypeCard from "@/pages/Dict/DictTypeCard";



@connect(state => ({
  loading: state.loading.models.dictType,
  dictType: state.dictType,
}))
@Form.create()
class DictTypeList extends  PureComponent{


  componentDidMount() {
    this.dispatch({
      type: 'dictType/fetch',
      search: {},
      pagination: {},
    });

  }



  onDataFormCancel = () => {
    this.dispatch({
      type: 'dictType/changeFormVisible',
      payload: false,
    });
  };

  onDataFormSubmit = data => {
    this.dispatch({
      type: 'dictType/submit',
      payload: data,
    });

  };

  onAddClick = () => {
    // eslint-disable-next-line no-debugger
    debugger;
    this.dispatch({
      type: 'dictType/loadForm',
      payload: {
        type: 'A',
      },
    });


  };

  onItemEditClick = item => {
    this.dispatch({
      type: 'dictType/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onItemListClick=  item => {
    this.dispatch({
      type: 'dictData/fetch',
      search:{
        Type: item.type
      },
      pagination: {},
    });

    this.dispatch({
      type: 'dictData/changeDataType',
      payload: item.type,

    });


  };



  onDelOKClick(id) {
    this.dispatch({
      type: 'dictType/del',
      payload: { id },
    });
    // this.clearSelectRows();
  }

  onItemDelClick = item => {
    Modal.confirm({
      title: `确定删除【字典类型：${item.type}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderDataForm() {
    return <DictTypeCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  render() {
    const {
      loading,
      dictType: {
        data: { list, pagination },
      },
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return(
      <div>
        <div className={styles.tableListOperator}>
          <PButton code="add" type="primary" onClick={() => this.onAddClick()}>
            新建
          </PButton>
        </div>

        <div style={{ }}>
          <List
            style={{marginTop:"20px"}}
            size="large"
            pagination={paginationProps}
            dataSource={list}
            footer={
              <div>
                <b>字典类型</b> 列表
              </div>
            }
            renderItem={(item) => (
              <List.Item
                onClick={()=>this.onItemListClick(item)}
                className={styles.listItem}
                key={item.id}
                style={{padding:'2px'}}
                actions={[<a key="list-loadmore-edit" onClick={() => this.onItemEditClick(item)}>edit</a>,
                  <a onClick={()=>this.onItemDelClick(item)} key="list-loadmore-more">del</a>]}
              >


                <List.Item.Meta
                  title={
                    <>
                      <a href={item.href}>{item.name}</a>
                      {
                        item.status===1?
                          (
                            <Button size="small" style={{marginLeft:"20px"}}>正常</Button>) :
                          (
                            <Button danger size="small" style={{marginLeft:"20px"}}>停用</Button>)
                      }
                    </>
                  }
                  description={item.type}
                />

              </List.Item>
            )}
          />
        </div>


        {this.renderDataForm()}
      </div>


    )
  }
}


export  default  DictTypeList
