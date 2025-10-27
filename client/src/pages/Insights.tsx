import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Target, Zap, CheckCircle } from "lucide-react";

export default function Insights() {
  const { data: summary, isLoading } = trpc.dashboard.summary.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar dados</p>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  // Calcular insights
  const monthlyExpense = summary.totalExpense;
  const reservaRecomendada = monthlyExpense * summary.params.mesesReserva;
  const caixaAtual = summary.params.caixa;
  const temReserva = caixaAtual >= reservaRecomendada;
  const faltaReserva = Math.max(0, reservaRecomendada - caixaAtual);

  const taxaDividaMedia = summary.totalDebt > 0
    ? (summary.totalDebt * 0.05) // Estimativa de 5% de juros ao mês
    : 0;

  const ratioDebtToIncome = summary.totalIncome > 0
    ? (summary.totalDebt / summary.totalIncome) * 100
    : 0;

  const metaPatrimonioAtingida = summary.patrimonio >= summary.params.metaPatrimonio;
  const faltaPatrimonio = Math.max(0, summary.params.metaPatrimonio - summary.patrimonio);

  const goalsProgress = summary.totalGoalAmount > 0
    ? (summary.totalGoalProgress / summary.totalGoalAmount) * 100
    : 0;

  const insights = [];

  // Insight 1: Reserva de Emergência
  if (!temReserva) {
    insights.push({
      icon: AlertCircle,
      title: 'Construa sua Reserva de Emergência',
      description: `Você precisa de ${formatCurrency(reservaRecomendada)} (${summary.params.mesesReserva} meses de despesas). Atualmente tem ${formatCurrency(caixaAtual)}. Faltam ${formatCurrency(faltaReserva)}.`,
      type: 'warning',
      priority: 'high',
    });
  } else {
    insights.push({
      icon: CheckCircle,
      title: 'Reserva de Emergência Completa',
      description: `Parabéns! Você tem ${formatCurrency(caixaAtual)}, o que cobre ${summary.params.mesesReserva} meses de despesas.`,
      type: 'success',
      priority: 'low',
    });
  }

  // Insight 2: Dívidas
  if (summary.totalDebt > 0) {
    insights.push({
      icon: AlertCircle,
      title: 'Reduza suas Dívidas',
      description: `Você tem ${formatCurrency(summary.totalDebt)} em dívidas. Estima-se ${formatCurrency(Math.round(taxaDividaMedia))} de juros por mês. Priorize pagar dívidas com juros altos.`,
      type: 'warning',
      priority: 'high',
    });

    if (ratioDebtToIncome > 100) {
      insights.push({
        icon: AlertCircle,
        title: 'Dívida Acima da Renda',
        description: `Suas dívidas (${formatCurrency(summary.totalDebt)}) excedem sua renda mensal (${formatCurrency(summary.totalIncome)}). Considere buscar ajuda profissional.`,
        type: 'critical',
        priority: 'critical',
      });
    }
  } else {
    insights.push({
      icon: CheckCircle,
      title: 'Sem Dívidas',
      description: 'Excelente! Você não tem dívidas registradas. Continue assim!',
      type: 'success',
      priority: 'low',
    });
  }

  // Insight 3: Investimentos
  if (summary.totalInvested > 0) {
    const ganhoInvestimentos = summary.totalInvestmentValue - summary.totalInvested;
    insights.push({
      icon: TrendingUp,
      title: 'Seus Investimentos',
      description: `Você investiu ${formatCurrency(summary.totalInvested)} e agora tem ${formatCurrency(summary.totalInvestmentValue)}. Ganho: ${formatCurrency(ganhoInvestimentos)}.`,
      type: 'info',
      priority: 'medium',
    });
  } else {
    insights.push({
      icon: TrendingUp,
      title: 'Comece a Investir',
      description: 'Você ainda não tem investimentos. Considere começar a investir para fazer seu dinheiro trabalhar por você.',
      type: 'info',
      priority: 'medium',
    });
  }

  // Insight 4: Meta de Patrimônio
  if (!metaPatrimonioAtingida && summary.params.metaPatrimonio > 0) {
    insights.push({
      icon: Target,
      title: 'Meta de Patrimônio',
      description: `Sua meta é ${formatCurrency(summary.params.metaPatrimonio)}. Atualmente tem ${formatCurrency(summary.patrimonio)}. Faltam ${formatCurrency(faltaPatrimonio)}.`,
      type: 'info',
      priority: 'medium',
    });
  } else if (metaPatrimonioAtingida && summary.params.metaPatrimonio > 0) {
    insights.push({
      icon: CheckCircle,
      title: 'Meta de Patrimônio Atingida',
      description: `Parabéns! Você atingiu sua meta de ${formatCurrency(summary.params.metaPatrimonio)}!`,
      type: 'success',
      priority: 'low',
    });
  }

  // Insight 5: Metas de Economia
  if (summary.totalGoalAmount > 0) {
    insights.push({
      icon: Zap,
      title: 'Progresso nas Metas',
      description: `Você já economizou ${goalsProgress.toFixed(1)}% de suas metas. Continue assim!`,
      type: 'info',
      priority: 'medium',
    });
  }

  // Ordenar por prioridade
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  insights.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'critical':
        return 'border-l-red-500 bg-red-500/5';
      case 'info':
        return 'border-l-blue-500 bg-blue-500/5';
      default:
        return 'border-l-muted';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Análises e Insights
          </h1>
          <p className="text-muted-foreground">
            Recomendações personalizadas para melhorar sua saúde financeira
          </p>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Card key={index} className={`glass border-l-4 ${getColorClass(insight.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${getIconColor(insight.type)}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Dicas Adicionais */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Dicas para Melhorar sua Saúde Financeira
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">1. Rastreie suas Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Registre todas as suas transações para entender para onde seu dinheiro está indo. Isso ajuda a identificar áreas onde você pode economizar.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">2. Construa uma Reserva de Emergência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mantenha 3-6 meses de despesas em uma conta de fácil acesso. Isso protege você contra imprevistos sem comprometer suas metas.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">3. Negocie suas Dívidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Entre em contato com seus credores para negociar taxas de juros mais baixas ou planos de pagamento. Muitas vezes eles estão dispostos a ajudar.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">4. Invista no Seu Futuro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comece pequeno com investimentos de baixo risco como Tesouro Direto ou fundos de renda fixa. O tempo é seu maior aliado.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">5. Defina Metas Realistas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Estabeleça metas específicas, mensuráveis e com prazos. Isso mantém você motivado e focado no seu objetivo financeiro.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">6. Revise Regularmente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analise seus dados financeiros mensalmente. Ajuste seu orçamento conforme necessário e comemore seus progressos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

