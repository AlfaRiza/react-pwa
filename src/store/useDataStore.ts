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
        let res = await (
          await fetch(
            `https://cors-hijacker.vercel.app/api?url=${encodeURIComponent(
              `${import.meta.env.VITE_API_URL}/data/`
            )}`,
            {
              headers: {
                "Content-Type": "text/html",
              },
            }
          )
        ).json();
        // `${(import.meta.env.VITE_API_URL)}/data/`
        if (res != undefined) {
          get().setData(res as Array<DataInterface>);
        }
      },
      addData: async (data: DataInterface) => {
        await fetch(
          `https://cors-hijacker.vercel.app/api?url=${encodeURIComponent(
            `${import.meta.env.VITE_API_URL}/data/`
          )}`,
          {
            headers: {
              "Content-Type": "text/html",
            },
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            method: "POST",
            body: JSON.stringify({
              id: data.id,
              title: data.title
            }),
          }
        )
          .then(() => {
            alert("success");
            const queue = get().queue;
            if (queue.length > 0) {
              const findData = queue.filter((item) => item.id !== data.id);

              get().setQueue(findData);
            }
            get().getData();
          })
          .catch((e: any) => {
            alert("error");
            get().setQueue([...get().queue, data]);
          });
      },
      setQueue: (queue: Array<DataInterface>) => {
        set(() => ({ queue }));
      },
      clean: () => {
        get().setData([]);
      },
    }),
    {
      name: "data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDataStore;
