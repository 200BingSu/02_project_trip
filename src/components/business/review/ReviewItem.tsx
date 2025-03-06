import { Rate } from "antd";
import { ProfilePic } from "../../../constants/pic";
import { useState } from "react";

const ReviewItem = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-4">
      {/* 유저 리뷰 */}
      <section className="flex flex-col gap-3">
        {/* 유저 정보 */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-200 rounded-full w-10 h-10">
            <img src={`${ProfilePic}/profile.png`} alt="" />
          </div>
          <p>닉네임</p>
        </div>
        {/* 별점, 작성일 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rate value={5} disabled />
            <p className="text-sm font-semibold text-slate-700">5</p>
          </div>
          <p className="text-sm text-slate-500">2025-03-06</p>
        </div>
        {/* 리뷰 내용 */}
        <div>
          <p
            className={`text-base text-slate-700 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
              isOpen ? "max-h-[1000px]" : "max-h-[72px]"
            }`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur odit in, cumque, mollitia quaerat dicta totam
            temporibus facere ullam officiis eius explicabo veniam, fugiat est
            voluptate amet. Quo, ad quisquam. Fuga distinctio blanditiis
            obcaecati doloribus autem nobis molestiae ducimus omnis accusantium
            itaque voluptatem, modi ex soluta sit odio commodi. Ullam labore
            numquam aliquid nisi est dolorem sint maxime totam excepturi. Autem
            vero maxime natus veritatis suscipit voluptatem similique, rem
            corporis corrupti exercitationem labore repudiandae accusamus, eum
            cum fuga tenetur nostrum. Quod corporis, optio praesentium
            consequuntur facere neque eum quis voluptatem!
          </p>
          <button
            type="button"
            className="text-primary text-base font-semibold mt-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "접기" : "더보기"}
          </button>
        </div>
      </section>
      {/* 사장님 리뷰 */}
      <section></section>
    </div>
  );
};

export default ReviewItem;
