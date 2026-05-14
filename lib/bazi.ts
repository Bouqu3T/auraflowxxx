import { Solar } from 'lunar-javascript';

interface BaziInput {
  birth_date: string; // YYYY-MM-DD格式
  gender: string;
  location: string;
}

interface BaziOutput {
  favorable_elements: string[];
  body_strength: 'strong' | 'weak';
}

// 简化的八字计算逻辑（实际项目中需要更复杂的算法）
export const calculateBazi = (input: BaziInput): BaziOutput => {
  const { birth_date, gender } = input;
  
  // 使用lunar-javascript库获取农历信息
  const solar = Solar.fromYmd(
    parseInt(birth_date.split('-')[0]),
    parseInt(birth_date.split('-')[1]),
    parseInt(birth_date.split('-')[2])
  );
  const lunar = solar.getLunar();
  
  // 获取年、月、日、时的天干地支
  const yearGan = lunar.getYearGan();
  const yearZhi = lunar.getYearZhi();
  const monthGan = lunar.getMonthGan();
  const monthZhi = lunar.getMonthZhi();
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const timeGan = lunar.getTimeGan(12); // 假设中午12点
  const timeZhi = lunar.getTimeZhi(12);
  
  // 简化的五行计算（实际项目中需要更复杂的算法）
  const elements = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  
  // 计算五行分布
  const yearElement = elements[yearGan] || '土';
  const monthElement = elements[monthGan] || '土';
  const dayElement = elements[dayGan] || '土';
  const timeElement = elements[timeGan] || '土';
  
  // 统计五行数量
  const elementCount = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };
  
  [yearElement, monthElement, dayElement, timeElement].forEach(element => {
    elementCount[element]++;
  });
  
  // 简化的身强/身弱判断
  // 假设以日柱天干为日主，判断身强/身弱
  const dayElementStrength = elementCount[dayElement];
  const bodyStrength: 'strong' | 'weak' = dayElementStrength >= 2 ? 'strong' : 'weak';
  
  // 简化的喜用五行计算
  let favorableElements: string[] = [];
  
  if (bodyStrength === 'strong') {
    // 身强宜泄，选择克制日主的五行
    if (dayElement === '木') favorableElements = ['金', '火'];
    else if (dayElement === '火') favorableElements = ['水', '土'];
    else if (dayElement === '土') favorableElements = ['木', '金'];
    else if (dayElement === '金') favorableElements = ['火', '水'];
    else if (dayElement === '水') favorableElements = ['土', '木'];
  } else {
    // 身弱宜补，选择帮扶日主的五行
    if (dayElement === '木') favorableElements = ['木', '水'];
    else if (dayElement === '火') favorableElements = ['火', '木'];
    else if (dayElement === '土') favorableElements = ['土', '火'];
    else if (dayElement === '金') favorableElements = ['金', '土'];
    else if (dayElement === '水') favorableElements = ['水', '金'];
  }
  
  return {
    favorable_elements: favorableElements,
    body_strength: bodyStrength
  };
};
