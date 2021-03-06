import Vue from 'vue';
import axios from '~/lib/utils/axios_utils';
import Cookies from 'js-cookie';
import { handleLocationHash, historyPushState } from '~/lib/utils/common_utils';
import { mergeUrlParams } from '~/lib/utils/url_utility';
import * as types from './mutation_types';
import {
  PARALLEL_DIFF_VIEW_TYPE,
  INLINE_DIFF_VIEW_TYPE,
  DIFF_VIEW_COOKIE_NAME,
} from '../constants';

export const setBaseConfig = ({ commit }, options) => {
  const { endpoint, projectPath } = options;
  commit(types.SET_BASE_CONFIG, { endpoint, projectPath });
};

export const fetchDiffFiles = ({ state, commit }) => {
  commit(types.SET_LOADING, true);

  return axios
    .get(state.endpoint)
    .then(res => {
      commit(types.SET_LOADING, false);
      commit(types.SET_MERGE_REQUEST_DIFFS, res.data.merge_request_diffs || []);
      commit(types.SET_DIFF_DATA, res.data);
      return Vue.nextTick();
    })
    .then(handleLocationHash);
};

export const setInlineDiffViewType = ({ commit }) => {
  commit(types.SET_DIFF_VIEW_TYPE, INLINE_DIFF_VIEW_TYPE);

  Cookies.set(DIFF_VIEW_COOKIE_NAME, INLINE_DIFF_VIEW_TYPE);
  const url = mergeUrlParams({ view: INLINE_DIFF_VIEW_TYPE }, window.location.href);
  historyPushState(url);
};

export const setParallelDiffViewType = ({ commit }) => {
  commit(types.SET_DIFF_VIEW_TYPE, PARALLEL_DIFF_VIEW_TYPE);

  Cookies.set(DIFF_VIEW_COOKIE_NAME, PARALLEL_DIFF_VIEW_TYPE);
  const url = mergeUrlParams({ view: PARALLEL_DIFF_VIEW_TYPE }, window.location.href);
  historyPushState(url);
};

export const showCommentForm = ({ commit }, params) => {
  commit(types.ADD_COMMENT_FORM_LINE, params);
};

export const cancelCommentForm = ({ commit }, params) => {
  commit(types.REMOVE_COMMENT_FORM_LINE, params);
};

export const loadMoreLines = ({ commit }, options) => {
  const { endpoint, params, lineNumbers, fileHash } = options;

  params.from_merge_request = true;

  return axios.get(endpoint, { params }).then(res => {
    const contextLines = res.data || [];

    commit(types.ADD_CONTEXT_LINES, {
      lineNumbers,
      contextLines,
      params,
      fileHash,
    });
  });
};

export const loadCollapsedDiff = ({ commit }, file) =>
  axios.get(file.loadCollapsedDiffUrl).then(res => {
    commit(types.ADD_COLLAPSED_DIFFS, {
      file,
      data: res.data,
    });
  });

export const expandAllFiles = ({ commit }) => {
  commit(types.EXPAND_ALL_FILES);
};

export default {
  setBaseConfig,
  fetchDiffFiles,
  setInlineDiffViewType,
  setParallelDiffViewType,
  showCommentForm,
  cancelCommentForm,
  loadMoreLines,
  loadCollapsedDiff,
  expandAllFiles,
};
