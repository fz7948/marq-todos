import React from "react";
import axios from "axios";
import "./App.scss";
// zustand
import { useLocalStorage } from "./store";
// types
import { SORT_TYPE, FormType } from "./types";

const initialState = {
  id: 0,
  content: "",
  created_at: "",
  updated_at: "",
  reference: [],
};

export default function App() {
  const {
    id: localStorageId,
    update: localStorageIdUpdate, //
  } = useLocalStorage();

  const [message, setMessage] = React.useState<FormType>(initialState);
  const [clientData, setClientData] = React.useState<FormType[]>([]);
  const [sortType, setSortType] = React.useState<string>(SORT_TYPE.all);
  const [checkedById, setCheckedById] = React.useState<Set<number>>(new Set());
  const [editedById, setEditedById] = React.useState<Set<number>>(new Set());

  const editInputRef = React.useRef<any>(null);

  const addTodoList = async () => {
    try {
      await axios.post("/test", message).then((res) => {
        setClientData(res.data.messages);
      });
      setMessage(initialState);
      setSortType(SORT_TYPE.all);
      localStorageIdUpdate(localStorageId);
    } catch (e) {
      console.error(e, "test post api error !");
    }
  };

  const handleEditByIdUpdate = (id: number) => {
    const updatedEditedById = new Set(editedById);
    if (updatedEditedById.has(id)) {
      updatedEditedById.delete(id);
    } else {
      updatedEditedById.add(id);
    }
    setEditedById(updatedEditedById);
  };

  const updateTodoList = async (id: number) => {
    const editInputValue = editInputRef?.current?.value;
    try {
      await axios.put("/test", { id, value: editInputValue }).then((res) => {
        setClientData(res.data.messages);
      });
      editedById.delete(id);
      setSortType(SORT_TYPE.all);
    } catch (e) {
      console.error(e, "test put api error !");
    }
  };

  const deleteTodoList = async (id: number) => {
    try {
      await axios.delete("/test", { data: { id } }).then((res) => {
        setClientData(res.data.messages);
      });
      editedById.delete(id);
    } catch (e) {
      console.error(e, "test delete api error !");
    }
  };

  const updateCheckedId = async (data: FormType) => {
    try {
      await axios.post("/checked", { data }).then((res) => {
        setCheckedById(new Set(res.data.messages));
      });
    } catch (e) {
      console.error(e, "checked api error !");
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
        <section className="mainpage_submit">
          <input onChange={handleMessageChange} value={message.content} />
          <button type="submit" onClick={addTodoList}>
            Add Todo
          </button>
        </section>
        <section className="mainpage_list">
          <div className="mainpage_list_header">
            <h4>{`${clientData.length} tasks`}</h4>
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
            {clientData.map((data) => (
              <article
                key={data.id}
                className="mainpage_list_body_item wrapper"
              >
                <div className="mainpage_list_body_item">
                  <input
                    type="checkbox"
                    className="todo_checkbox"
                    checked={checkedById.has(data.id)}
                    onChange={() => updateCheckedId(data)}
                  />
                  {editedById.has(data.id) ? (
                    <input ref={editInputRef} className="input_edit" />
                  ) : (
                    <div className="mainpage_list_body_item_contents">
                      <h3
                        className={
                          checkedById.has(data.id) ? "completed" : undefined
                        }
                      >
                        {data.content}
                      </h3>
                      <div className="mainpage_list_body_item_contents_info">
                        <h6>{`ID: ${data.id}`}</h6>
                        <h6>{`작성일: ${data.created_at}`}</h6>
                        {data.updated_at && (
                          <h6>{`최종수정일: ${data.updated_at}`}</h6>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="button_wrapper">
                    {editedById.has(data.id) ? (
                      <>
                        <button onClick={() => handleEditByIdUpdate(data.id)}>
                          Cancel
                        </button>
                        <button onClick={() => updateTodoList(data.id)}>
                          Update
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditByIdUpdate(data.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTodoList(data.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mainpage_list_body_reference">
                  {clientData.map((item) => {
                    if (item.id === data.id) {
                      const newReference = item.reference.map(
                        (ref: number) => `@${ref}`
                      );
                      return (
                        <div className="mainpage_list_body_reference_font">
                          {`${newReference.join(", ")} `}
                        </div> //
                      );
                    }
                    return <></>;
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
