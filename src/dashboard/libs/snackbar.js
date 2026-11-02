import { useSnackbar } from 'notistack';
import React from 'react';

const InnerSnackbarUtilsConfigurator = props => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef;
const setUseSnackbarRef = useSnackbarRefProp => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

export const snackActions = {
  success(msg) {
    this.toast(msg, 'success');
  },
  warning(msg) {
    this.toast(msg, 'warning');
  },
  info(msg) {
    this.toast(msg, 'info');
  },
  error(msg) {
    this.toast(msg, 'error');
  },
  toast(msg, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant });
  },

  /**
   * A toast drawn by `render(key)` instead of notistack's own look, for ones that
   * carry a link or live progress. Returns its key; `close(key)` removes it.
   */
  custom(render, options = {}) {
    return useSnackbarRef.enqueueSnackbar('', { content: key => render(key), ...options });
  },
  close(key) {
    useSnackbarRef?.closeSnackbar(key);
  },
};
