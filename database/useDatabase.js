import React, { useEffect } from "react";
import { initDatabase } from "./database";
import { appStore } from "../store/appStore";

const useDatabase = () => {
  const initStore = appStore((state) => state.initStore);
  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await initStore();
    };
    init();
  }, []);
};

export default useDatabase;
