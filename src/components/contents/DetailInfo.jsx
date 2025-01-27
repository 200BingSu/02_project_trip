import React from "react";

const DetailInfo = ({ contentData }) => {
  return (
    <div>
      {/* 소개 */}
      <div>
        <h2 className="text-[28px] font-semibold text-slate-700">소개</h2>
        <p className="text-[18px] text-slate-500 h-[125px] overflow-hidden text-ellipsis whitespace-nowrap ">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam eos,
          incidunt ex laudantium sequi eligendi autem vel quaerat ipsa odit
          natus nisi saepe pariatur rem quam porro. Id, sunt dolor? Maxime esse
          cum reprehenderit ullam tenetur distinctio provident laudantium quos
          laborum nobis cupiditate culpa suscipit excepturi quae accusamus
          fugiat vitae, fugit debitis ut eius eaque quisquam itaque! Ad, illum
          eaque. Ipsam nobis quis quos itaque dolore sunt corrupti atque
          reiciendis nulla voluptates unde, quo enim perferendis voluptatibus,
          est eos error magnam. Dicta consequatur deserunt, voluptatibus alias
          fugiat eius quod doloremque. At beatae rem explicabo, incidunt
          debitis, eveniet nam architecto in numquam qui quo quaerat, cum
          blanditiis. Et itaque sunt nostrum non saepe voluptas autem
          recusandae, adipisci id optio velit vero! Obcaecati cum, nam at
          voluptas quam veniam veritatis officia modi et, iste, vero
          voluptatibus? Quod illo blanditiis iste? Suscipit minus velit
          similique vero porro tempore quae. Est delectus eaque eligendi.
        </p>
      </div>
      {/* 위치 */}
      <div>
        <h2>위치</h2>
        <div>맵</div>
        {/* info */}
        <ul>
          <li>
            <h3>주소</h3>
            <p>주소</p>
            <p>주소 내용</p>
          </li>
          <li>
            <h3>전화</h3>
            <p>전화</p>
            <p>전화 내용</p>
          </li>
          <li>
            <h3>사업자 번호</h3>
            <p>사업자 번호</p>
            <p>사업자 번호 내용</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailInfo;
