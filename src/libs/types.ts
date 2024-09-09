import { RowDataPacket } from "mysql2";

export interface Book extends RowDataPacket {
  id: string;
  name: string;
  author: string;
  pages: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppError {
  body: string;
  statusCode: number;
  statusType: string;
}
