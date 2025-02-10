const AfterCoupon = () => {
  const getAfter = async () => {
    try {
      const res = await axios.get(``, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.log("✅  error:", error);
    }
  };
  return <div>AfterCoupon</div>;
};

export default AfterCoupon;
