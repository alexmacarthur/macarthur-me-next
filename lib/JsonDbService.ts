import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

class JsonDbService {
  db;

  constructor(dbName = "json_db/db_main") {
    this.db = new JsonDB(new Config(dbName, true, false, "/"));
  }

  push(path: string, data) {
    this.db.push(path, data);
  }

  get(path = "/") {
    try {
      return this.db.getData(path);
    } catch (e) {
      console.log(`JSON data doesn't exist at path: ${path}`);
      return null;
    }
  }
}

export default JsonDbService;
