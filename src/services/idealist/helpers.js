export const removeProcessedProjectIds = async function (ids) {
  const newObj = {jobs: [], internships: [], volops: []};
  for (let [types, val] of Object.entries(ids)) {
    for (let x = 0; x < val.length; x++) {
      if (val[x].processed === 0) newObj[types].push(val[x]);
    }
  }

  return newObj;
};

export const sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const checkUnprocessedIds = async function (ids) {
  let unprocessed = 0;
  for (let [types, val] of Object.entries(ids)) {
    val.forEach((el) => {
      console.log(el);
      if (el.processed === 0) unprocessed++;
    });
  }

  return unprocessed;
};

// export truncate = async function (string, length, dots = '...') {
//   return string.length > length
//     ? string.substring(0, length - dots.length) + dots
//     : string;
// }
