import { getData } from "./database";

export async function P_Count() {
  const sql = `SELECT * FROM inventario;`;
  const r = await getData(sql);
  console.log(r.length);
  return r.length;
}
