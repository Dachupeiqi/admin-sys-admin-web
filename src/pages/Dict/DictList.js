import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import React, {PureComponent} from "react";
import {Form} from "@ant-design/compatible";
import { Avatar, List, Space , Layout } from 'antd';
import PButton from '@/components/PermButton';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from "@/pages/Dict/DictList.less";
import DictTypeList from "@/pages/Dict/DictTypeList";
import DictDataList from "@/pages/Dict/DictDataList";
import { Col, Row } from 'antd';
@connect(state => ({
  loading: state.loading.models.dictType,
  dictType: state.dict,
}))
@Form.create()
class DictList extends PureComponent{



  render() {

    const breadcrumbList = [{ title: '系统管理' }, { title: '字典管理', href: '/system/dict' }];


    return(

      <div>
        <PageHeaderLayout title="字典管理" breadcrumbList={breadcrumbList} />

        <>
          <Row>
            <Col span={12} style={{verticalAlign: 'top',padding:"10px"}} className={styles.dictTypeContainer}>
              <DictTypeList  />
            </Col>
            <Col span={12} style={{verticalAlign: 'top',backgroundColor:"blue"}} className={styles.dictDataContainer}>
              <DictDataList  />
            </Col>
          </Row>
        </>

      </div>


    )


  }

}













export default DictList;
