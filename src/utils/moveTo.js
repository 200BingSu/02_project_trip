export const moveTo = ref => {
  // console.log(ref);
  // console.log(`${ref.current}로 이동`);
  ref.current.scrollIntoView({ behavior: "smooth" });
};

export const moveTop = () => {
  window.scrollTo({ top: 10, behavior: "smooth" });
};
export const moveDown = () => {
  window.scrollTo({ bottom: 10, behavior: "smooth" });
};
