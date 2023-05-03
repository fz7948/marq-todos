import { rest } from "msw";
// types
import { FormType, SORT_TYPE } from "../types";
// utils
import { toStringByFormatting } from "../utils";

const data = { messages: [] as FormType[] };
let checkedById = new Set() as any;
let messagesById = new Set() as any;

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
    const { id, content } = req.body;
    const baseMessages = [...data.messages];
    const referenceId = [] as Array<number>;
    const newContent = content
      .split(" @")
      .reduce((res: string[], cur: string) => {
        if (!isNaN(Number(cur))) {
          if (messagesById.has(+cur)) {
            referenceId.push(+cur);
          }
          return res;
        }
        return [...res, cur];
      }, [])
      .join(" @");

    const newMessages = [
      {
        ...req.body,
        content: newContent,
        reference: referenceId,
        created_at: toStringByFormatting(new Date()),
      },
      ...baseMessages,
    ];
    messagesById.add(id);
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
          return [
            ...res,
            {
              ...cur,
              content: value,
              updated_at: toStringByFormatting(new Date()),
            },
          ];
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
        const filterReference = cur.reference.filter((item) => item !== id);
        return [...res, { ...cur, reference: filterReference }];
      },
      []
    );
    data.messages = newMessages;
    messagesById.delete(id);

    return res(
      ctx.status(200),
      ctx.json({
        messages: newMessages,
      })
    );
  }),

  rest.post("/checked", (req: any, res, ctx) => {
    const { data } = req.body;

    const referenceCheck = data.reference.every((referenceId: number) => {
      if (checkedById.has(referenceId)) {
        return true;
      }
      return false;
    });

    const updatedCheckedById = new Set(checkedById);
    if (referenceCheck) {
      if (updatedCheckedById.has(data.id)) {
        updatedCheckedById.delete(data.id);
      } else {
        updatedCheckedById.add(data.id);
      }
    } else {
      updatedCheckedById.delete(data.id);
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
