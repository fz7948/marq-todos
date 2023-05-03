import { rest } from "msw";
import { FormType, SORT_TYPE } from "../App";

const data = { messages: [] as FormType[] };
let checkedById = new Set() as any;

export const handlers = [
  rest.get("/test", (req: any, res, ctx) => {
    const sortType = req.url.search.split("?")[1].split("=")[1];
    const newMessages = data.messages.reduce(
      (res: FormType[], cur: FormType) => {
        if (sortType === SORT_TYPE.all) {
          return [...res, cur];
        } else if (
          sortType === SORT_TYPE.active &&
          !checkedById.has(cur.id) //
        ) {
          return [...res, cur];
        } else if (
          sortType === SORT_TYPE.completed &&
          checkedById.has(cur.id)
        ) {
          return [...res, cur];
        }
        return res;
      },
      []
    );
    return res(
      ctx.status(200),
      ctx.json({
        messages: newMessages,
      })
    );
  }),

  rest.post("/test", (req: any, res, ctx) => {
    const baseMessages = [...data.messages];
    const newMessages = [req.body, ...baseMessages];
    data.messages = newMessages;

    return res(
      ctx.status(200),
      ctx.json({
        messages: newMessages,
      })
    );
  }),

  rest.put("/test", (req: any, res, ctx) => {
    const { id, value } = req.body;
    const newMessages = data.messages.reduce(
      (res: FormType[], cur: FormType) => {
        if (id === cur.id) {
          return [...res, { ...cur, content: value }];
        }
        return [...res, cur];
      },
      []
    );
    data.messages = newMessages;

    return res(
      ctx.status(200),
      ctx.json({
        messages: newMessages,
      })
    );
  }),

  rest.delete("/test", (req: any, res, ctx) => {
    const { id } = req.body;

    const newMessages = data.messages.reduce(
      (res: FormType[], cur: FormType) => {
        if (id === cur.id) {
          return res;
        }
        return [...res, cur];
      },
      []
    );
    data.messages = newMessages;

    return res(
      ctx.status(200),
      ctx.json({
        messages: newMessages,
      })
    );
  }),

  rest.post("/checked", (req: any, res, ctx) => {
    const { id } = req.body;
    const updatedCheckedById = new Set(checkedById);
    if (updatedCheckedById.has(id)) {
      updatedCheckedById.delete(id);
    } else {
      updatedCheckedById.add(id);
    }
    checkedById = updatedCheckedById;

    return res(
      ctx.status(200),
      ctx.json({
        messages: [...checkedById],
      })
    );
  }),
];
