export const loadFeatures = () =>
  import("framer-motion").then((res) => res.domMax);
