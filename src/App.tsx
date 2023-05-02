import React from "react";
import "./App.scss";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const SORT_TYPE = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

type FormType = {
  id: string;
  content: string;
};

const initialState = {
  id: "",
  content: "",
};

export default function App() {
  const [message, setMessage] = React.useState<FormType>(initialState);
  const [form, setForm] = React.useState<FormType[]>([]);
  const [sortType, setSortType] = React.useState(SORT_TYPE.all);

  // const handleFormSubmit = async () => {
  //   try {
  //     const res = await axios
  //       .post("/test", { id: "sd", password: "sds" })
  //       .then((res) => {
  //         console.log(res, "res ???");
  //       });
  //   } catch (e) {
  //     console.error(e, "post error !");
  //   }
  // };

  console.log(message, "message ?");

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage({ id: uuidv4(), content: value });
  };

  return (
    <main className="App">
      <section className="mainpage">
        <h1>Marq-TODO ✏️</h1>
        <section className="mainpage_submit">
          <input onChange={handleMessageChange} />
          <button type="submit">Add Todo</button>
        </section>
        <section className="mainpage_list">
          <div className="mainpage_list_header">
            <h4>5 tasks</h4>
            <div className="mainpage_list_header_sort">
              {Object.values(SORT_TYPE).map((value) => (
                <button
                  type="button"
                  key={value}
                  className={sortType === value ? "on" : "off"}
                  onClick={() => setSortType(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="mainpage_list_body">
            <div className="mainpage_list_body_item">
              <input type="checkbox" className="todo_checkbox" />
              <h3>Todo 1</h3>
              <div className="button_wrapper">
                <button type="button">Edit</button>
                <button type="button">Delete</button>
              </div>
            </div>
            <div className="mainpage_list_body_item"></div>
          </div>
        </section>
      </section>
    </main>
  );
}

// import React, { useState } from "react";
// import "./App.scss";

// async function callApi<T = any>({
//   url,
//   method,
// }: {
//   url: string;
//   method: string;
// }) {
//   const res = await fetch(url, { method });
//   const json = await res?.json();

//   if (!res.ok) {
//     // eslint-disable-next-line no-throw-literal
//     throw {
//       statusText: res.statusText,
//       json,
//     };
//   }

//   return json as T;
// }

// function App() {
//   const [fetchResult, setFetchResult] = useState<string[]>([]);

//   return (
//     <>
//       <button
//         className="button-with-margin"
//         onClick={async () => {
//           try {
//             const json = await callApi<{ messages: string }>({
//               url: "/test",
//               method: "post",
//             });

//             setFetchResult([...fetchResult, JSON.stringify(json.messages)]);
//           } catch (e) {
//             console.log("e", e);
//           }
//         }}
//       >
//         post test
//       </button>
//       <button
//         className="button-with-margin"
//         onClick={async () => {
//           try {
//             const json = await callApi<{ messages: string }>({
//               url: "/test",
//               method: "get",
//             });

//             setFetchResult([...fetchResult, JSON.stringify(json.messages)]);
//           } catch (e) {
//             console.log("e", e);
//           }
//         }}
//       >
//         get test
//       </button>
//       <button
//         className="button-with-margin"
//         onClick={async () => {
//           try {
//             const json = await callApi<{ messages: string }>({
//               url: "/test",
//               method: "put",
//             });

//             setFetchResult([...fetchResult, JSON.stringify(json.messages)]);
//           } catch (e) {
//             console.log("e", e);
//           }
//         }}
//       >
//         put test
//       </button>
//       <button
//         className="button-with-margin"
//         onClick={async () => {
//           try {
//             const json = await callApi<{ messages: string }>({
//               url: "/test",
//               method: "delete",
//             });

//             setFetchResult([...fetchResult, JSON.stringify(json.messages)]);
//           } catch (e) {
//             console.log("e", e);
//           }
//         }}
//       >
//         delete test
//       </button>
//       <button
//         className="button-with-margin clear"
//         onClick={() => setFetchResult([])}
//       >
//         Clear!
//       </button>
//       <br />
//       <br />
//       {fetchResult?.length > 0 && (
//         <ul className="fetch-result">
//           {[...fetchResult].reverse().map((v, i) => (
//             <li key={`${v}-${i}`}>{v}</li>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// }

// export default App;
