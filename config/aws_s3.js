import AWS from "aws-sdk";

/**
 * This is a AWS configuration method.
 * @returns {Object}
 */
export const configure_aws = () => {
  const aws_access_key = process.env.AWS_ACCESS_KEYID;
  const aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY;
  const aws_region = process.env.AWS_REGION;

  const config_object = {
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
    region: aws_region,
  };

  AWS.config.update(config_object);

  return new AWS.S3();
};
