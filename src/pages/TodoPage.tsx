import React from "react";
import axios from "axios";
// components
import TodoList from "../components/TodoList";
import SubmitInput from "../components/SubmitInput";
// types
import { FormType, SORT_TYPE } from "../types";

export default function TodoPage() {
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
  );
}
