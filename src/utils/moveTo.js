export const moveTo = ref => {
  // console.log(ref);
  // console.log(`${ref.current}로 이동`);
  ref.current.scrollIntoView({ behavior: "smooth" });
};

export const moveTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
