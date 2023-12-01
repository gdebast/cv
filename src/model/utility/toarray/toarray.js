import { ASSERT_TYPE } from "../assert/assert";

export const setToArray = function (set) {
  ASSERT_TYPE(set, Set);
  const result = [];
  set.forEach((elt) => {
    result.push(elt);
  });
  return result;
};
