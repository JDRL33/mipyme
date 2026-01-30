import { initDatabase } from "./database";
import { appStore } from "../store/appStore";

const useDatabase = async () => {
  const initStore = appStore((state) => state.initStore);

  await initDatabase();
  await initStore();
};

export default useDatabase;
