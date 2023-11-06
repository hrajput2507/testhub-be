import { configure_aws } from "../../config/aws_s3.js";

/**
 * This method used for uploading file in to S3 bucket.
 * @param {Object} params
 * @returns {Promise}
 */
export const upload_files_in_S3_bucket = (buffer, file_name) => {
  const s3 = configure_aws();
  const bucket = process.env.AWS_BUCKET_NAME;

  const s3Obj = {
    Bucket: bucket,
    Key: `${file_name}`,
    Body: buffer,
  };

  return s3.putObject(s3Obj).promise();
};

/**
 * This method used for generating url for showing files in browser.
 * @param {string} file_name
 * @returns {string}
 */
export const get_aws_bucket_url = (file_name) => {
  const bucket = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  // Replace s3 url with cloudfront url
  const signedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${file_name}`;

  return signedUrl;
};

/**
 * This method used for deleting existing file from S3 bucket.
 * @param {string} file_name
 * @returns {Promise}
 */
export const delete_file_from_S3_bucket = (file_name) => {
  const s3 = configure_aws();
  const bucket = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  const file_to_delete = file_name.split(
    `https://${bucket}.s3.${region}.amazonaws.com/`
  )[1];

  const params = {
    Bucket: bucket,
    Key: file_to_delete,
  };

  return s3.deleteObject(params).promise();
};
