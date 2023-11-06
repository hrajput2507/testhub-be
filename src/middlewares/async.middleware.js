const async_handler = fn => (req, res, next, json = false) =>
    Promise
        .resolve(fn(req, res, next, json))
        .catch(next)

export default async_handler;