
export const handleApiAction = (type, {loadingField, errorField}, handler ) => {

    return {
        [type]:  (state, action) => {
            const { payload: { loading, error } } = action;
            const newState = {
                ...state,
                [errorField]: error,
                [loadingField]: loading
            };

            return handler(newState, action);
        },
        [type + '_LOADING']: (state, { payload: { error, loading } }) => {
            return { ...state, [loadingField]: loading, [errorField]: error };
        },
        [type + '_ERROR']: (state, { payload: { error, loading } }) => {
            return { ...state, [loadingField]: loading, [errorField]: error };
        },
    };

};
