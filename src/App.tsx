import { useEffect, useMemo, useState } from "react";
import useDataStore from "./store";
import { DataInterface } from "./store/interface";

function App() {
  const {
    data,
    getData,
    addData,
    queue
    // clean
  } = useDataStore()
  useEffect(() => {
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      deferredPrompt = e;
    });
    getData();
  }, []);

  const [isOnline, set_isOnline] = useState(true);
  let interval: number | undefined = undefined;

  const InternetErrMessagenger = () => set_isOnline(navigator.onLine === true); // for do like this shortform

  useEffect(() => {
    interval = setInterval(InternetErrMessagenger, 1); // call the function name only not with function with call `()`
    return () => {
      clearInterval(interval); // for component unmount stop the interval
    };
  }, []);

  useEffect(() => {
    if (!isOnline) return

    if (queue.length > 0) {
      queue.forEach((item: DataInterface) => {
        addData(item)
      })
    }

  }, [isOnline])

  const postData = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // alert(result)

    addData({
      id: result,
      title: `${result}`
    })
  }

  return (
    <>
      <button onClick={() => postData()}>send data</button>
      {String(isOnline)}

      <p>Queue: </p>{queue && (
        <>
          <p>{queue.length}</p>
          <ul>
            {
              queue.map((item: DataInterface) => {
                return <li>{item.title}</li>;
              })
            }
          </ul>
        </>
      )}
      {/* {cache && (
        <button
          onClick={() => {
            setCache(false);
            window.localStorage.removeItem("todos-cache");
            postData();
          }}
        >
          re send
        </button>
      )} */}
      <table className="table-auto border">
        <thead>
          <tr>
            <th className="border">No</th>
            <th className="border">Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: DataInterface, i) => (
            // <p key={i}>
            //   {i + 1}. {item.title}
            // </p>
            <tr key={i}>
              <td className="border">{i + 1}</td>
              <td className="border">{item.title || item.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
