import React from "react";
import axios from "axios";
// types
import { FormType, SORT_TYPE } from "../types";

type Props = {
  data: FormType[];
  onSetClientData: (message: FormType[]) => void;
  onSetSortType: (type: string) => void;
  onSortType: string;
};

export default function TodoList(props: Props) {
  const { data, onSetClientData, onSetSortType, onSortType } = props;

  const [editedById, setEditedById] = React.useState<Set<number>>(new Set());
  const [checkedById, setCheckedById] = React.useState<Set<number>>(new Set());

  const editInputRef = React.useRef<any>(null);

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
        onSetClientData(res.data.messages);
      });
      editedById.delete(id);
      onSetSortType(SORT_TYPE.all);
    } catch (e) {
      console.error(e, "test put api error !");
    }
  };

  const deleteTodoList = async (id: number) => {
    try {
      await axios.delete("/test", { data: { id } }).then((res) => {
        onSetClientData(res.data.messages);
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

  return (
    <section className="mainpage_list">
      <div className="mainpage_list_header">
        <h4>{`${data.length} tasks`}</h4>
        <div className="mainpage_list_header_sort">
          {Object.values(SORT_TYPE).map((value) => (
            <button
              type="button"
              key={value}
              className={onSortType === value ? "on" : "off"}
              onClick={() => onSetSortType(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="mainpage_list_body">
        {data.map((item: FormType) => (
          <article key={item.id} className="mainpage_list_body_item wrapper">
            <div className="mainpage_list_body_item">
              <input
                type="checkbox"
                className="todo_checkbox"
                checked={checkedById.has(item.id)}
                onChange={() => updateCheckedId(item)}
              />
              {editedById.has(item.id) ? (
                <input ref={editInputRef} className="input_edit" />
              ) : (
                <div className="mainpage_list_body_item_contents">
                  <h3
                    className={
                      checkedById.has(item.id) ? "completed" : undefined
                    }
                  >
                    {item.content}
                  </h3>
                  <div className="mainpage_list_body_item_contents_info">
                    <h6>{`ID: ${item.id}`}</h6>
                    <h6>{`작성일: ${item.created_at}`}</h6>
                    {item.updated_at && (
                      <h6>{`최종수정일: ${item.updated_at}`}</h6>
                    )}
                  </div>
                </div>
              )}
              <div className="button_wrapper">
                {editedById.has(item.id) ? (
                  <>
                    <button onClick={() => handleEditByIdUpdate(item.id)}>
                      Cancel
                    </button>
                    <button onClick={() => updateTodoList(item.id)}>
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEditByIdUpdate(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTodoList(item.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mainpage_list_body_reference">
              {data.map((dataItem: FormType) => {
                if (dataItem.id === item.id) {
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
  );
}
