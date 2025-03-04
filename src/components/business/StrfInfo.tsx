interface StrfInfoProps {
  name: string;
  id: string | number;
  category: string;
}

const StrfInfo = ({ name, id, category }: StrfInfoProps): JSX.Element => {
  return (
    <div className="bg-slate-100 px-4 py-3 mb-3">
      <h3>{name ?? "업체 이름"}</h3>
      <p className="text-base text-slate-400">
        {id ?? "1234"} | {category ?? "숙소"}
      </p>
    </div>
  );
};

export default StrfInfo;
