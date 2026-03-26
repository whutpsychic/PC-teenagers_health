import * as XLSX from 'xlsx'

/**
 * 时间戳格式化工具
 * @param timestamp 时间戳/日期字符串
 * @returns yyyy-MM-dd HH:mm:ss
 */
function formatTimestamp(timestamp: number | string): string {
  if (!timestamp) return ''

  const date = new Date(Number(timestamp))
  if (isNaN(date.getTime())) return String(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 导出 JSON 为 Excel（中文表头 + 时间戳自动格式化）
 * @param data 表格数据
 * @param headers 表头配置（key: 字段名，label: 中文名称，isTime?: 是否时间戳）
 * @param fileName 文件名
 * @param sheetName sheet 名
 */
export function exportExcel<T>(
  data: T[],
  headers: Array<{ key: keyof T; label: string; isTime?: boolean }>,
  fileName = '数据导出.xlsx',
  sheetName = 'Sheet1',
) {
  // 1. 处理数据：中文表头 + 时间戳格式化
  const exportData = data.map((item) => {
    const row: Record<string, any> = {}

    headers.forEach(({ key, label, isTime }) => {
      let value: any = item[key]

      // 如果是时间戳，自动格式化
      if (isTime && value) {
        value = formatTimestamp(value as number | string)
      }

      row[label] = value
    })

    return row
  })

  // 2. 创建 Excel
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // 3. 下载
  XLSX.writeFile(workbook, fileName)
}
