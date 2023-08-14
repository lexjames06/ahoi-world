export const isEqual = (obj1: any, obj2: any) => {
  if (
    typeof obj1 === "string" ||
    typeof obj1 === "number" ||
    typeof obj1 === "boolean" ||
    typeof obj1 === "undefined" ||
    obj1 === null
  ) {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1)) {
	let equal = true;

    if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
      return false;
    }

	for (let i = 0; i < obj1.length; i++) {
	  if (!isEqual(obj1?.[i], obj2?.[i])) {
		equal = false;
		break;
	  }
	}

	return equal;
  }

  let equal = true;

  for (let key in obj1) {
	if (!isEqual(obj1[key], obj2[key])) {
	  equal = false;
	  break;
	}
  }

  return equal;
};
