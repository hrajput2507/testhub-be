import async_handler from "../../middlewares/async.middleware.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";
import {
  delete_file_from_S3_bucket,
  get_aws_bucket_url,
  upload_files_in_S3_bucket,
} from "../../utils/bucket.util.js";
import db_connection from "../../models/index.js";

/**
 * File Upload
 */
export const upload_file = async_handler(
  async (req, res, next, json = false) => {
    const file = req.files.file;
    const { entity, entity_id, column_name, table } = req.body;

    if (!entity) {
      return next(
        new ErrorResponse(
          "Please provide on which entity search will be perform",
          200
        )
      );
    }
    if (!entity_id) {
      return next(
        new ErrorResponse("Please provide for which entity is to perform", 200)
      );
    }
    if (!column_name) {
      return next(
        new ErrorResponse("Please provide which column is to be updated", 200)
      );
    }
    if (!table) {
      return next(new ErrorResponse("Please provide table name", 200));
    }

    let path = "";
    if (table) {
      path = `${table}`;
    }
    if (entity_id && table) {
      path = `${table}/${entity_id}`;
    }

    const file_name = `${file.md5}_${file.name
      .split(".")[0]
      .replace(" ", "_")}.${file.name.split(".")[1]}`;

    const uploadedFile = await upload_files_in_S3_bucket(
      file.data,
      `${path}/${file_name}`
    );

    const select_query = `SELECT ${column_name} FROM  ${table} WHERE ${entity} = ${entity_id}`;

    const result = await db_connection.sequelize.query(select_query, {
      type: db_connection.sequelize.QueryTypes.SELECT,
    });

    if (!result) {
      return next(new ErrorResponse("Data is not created yet", 200));
    }

    const url = get_aws_bucket_url(`${path}/${file_name}`);

    let query = `UPDATE ${table} SET ${column_name} = '${url}' WHERE ${entity} = ${entity_id}`;

    const [updated, meta] = await db_connection.sequelize.query(query);

    if (result[0][column_name] && updated) {
      await delete_file_from_S3_bucket(result[0][column_name]);
    }

    return _response(
      res,
      201,
      true,
      "File uploaded successfully",
      {
        file_path: `${path}/${file_name}`,
        url,
        query,
        updated,
        meta,
      },
      json
    );
  }
);

/**
 * File delete
 */
export const delete_file = async_handler(async (req, res, next) => {
  const { file_path } = req.body;

  const deleted_file = await delete_file_from_S3_bucket(file_path);

  return _response(res, 201, true, "File deleted successfully", {});
});
