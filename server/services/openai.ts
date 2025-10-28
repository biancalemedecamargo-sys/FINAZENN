import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FinancialData {
  totalIncome: number;
  totalExpense: number;
  totalDebt: number;
  totalInvested: number;
  totalInvestmentValue: number;
  patrimonio: number;
  totalGoalAmount: number;
  totalGoalProgress: number;
  mesesReserva: number;
  caixa: number;
  metaPatrimonio: number;
}

export async function generateFinancialInsights(data: FinancialData): Promise<string> {
  try {
    const monthlyExpense = data.totalExpense;
    const reservaRecomendada = monthlyExpense * data.mesesReserva;
    const temReserva = data.caixa >= reservaRecomendada;
    const faltaReserva = Math.max(0, reservaRecomendada - data.caixa);

    const taxaDividaMedia = data.totalDebt > 0 ? (data.totalDebt * 0.05) / 100 : 0;
    const ratioDebtToIncome = data.totalIncome > 0 ? (data.totalDebt / data.totalIncome) * 100 : 0;
    const metaPatrimonioAtingida = data.patrimonio >= data.metaPatrimonio;
    const faltaPatrimonio = Math.max(0, data.metaPatrimonio - data.patrimonio);
    const goalsProgress = data.totalGoalAmount > 0 ? (data.totalGoalProgress / data.totalGoalAmount) * 100 : 0;

    const prompt = `
Você é um consultor financeiro especializado em educação financeira para pessoas endividadas. 
Analise os seguintes dados financeiros e forneça 3 recomendações práticas, acionáveis e motivadoras:

DADOS FINANCEIROS:
- Renda Mensal: R$ ${(data.totalIncome / 100).toFixed(2)}
- Despesa Mensal: R$ ${(data.totalExpense / 100).toFixed(2)}
- Dívidas Totais: R$ ${(data.totalDebt / 100).toFixed(2)}
- Investimentos: R$ ${(data.totalInvested / 100).toFixed(2)}
- Valor Total Investido: R$ ${(data.totalInvestmentValue / 100).toFixed(2)}
- Patrimônio Líquido: R$ ${(data.patrimonio / 100).toFixed(2)}
- Caixa Disponível: R$ ${(data.caixa / 100).toFixed(2)}
- Meta de Patrimônio: R$ ${(data.metaPatrimonio / 100).toFixed(2)}
- Progresso em Metas: ${goalsProgress.toFixed(1)}%

ANÁLISE:
- Tem Reserva de Emergência? ${temReserva ? 'Sim' : 'Não'}
- Falta para Reserva: R$ ${(faltaReserva / 100).toFixed(2)}
- Taxa de Dívida/Renda: ${ratioDebtToIncome.toFixed(1)}%
- Juros Estimados Mensais: R$ ${(taxaDividaMedia / 100).toFixed(2)}

Com base nesses dados, forneça:
1. UMA recomendação imediata (próximos 7 dias)
2. UMA recomendação de médio prazo (próximos 30 dias)
3. UMA recomendação de longo prazo (próximos 90 dias)

Seja motivador, prático e específico. Use linguagem simples e direta.
Responda em português brasileiro.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    return 'Não foi possível gerar insights no momento.';
  } catch (error) {
    console.error('Erro ao gerar insights com OpenAI:', error);
    throw error;
  }
}

export async function generateDebtPayoffPlan(debts: Array<{
  id: number;
  name: string;
  amount: number;
  interestRate: number;
  minPayment: number;
}>): Promise<string> {
  try {
    const debtsInfo = debts
      .map((d) => `- ${d.name}: R$ ${(d.amount / 100).toFixed(2)} (Taxa: ${(d.interestRate / 100).toFixed(1)}%, Mín: R$ ${(d.minPayment / 100).toFixed(2)})`)
      .join('\n');

    const prompt = `
Você é um especialista em gestão de dívidas. Analise as seguintes dívidas e crie um plano de quitação priorizado:

DÍVIDAS:
${debtsInfo}

Com base na análise, forneça:
1. Ordem de prioridade para pagar (método avalanche ou bola de neve)
2. Estratégia recomendada com justificativa
3. Estimativa de tempo para quitação total
4. Dicas para acelerar o processo

Seja prático, motivador e específico. Responda em português brasileiro.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    return 'Não foi possível gerar plano de quitação no momento.';
  } catch (error) {
    console.error('Erro ao gerar plano de quitação:', error);
    throw error;
  }
}

export async function generateInvestmentAdvice(investments: Array<{
  id: number;
  name: string;
  investedAmount: number;
  currentValue: number;
  type: string;
}>): Promise<string> {
  try {
    const investmentsInfo = investments
      .map((inv) => {
        const gain = inv.currentValue - inv.investedAmount;
        const gainPercent = inv.investedAmount > 0 ? ((gain / inv.investedAmount) * 100).toFixed(1) : '0';
        return `- ${inv.name} (${inv.type}): Investido R$ ${(inv.investedAmount / 100).toFixed(2)}, Atual R$ ${(inv.currentValue / 100).toFixed(2)} (${gainPercent}%)`;
      })
      .join('\n');

    const prompt = `
Você é um consultor de investimentos focado em educação financeira. Analise a carteira de investimentos e forneça recomendações:

INVESTIMENTOS:
${investmentsInfo}

Com base na análise, forneça:
1. Avaliação da diversificação atual
2. Recomendações de ajuste (se necessário)
3. Oportunidades de otimização
4. Dicas para melhorar retornos

Seja prático, educativo e motivador. Responda em português brasileiro.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    return 'Não foi possível gerar recomendações de investimento no momento.';
  } catch (error) {
    console.error('Erro ao gerar recomendações de investimento:', error);
    throw error;
  }
}

