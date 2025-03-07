import { selector } from "recoil";
import { chatDataAtom, IChatData } from "../atoms/chatAtom";

export const chatDataSelector = selector<IChatData[]>({
  key: "chatDataSelector",
  get: ({ get }): IChatData[] => {
    const chatData = get(chatDataAtom);
    const filterData = chatData.reduce<IChatData[]>((acc, curr) => {
      if (acc.find(item => item.chatId === curr.chatId)) {
        return [...acc];
      }
      return [...acc, curr];
    }, []);
    const reverseData = filterData.reverse();
    return reverseData;
  },
});
