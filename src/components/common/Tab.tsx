import { Children, ReactNode } from "react";

interface IList {
  label: string | ReactNode;
  icon?: ReactNode;
  children: string | ReactNode;
}

interface TabProps {
  children?: ReactNode;
  list: IList[];
  current: number;
  changeCateIndex: (index: number) => void;
}

/**
 * ## Tab
 * ### list
 * - 탭 제목
 *  interface IList {
 *      label: string | ReactNode;
 *      icon?: ReactNode;
 * }
 * ### current
 * - 현재 순서
 * - 부모 컴포넌트에 current의 기준이 되는 useState가 필요.
 * - 예: const [CateIndex, setCateIndex]=useState(0)
 * ### changeCateIndex
 * - setCateIndex(index)를 할 함수
 */
const Tab = ({ list, current, changeCateIndex }: TabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-3">
      {/* 탭 */}
      <section>
        <ul className="flex items-center w-full">
          {list.map((item, index) => {
            return (
              <li
                key={index}
                className={`w-full flex items-center justify-center gap-2 text-lg font-semibold py-2 cursor-pointer
          ${current === index ? "text-primary border-b-4 border-primary" : "text-slate-400 border-b-2 border-slate-200"}
          transition-all duration-300`}
                onClick={() => {
                  changeCateIndex(index);
                }}
              >
                {item.icon}
                {item.label}
              </li>
            );
          })}
        </ul>
      </section>
      {/* 내용 */}
      <section>{list[current].children}</section>
    </div>
  );
};

export default Tab;
