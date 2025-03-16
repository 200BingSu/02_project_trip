interface QuestionProps {
  item: {
    id: number;
    question: string;
    answer: string;
  };
}

const Question = ({ item }: QuestionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>Q. {item.question}</div>
      <div>A. {item.answer}</div>
    </div>
  );
};

export default Question;
