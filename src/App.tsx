import { useEffect, useMemo, useState } from "react";

interface DataInterface {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}
function App() {
  const [data, setData] = useState<Array<DataInterface>>([]);
  const [cache, setCache] = useState<boolean>(false)

  useEffect(() => {
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      deferredPrompt = e;
    });
    getData();
  }, []);

  async function getData() {
    let res = await (
      await fetch("https://jsonplaceholder.typicode.com/todos/")
    ).json();
    if (res != undefined) {
      setData(res);
    }
  }

  const postData = async () => {
    await fetch("https://jsonplaceholder.typicode.com/todos/", {
      method: "POST",
      body: JSON.stringify({
        title: "foo",
        body: "bar",
        userId: "1",
      }),
    }).then(() => {
      alert('success');
    }).catch((e: any) => {
      console.log('=====', e.message); 
      alert('error');
      window.localStorage.setItem(
        "todos-cache",
        JSON.stringify({
          title: "foo",
          body: "bar",
          userId: "1",
        })
      );
      setCache(true)
    });
  }

  return (
    <>
      <button onClick={() => postData()}>send data</button>
      {cache && (
        <button
          onClick={() => {
            setCache(false);
            window.localStorage.removeItem("todos-cache");
            postData();
          }}
        >
          re send
        </button>
      )}

      {data.map((item: DataInterface, i) => (
        <p key={i}>
          {i + 1}. {item.title}
        </p>
      ))}
    </>
  );
}

export default App;
