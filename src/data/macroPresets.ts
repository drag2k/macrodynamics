import { ScenarioPreset } from '../types';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'covid-qe-2020',
    title: '2020 팬데믹 무제한 양적완화 (대유동성 호황)',
    subtitle: '기준금리 0.25% + 무제한 채권매입(QE) + 달러 살포',
    fedRate: 0.25,
    usdkrw: 1120,
    policy: 'QE',
    phase: 'RECOVERY',
    description: '코로나 충격 대응을 위해 미 연준이 무제한 유동성을 투입. 달러 약세로 전환되며 글로벌 주식과 코스피, 부동산, 원자재가 전방위 급등한 시기.'
  },
  {
    id: 'tightening-2022',
    title: '2022 초인플레이션 급격한 긴축 (킹달러 충격)',
    subtitle: '기준금리 5.25% 급인상 + 양적긴축(QT) + 달러 회수',
    fedRate: 5.25,
    usdkrw: 1440,
    policy: 'QT',
    phase: 'SLOWDOWN',
    description: '40년 만의 인플레이션을 잡기 위해 자이언트 스텝(0.75%p 연속 인상)과 QT 단행. 킹달러 발생, 한국 외인 이탈 및 주식·채권 동반 폭락.'
  },
  {
    id: 'pivot-soft-landing',
    title: '연준 피벗(금리인하) 및 연착륙 국면',
    subtitle: '기준금리 3.50% 인하 기조 + 긴축 속도조절 + 안정세',
    fedRate: 3.50,
    usdkrw: 1300,
    policy: 'TAPERING',
    phase: 'EXPANSION',
    description: '인플레이션이 둔화되며 기준금리를 서서히 인하. 채권 금리 하락으로 채권 가격 반등, 성장주 중심의 선별적 랠리와 환율 안정세.'
  },
  {
    id: 'stagflation-shock',
    title: '스태그플레이션 위기 시나리오 (고물가+경기침체)',
    subtitle: '원자재 급등 + 고금리 장기화 + 경기 둔화',
    fedRate: 5.50,
    usdkrw: 1480,
    policy: 'RATE_HIKE',
    phase: 'RECESSION',
    description: '지정학적 리스크로 유가·곡물가 폭등. 물가를 잡기 위해 금리를 낮추지 못해 기업 실적과 소비가 꺾이고 채권과 주식 모두 방어가 어려운 최악의 국면.'
  }
];
