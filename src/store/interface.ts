import { type StateCreator } from "zustand";
import { type PersistOptions } from "zustand/middleware";

export declare interface DataInterface {
  id: string;
  title: string;
}

export declare interface UseDataStoreInterface {
  data: Array<DataInterface>;
  queue: Array<DataInterface>;
  setQueue: (queue: Array<DataInterface>) => void;
  setData: (data: Array<DataInterface>) => void;
  getData: () => void;
  addData: (data: DataInterface) => void;
  clean: () => void;
}

export type MyPersist = (
  config: StateCreator<UseDataStoreInterface>,
  options: PersistOptions<UseDataStoreInterface>
) => StateCreator<UseDataStoreInterface>;
