import React from "react";
import axios from "axios";
import "./App.scss";
// components
import TodoList from "./components/TodoList";
import SubmitInput from "./components/SubmitInput";
// types
import { SORT_TYPE, FormType } from "./types";

export const initialState = {
  id: 0,
  content: "",
  created_at: "",
  updated_at: "",
  reference: [],
};

export default function App() {
  const [clientData, setClientData] = React.useState<FormType[]>([]);
  const [sortType, setSortType] = React.useState<string>(SORT_TYPE.all);

  React.useEffect(() => {
    try {
      axios
        .get("/test", { params: { sortType } })
        .then((res) => setClientData(res.data.messages));
    } catch (e) {
      console.error(e, "test get api error !");
    }
  }, [sortType]);

  return (
    <main className="App">
      <section className="mainpage">
        <h1>Marq-TODO ✏️</h1>
        <SubmitInput
          onSetClientData={(message: FormType[]) => setClientData(message)}
          onSetSortType={(type: string) => setSortType(type)}
        />
        <TodoList
          data={clientData}
          onSetClientData={(message: FormType[]) => setClientData(message)}
          onSetSortType={(type: string) => setSortType(type)}
          onSortType={sortType}
        />
      </section>
    </main>
  );
}
