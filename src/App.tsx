import React from "react";
import "./App.scss";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const SORT_TYPE = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export type FormType = {
  id: string;
  content: string;
};

const initialState = {
  id: "",
  content: "",
};

export default function App() {
  const [message, setMessage] = React.useState<FormType>(initialState);
  const [clientData, setClientData] = React.useState<FormType[]>([]);
  const [sortType, setSortType] = React.useState<string>(SORT_TYPE.all);
  const [checkedById, setCheckedById] = React.useState<Set<string>>(new Set());
  const [editedById, setEditedById] = React.useState<Set<string>>(new Set());

  const editInputRef = React.useRef<any>(null);

  const addTodoList = async () => {
    try {
      await axios.post("/test", message).then((res) => {
        setClientData(res.data.messages);
      });
      setMessage(initialState);
      setSortType(SORT_TYPE.all);
    } catch (e) {
      console.error(e, "test post api error !");
    }
  };

  const handleEditClick = (id: string) => {
    const updatedEditedById = new Set(editedById);
    if (updatedEditedById.has(id)) {
      updatedEditedById.delete(id);
    } else {
      updatedEditedById.add(id);
    }
    setEditedById(updatedEditedById);
  };

  const updateTodoList = async (id: string) => {
    const editInputValue = editInputRef?.current?.value;
    try {
      await axios.put("/test", { id, value: editInputValue }).then((res) => {
        setClientData(res.data.messages);
      });
      editedById.delete(id);
    } catch (e) {
      console.error(e, "test put api error !");
    }
  };

  const deleteTodoList = async (id: string) => {
    try {
      await axios.delete("/test", { data: { id } }).then((res) => {
        setClientData(res.data.messages);
      });
      editedById.delete(id);
    } catch (e) {
      console.error(e, "test delete api error !");
    }
  };

  const updateCheckedId = async (id: string) => {
    try {
      await axios.post("/checked", { id }).then((res) => {
        setCheckedById(new Set(res.data.messages));
      });
    } catch (e) {
      console.error(e, "checked api error !");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage({ id: uuidv4(), content: value });
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
              <div className="mainpage_list_body_item" key={data.id}>
                <input
                  type="checkbox"
                  className="todo_checkbox"
                  checked={checkedById.has(data.id)}
                  onChange={() => updateCheckedId(data.id)}
                />
                {editedById.has(data.id) ? (
                  <input ref={editInputRef} className="input_edit" />
                ) : (
                  <h3
                    className={
                      checkedById.has(data.id) ? "completed" : undefined
                    }
                  >
                    {data.content}
                  </h3>
                )}
                <div className="button_wrapper">
                  {editedById.has(data.id) ? (
                    <button onClick={() => updateTodoList(data.id)}>
                      Update
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditClick(data.id)}
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
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
