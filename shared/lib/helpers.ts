export function PRINT(...args: any[]) {
  console.log(`✅ ============================= ✅`);
  args.forEach((arg) => {
    if (typeof arg === "object") {
      console.log(`:`, JSON.stringify(arg, null, 2));
    } else {
      console.log(`:`, arg);
    }
  });
  console.log(`✅ ============================= ✅`);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
