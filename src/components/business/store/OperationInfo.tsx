import { ReactNode } from "react";
import { IStrf } from "../../../types/interface";

interface OperationInfoProps {
  children?: ReactNode;
  strfData: IStrf;
}
const OperationInfo = ({ strfData }: OperationInfoProps): JSX.Element => {
  return <div>OperationInfo</div>;
};

export default OperationInfo;
