import { FactCheckItem } from '../types';

export const FACT_CHECK_ITEMS: FactCheckItem[] = [
  {
    id: 'fc-1',
    slideNumber: 2,
    slideTitle: '금리, 통화량, 채권(美국채)',
    originalText: '채권금리가 상승하면 수익률 ↑ 평가가격 ↓ / 채권을 보유하고 있는 경우, 채권금리가 상승하면 평가가격↓ 수익률 ↓',
    issueType: 'CONCEPTUAL_CONFUSION',
    severity: 'HIGH',
    critique: '채권 시장에서 "채권금리"와 "채권수익률(Yield to Maturity)"은 동일한 개념입니다. 또한 "보유자의 실현수익률(Total Return)"과 "채권 유통수익률(Yield)"을 구별 없이 \'수익률\'이라는 단어로 혼용하여, 한쪽에서는 "금리 상승시 수익률 상승", 다른 쪽에서는 "보유시 수익률 하락"으로 상충되게 기술되어 초심자에게 심각한 혼란을 초래합니다.',
    correction: '명확한 용어 분리가 필수적입니다:\n1) 채권금리(= 시장유통수익률 Yield): 신규 매수자 관점의 연간 기대수익률\n2) 채권 평가가격(Price): 금리와 100% 역의 관계 (금리↑ → 가격↓)\n3) 기존 보유자의 자본손익(Capital Gain/Loss): 금리 상승 시 평가손실 발생으로 총수익률(Total Return) 악화',
    deepDiveNote: '공식 정리: P = C / (1+r) + ... + (C+M) / (1+r)^n. 할인율 r(시장금리)이 분모에 위치하므로 채권가격 P는 금리와 정확히 역의 관계입니다.',
    confirmed: false
  },
  {
    id: 'fc-2',
    slideNumber: 3,
    slideTitle: '양적완화, 테이퍼링, 긴축',
    originalText: '테이퍼링/양적긴축 : 달러회수 : 채권매도/금리인상',
    issueType: 'FACTUAL_ERROR',
    severity: 'HIGH',
    critique: '테이퍼링(Tapering)과 양적긴축(QT, Quantitative Tightening)은 완전히 다른 정책 단계입니다. 테이퍼링은 "달러 회수"나 "채권 매도"가 아니며, 자산 매입 속도를 서서히 늦추는 단계(수도꼭지 물줄기를 줄일 뿐 여전히 통화 공급 중)입니다. 실제 달러 회수와 채권 매각(대차대조표 축소)은 \'양적긴축(QT)\'입니다.',
    correction: '4단계 정밀 파이프라인으로 구분해야 합니다:\n[1단계: 양적완화(QE)] 대규모 채권 매입, 달러 대량 공급\n[2단계: 테이퍼링(Tapering)] 매입 규모 점진적 축소 (유동성 순공급 유지, 증가율 둔화)\n[3단계: 기준금리 인상(Rate Hike)] 정책금리 인상으로 신용팽창 억제\n[4단계: 양적긴축(QT)] 만기 채권 재투자 중단 및 보유채권 매각으로 시중 달러 직접 회수',
    deepDiveNote: '2021~2022년 미 연준의 실제 로드맵: 테이퍼링 선언(21년 11월) → 테이퍼링 종료 및 첫 금리인상(22년 3월) → 양적긴축(QT) 개시(22년 6월).',
    confirmed: false
  },
  {
    id: 'fc-3',
    slideNumber: 1,
    slideTitle: '환율 입문',
    originalText: '환율이 높다 = 달러가 비싸다 = 미국채, 주식, 달러환전, 예금 불리 (떨어질 가능성/환차손)',
    issueType: 'OMISSION_OR_CONTEXT',
    severity: 'MEDIUM',
    critique: '이 설명은 "원화(KRW)를 들고 있는 한국인 투자자가 새롭게 미국 자산을 매수할 때(신규 진입자)"에만 참(True)입니다. 반대로 이미 미국 주식이나 달러를 보유하고 있는 기존 투자자에게는 환율이 높을 때가 원화 환산 자산가치가 극대화되어 "환차익 실현(매도)에 가장 유리한 시점"입니다.',
    correction: '"원화 보유자의 [신규 매수 진입 시점] 기준"이라는 전제조건을 명시해야 합니다. 또한 기존 보유자에게는 [환차익 익절 기회]라는 양방향 포지션 관점을 제공해야 왜곡이 없습니다.',
    deepDiveNote: '투자 의사결정 매트릭스: 고환율(1,400원대) 국면 = 신규 매수 불리(환차손 위험) VS 기존 보유자 달러 매도/수익실현 유리. 저환율(1,100원대) 국면 = 신규 분할 매수 적기(환차익 기대).',
    confirmed: false
  },
  {
    id: 'fc-4',
    slideNumber: 1,
    slideTitle: '환율 입문',
    originalText: '(원달러) 환율상승 → 수출 O / KOSPI 하락',
    issueType: 'CONCEPTUAL_CONFUSION',
    severity: 'MEDIUM',
    critique: '전통 무역이론에서는 원화 약세(환율 상승)가 수출 가격경쟁력을 높여 수출기업 실적 개선 및 주가 부양 요인으로 보았습니다. 그러나 현대 한국 증시에서는 환율 급등 시: 1) 원유·원자재 수입단가 폭등으로 무역수지 악화 2) 외국인의 환차손 회피를 위한 KOSPI 대량 매도 3) 자본유출로 인해 오히려 코스피가 급락합니다.',
    correction: '단순히 "수출 O"로 단정짓기보다, "과거 전통 모델(수출 가격경쟁력 개선)"과 "현대 글로벌 금융 메커니즘(외인 자금이탈, 원자재 수입원가 폭등, 무역조건 악화)"의 이중 구조를 다이어그램으로 명쾌하게 대비시켜야 합니다.',
    deepDiveNote: '한국 수출 기업의 글로벌 가치사슬(GVC) 특성상 해외 원자재와 부품을 수입해 가공 수출하므로, 환율 상승이 일방적 호재가 아닌 마진 압박 요인으로 작용합니다.',
    confirmed: false
  },
  {
    id: 'fc-5',
    slideNumber: 2,
    slideTitle: '금리, 통화량, 채권(美국채)',
    originalText: '역전 : 단기금리가 장기금리보다 더 높아지는 현상 (역전 11~35개월 - 평균 21개월 후 경제위기 도래)',
    issueType: 'OMISSION_OR_CONTEXT',
    severity: 'MEDIUM',
    critique: '장단기 금리차 역전 후 경기침체 도래 통계는 역사적으로 유효하나, 핵심적인 트리거 메커니즘이 빠져 있습니다. 시장이 진짜 위기를 겪는 시점은 "역전 중일 때"가 아니라 "역전이 해소되며 단기금리가 급락할 때(Bull Steepening / 연준의 긴급 금리인하 시점)"입니다.',
    correction: '"역전 발생 시점"은 경고 신호이며, 진짜 주식시장 급락과 경기침체 충격은 "연준이 부랴부랴 금리를 내리며 역전이 정상화되는 언인버전(Un-inversion) 국면"에 발생한다는 동태적 타임라인을 추가해야 합니다.',
    deepDiveNote: '1990년, 2000년 닷컴버블, 2007년 서브프라임, 2020년 팬데믹 모두 역전된 금리차가 다시 0 위로 치솟는 국면에서 증시 최대 하락이 발생했습니다.',
    confirmed: false
  }
];
