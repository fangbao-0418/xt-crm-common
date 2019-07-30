import { actions as loadingActions } from '../../components/loading';
import * as Fetch from '../../util/fetch';

export const list = (formVal) => {
  return (dispatch) => {
    dispatch(loadingActions.showLoading());

    Fetch.post('/crm/product/list').then((response) => {
      dispatch(loadingActions.hideLoading());
    });
  };
};