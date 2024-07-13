import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const NameCode = '26-0-0-26-223.56-726'
const EmailCode = '10.5-0-0-10.5-21.6-7'
const TitleCode = '15.75-0-0-15.75-223.56'
const OrgTitleCode = '12-0-0-12-223.56'
const JobTitleCode = '11.5-0-0-11.5-223.56'
const SkillsCode = '10.5-0-0-10.5-21.6'
const LeftTopicsCode = '13-0-0-13-21.6'

export default async function Read(filepath) {
  const items = await extractTextWithStyles(filepath)
  return {
    ...Profile(items),
    ...Experience(items),
    ...Skils(items),
    ...Languages(items),
    ...Educations(items)
  }
}

async function extractTextWithStyles(filePath) {
  const loadingTask = getDocument(filePath)
  const pdf = await loadingTask.promise
  const textInfo = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    let i = 0
    textInfo.push(...textContent.items)
  }
  return textInfo
}

function Profile(items) {
  const result = {}
  let i = 0
  for (const item of items) {
    const itemCode = item.transform.join('-')
    if (itemCode.includes(TitleCode) && item.str === 'Summary') {
      let desc = ''
      for (let j = 0; j < 50; j++) {
        const it = items[i + j + 1]
        const itCode = it.transform.join('-')
        if (!it?.str) continue
        if (itCode.includes(TitleCode)) {
          result['summary'] = desc
          break
        }
        desc += ' ' + it?.str
      }
    }
    if (itemCode.includes(EmailCode) && item.str) {
      result['email'] = item.str
    }
    if (itemCode.includes(NameCode) && item.str) {
      result['name'] = item.str
    }
    i++
  }
  return result
}

function Experience(items) {
  const result = []
  let start = false
  const companies = []
  const jobs = []
  const locations = []
  const dates = []
  const descriptions = []
  for (const i in items) {
    const idx = parseInt(i)
    if (!items[i].str.trim()) continue
    if (items[i].transform.join('-').includes(TitleCode) && items[i].str === 'Experience') {
      start = true
      continue
    }
    if (!start) continue
    if (items[i].transform.join('-').includes(TitleCode)) break
    if (items[i].transform.join('-').includes(OrgTitleCode)) {
      companies.push(items[i].str)
      continue
    }
    if (items[i].transform.join('-').includes(JobTitleCode)) {
      jobs.push(items[i].str)
      dates.push(items[idx + 2].str)
      locations.push(items[idx + 6].str)
      let desc = ''
      for (let j = 0; j < 50; j++) {
        const item = items[idx + 8 + j]
        const itemCode = item?.transform.join('-')
        if (!item?.str) continue
        if (itemCode.includes(OrgTitleCode) || itemCode.includes(TitleCode)) {
          descriptions.push(desc)
          break
        }
        if (item.str.length < 10) continue
        desc += ' ' + item?.str
      }
      continue
    }
  }
  for (const i in companies) {
    result.push({
      company: companies[i],
      job: jobs[i],
      location: locations[i],
      date: dates[i],
      descriptions: descriptions[i]
    })
  }
  return { experiences: result }
}

function Educations(items) {
  const result = []
  let start = false
  const yearRegexPattern = /· \(([0-9]+) - ([0-9]+)\)/g
  for (const i in items) {
    const item = items[i]
    const itemCode = item.transform.join('-')
    const idx = parseInt(i)
    if (itemCode.includes(TitleCode) && items[i].str === 'Education') {
      start = true
      continue
    }
    if (!start || !item.str.trim()) continue
    if (itemCode.includes(OrgTitleCode)) {
      const matchs = yearRegexPattern.exec(items[idx + 4]?.str) ?? []
      result.push({
        name: item.str,
        grage: items[idx + 2]?.str.split(',')[0].trim(),
        degree: items[idx + 2]?.str.split(',')[1].trim(),
        start_at: matchs[1] ?? new Date().getFullYear(),
        end_at: matchs[2]
      })
    }
  }
  return { educations: result }
}

function Skils(items) {
  const result = []
  let start = false
  for (const item of items) {
    const itemCode = item.transform.join('-')
    if (itemCode.includes(LeftTopicsCode) && item.str === 'Top Skills') {
      start = true
      continue
    }
    if (!start || !item.str) continue
    if (itemCode.includes(LeftTopicsCode) && start) break
    if (item.transform.join('-').includes(SkillsCode)) {
      result.push(item.str)
    }
  }

  return {
    skills: result
  }
}

function Languages(items) {
  const result = []
  let start = false
  for (const i in items) {
    const item = items[i]
    const itemCode = item.transform.join('-')
    if (itemCode.includes(LeftTopicsCode) && item.str === 'Languages') {
      start = true
      continue
    }
    if (!start || !item.str.trim()) continue
    if (itemCode.includes(LeftTopicsCode) && start) break
    if (item.transform.join('-').includes(SkillsCode)) {
      result.push({ name: item.str, level: items[parseInt(i) + 2].str })
    }
  }

  return {
    Languages: result
  }
}
