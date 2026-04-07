interface Databar {
  id: string | number | null
  name: string | null
  sex: string | null
  time: string | number | null
  age: number // 实际年龄数据（按月数计算）
  age1: number // 用于显示周岁年龄（取整数）
  age2: number // 用于显示月数（余数）
  number: string | number | null
  height: number | null
  weight: number | null
  bmi: string | number | null
}
