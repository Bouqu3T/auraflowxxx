import { calculateBazi } from './bazi';

interface ReportInput {
  profile_id: string;
  scene: string;
  answers: {
    desired_effects: string[];
    color_preference: string[];
    style_preference: string;
    decoration_preference: string;
    bead_size: number;
  };
  birth_date: string;
  gender: string;
  location: string;
}

interface ReportOutput {
  report_id: string;
  body_strength: string;
  favorable_elements: string[];
  missing_elements: string[];
  radar_chart_data: {
    element: string;
    value: number;
  }[];
  summary_text: string;
  logic_chain: string[];
}

export const generateReport = (input: ReportInput): ReportOutput => {
  // 计算八字
  const baziResult = calculateBazi({
    birth_date: input.birth_date,
    gender: input.gender,
    location: input.location
  });
  
  // 生成报告ID
  const report_id = `REPORT-${Date.now()}`;
  
  // 计算缺失元素
  const allElements = ['木', '火', '土', '金', '水'];
  const missing_elements = allElements.filter(el => !baziResult.favorable_elements.includes(el));
  
  // 生成雷达图数据
  const radar_chart_data = allElements.map(element => ({
    element,
    value: baziResult.favorable_elements.includes(element) ? 80 : 40
  }));
  
  // 生成逻辑链
  const logic_chain = [
    `八字${baziResult.body_strength === 'strong' ? '偏强' : '偏弱'}`,
    `当前${input.scene}诉求权重最高`,
    `建议补${baziResult.favorable_elements.join(' / ')}元素`,
    // 这里可以根据场景和八字结果推荐具体的矿石
    `推荐适合的矿石组合`
  ];
  
  // 生成摘要文本
  const summary_text = `你的能量场偏${baziResult.body_strength === 'strong' ? '身强' : '身弱'}，当前${input.scene}诉求权重最高，建议补${baziResult.favorable_elements.join(' / ')}元素。`;
  
  return {
    report_id,
    body_strength: baziResult.body_strength,
    favorable_elements: baziResult.favorable_elements,
    missing_elements,
    radar_chart_data,
    summary_text,
    logic_chain
  };
};
