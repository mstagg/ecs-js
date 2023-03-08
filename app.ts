class TEST {
  val: number
  constructor(val: number) {
    this.val = val
  }
}

class TEST2 {
  val: number
  constructor(val: number) {
    this.val = val
  }
}

const map = new Map<Function, TEST>

const set = (t: TEST) => {
  map.set(t.constructor, t)
}

const test = new TEST(5);
const test2 = new TEST2(10);
set(test)
set(test2)

console.log(map.get(TEST))
console.log(map.get(TEST2))