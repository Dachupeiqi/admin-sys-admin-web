import { message } from 'antd';
import * as dictService from "@/services/dict";
import * as userService from "@/services/user";
import {createDictType, updateDictType} from "@/services/dict";


export default {

  namespace:'dictType',

  state:{
    search: {},

    data: {
      list: [],
      pagination: {},
    },

    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},

  },

  effects: {


    * fetch({search, pagination}, {call, put, select}) {
      let params = {};
      if (search) {
        params = {...params, ...search};
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.dictType.search);
        if (s) {
          params = {...params, ...s};
        }
      }

      if (pagination) {
        params = {...params, ...pagination};
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.dictType.pagination);
        if (p) {
          params = {...params, ...p};
        }
      }

      const response = yield call(dictService.queryDictType, params);
      yield put({
        type: 'saveData',
        payload: response,
      });

// 拿到第一个字典类型列表的Type值(后台要大写Type)，去获取dictData的数据
      if(response.list.length!==0){
        yield put({
          type: 'dictData/fetch',
          search:{
            Type: response.list[0].type
          },
          pagination: {},

        });
        yield put({
          type: 'dictData/changeDataType',
          payload: response.list[0].type,
        });
      }

    },


    * loadForm({payload}, {put}) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });


      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新增字典类型',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑字典类型',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: {id: payload.id},
          }),
        ];
      }
    },
    * fetchForm({payload}, {call, put}) {
      const response = yield call(dictService.getDictType, payload.id);
      yield put({
        type: 'saveFormData',
        payload: response,
      });
    },
    * submit({payload}, {call, put, select}) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      // eslint-disable-next-line no-debugger
      debugger;
      const params = {...payload};
      const formType = yield select(state => state.dictType.formType);
      let success = false;
      if (formType === 'E') {
        const id = yield select(state => state.dictType.formID);
        const response = yield call(dictService.updateDictType, id, params);
        if (response.status === 'OK') {
          success = true;
        }
      } else {
        const response = yield call(dictService.createDictType, params);
        if (response.id && response.id !== '') {
          success = true;
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    * del({payload}, {call, put}) {
      const response = yield call(dictService.delDictType,payload.id);
      console.log(response.status)

      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({type: 'fetch'});
      }

    },

  },


  reducers:{
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
  }



}


