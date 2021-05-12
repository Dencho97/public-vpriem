export const SET_TUTORIAL = 'SET_TUTORIAL';

export const setTutorialAction = (tutorial, active = true) => (dispatch) => {
    dispatch({ type: SET_TUTORIAL, payload: { tutorial, active } });
};
