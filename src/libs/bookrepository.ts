/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Logger } from "@aws-lambda-powertools/logger";
import mysql, { Connection } from "mysql2/promise";
import { getSecretValue } from "./secrets";
import { Book } from "./types";
import { internalServerErrorWith, isEmpty } from "./utils";
const logger = new Logger();

let connection: Connection;
interface DBCredentials {
  username: string;
  password: string;
  host: string;
  port: number;
  dbname: string;
}

export async function initDBConnectionUsingEnv() {
  logger.info("initializing database connection using " + JSON.stringify(process.env, null, 4));
  connection = await mysql.createConnection({
    host: process.env.DB_HOST!,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  });
  logger.info("Successfully initialized database connection");
}

export async function initDBConnectionUsingSecretManager() {
  logger.info("initializing database connection");
  const secretName = process.env.DB_CREDENTIALS_SECRET_NAME || "";
  if (isEmpty(secretName)) {
    console.error(
      "ERROR: DB_CREDENTIALS_SECRET_NAME environment variable is missing or empty. Did you forget to set in SAM template?"
    );
    throw internalServerErrorWith("Invalid application state");
  }
  const credentialString = await getSecretValue(secretName);
  if (isEmpty(secretName)) {
    console.error(`ERROR: AWS Secret manager does not have a secret with name: ${secretName}`);
    throw internalServerErrorWith("Invalid application state");
  }
  const credentials = JSON.parse(credentialString) as DBCredentials;
  logger.info(`creating db connection using ${connection}`);
  connection = await mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.dbname,
  });
  logger.info("Successfully initialized database connection");
}

async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    if (process.env.IS_OFFLINE) {
      console.log("offline connection");
      await initDBConnectionUsingEnv();
    } else {
      await initDBConnectionUsingSecretManager();
    }
  }
  return connection;
}

export async function addBook(book: Book): Promise<Book> {
  console.log("adding book.....");
  const _connection = await getConnection();
  // await createTable();
  await _connection.execute("INSERT INTO books (id, name, author, pages) VALUES (?, ?, ?, ?)", [
    book.id,
    book.name,
    book.author,
    book.pages,
  ]);
  return book;
}

export async function getBookById(id: string): Promise<Book> {
  const _connection = await getConnection();
  const [rows, fields] = await _connection.query<Book[]>("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0];
}

export async function deleteBookById(id: string): Promise<Book> {
  const _connection = await getConnection();
  const [rows, fields] = await _connection.query<Book[]>("DELETE FROM books WHERE id = ?", [id]);
  return rows[0];
}

export async function createTable() {
  const _connection = await getConnection();
  await _connection.execute(
    "CREATE TABLE books (id VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, pages SMALLINT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )"
  );
}
