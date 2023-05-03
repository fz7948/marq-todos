import React from "react";
import axios from "axios";
// zustand
import { useLocalStorage } from "../store";
// components
import { initialState } from "../App";
// types
import { SORT_TYPE, FormType } from "../types";

type Props = {
  onSetClientData: (message: FormType[]) => void;
  onSetSortType: (type: string) => void;
};

export default function SubmitInput(props: Props) {
  const { onSetClientData, onSetSortType } = props;

  const {
    id: localStorageId,
    update: localStorageIdUpdate, //
  } = useLocalStorage();

  const [message, setMessage] = React.useState<any>(initialState);

  const addTodoList = async () => {
    try {
      await axios.post("/test", message).then((res) => {
        onSetClientData(res.data.messages);
      });
      setMessage(initialState);
      onSetSortType(SORT_TYPE.all);
      localStorageIdUpdate(localStorageId);
    } catch (e) {
      console.error(e, "test post api error !");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage({
      ...message,
      id: localStorageId,
      content: value,
    });
  };
  return (
    <section className="mainpage_submit">
      <input onChange={handleMessageChange} value={message.content} />
      <button type="submit" onClick={addTodoList}>
        Add Todo
      </button>
    </section>
  );
}
