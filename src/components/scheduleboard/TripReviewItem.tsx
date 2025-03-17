const TripReviewItem = () => {
  return (
    <>
      {/* 유저 정보 */}
      <section className="flex items-center">
        {/* 사진 */}
        <div>
          <img src="" alt="" />
        </div>
        {/* 이름 */}
        <p>닉네임</p>
      </section>
      {/* 리뷰 */}
      <section>
        {/* 사진 */}
        <div>
          <img src="" alt="" />
        </div>
        {/* 글 */}
        <div>
          <h3>제목</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa nulla
            esse assumenda facere architecto, fugiat nesciunt fugit adipisci
            iste quidem illo iure accusantium, cumque alias sequi dolore magni
            aliquam aut.
          </p>
          {/* 정보 */}
          <ul></ul>
        </div>
      </section>
    </>
  );
};

export default TripReviewItem;
