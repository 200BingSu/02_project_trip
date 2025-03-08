import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useRecoilState } from "recoil";
import { menuAtom } from "../../../atoms/menuAtom";

interface MenuFormProps {
  id: number;
}

const MenuForm = ({ id }: MenuFormProps) => {
  const [menu, setMenu] = useRecoilState(menuAtom);
  const onChange = () => {};
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div>
      <ImgCrop>
        <Upload
          listType="picture-card"
          fileList={menu.menuPic}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={() => false}
          accept="image/*"
        >
          {menu.menuPic.length < 5 && "+ Upload"}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default MenuForm;
