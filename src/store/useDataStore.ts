import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type UseDataStoreInterface,
  type MyPersist,
  type DataInterface,
} from "./interface";

const useDataStore = create<UseDataStoreInterface, []>(
  (persist as MyPersist)(
    (set, get): UseDataStoreInterface => ({
      data: [],
      queue: [],
      setData: (data: Array<DataInterface>) => {
        set(() => ({ data }));
      },
      getData: async () => {
        let res = await (await fetch("http://localhost:3000/data/")).json();
        if (res != undefined) {
          get().setData(res as Array<DataInterface>);
        }
      },
      addData: async (data: DataInterface) => {
        await fetch("http://localhost:3000/data", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then(() => {
            alert("success");
            const queue = get().queue
            if (queue.length > 0) {
              const findData = queue.filter((item) => item.id !== data.id)

              get().setQueue(findData)
            }
            get().getData();
          })
          .catch((e: any) => {
            console.log("=====", e.message);
            alert("error");
            get().setQueue([
              ...get().queue,
              data,
            ])
          });
      },
      setQueue: (queue: Array<DataInterface>) => {
        set(() => ({ queue }));
      },
      clean: () => {
        get().setData([]);
        console.log(get().data);
      },
    }),
    {
      name: "data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDataStore;
