const _response = (res, statusCode, success, message, payload, json = false) => {
    if (json) {
        return payload
    }
    res.status(statusCode || 200).json({ success, message, data: payload || {} });
};

export default _response;