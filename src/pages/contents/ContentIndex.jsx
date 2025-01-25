import { useSearchParams } from "react-router-dom";

const ContentDetail = () => {
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");

  console.log(contentId);
  return <div>ContentDetail</div>;
};
export default ContentDetail;
