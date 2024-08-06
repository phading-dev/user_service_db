import AWS = require("aws-sdk");
import getStream = require("get-stream");
import postgres = require("postgres");

async function main(): Promise<void> {
  let s3 = new AWS.S3({ apiVersion: "2006-03-01", region: "us-east-1" });
  let dbPassword = await getStream(
    s3
      .getObject({
        Bucket: "user-service-secrets",
        Key: "db_password",
      })
      .createReadStream(),
  );
  let sql = postgres({
    host: "user-service-db.cda5j8gofxqp.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "UserServiceDb",
    username: "root",
    password: dbPassword,
  });
  await sql`CREATE TABLE IF NOT EXISTS User (
    username varchar(128)
  );`;
  await sql`INSERT INTO User VALUES ('some user');`;
  sql.end();
}

main();
