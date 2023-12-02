import { ASSERT_TYPE } from "../assert/assert";

export const setToArray = function (set) {
  ASSERT_TYPE(set, Set);
  const result = [];
  set.forEach((elt) => {
    result.push(elt);
  });
  return result;
};

export const mapToArray = function (map, sortingFnc = null) {
  ASSERT_TYPE(map, Map);
  const array = [];
  map.forEach(function (elt) {
    array.push(elt);
  });
  if (sortingFnc) array.sort(sortingFnc);
  return array;
};
