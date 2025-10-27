import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Target } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
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

  const formatPercent = (value: number) => {
    return (value / 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name || 'Usuário'}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua situação financeira
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Saldo */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {formatCurrency(summary.balance)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                Renda: {formatCurrency(summary.totalIncome)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDownLeft className="h-4 w-4 mr-1 text-red-500" />
                Despesa: {formatCurrency(summary.totalExpense)}
              </div>
            </CardContent>
          </Card>

          {/* Patrimônio */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Patrimônio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {formatCurrency(summary.patrimonio)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                Investido: {formatCurrency(summary.totalInvestmentValue)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                Meta: {formatCurrency(summary.params.metaPatrimonio)}
              </div>
            </CardContent>
          </Card>

          {/* Dívidas */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dívidas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500 mb-2">
                {formatCurrency(summary.totalDebt)}
              </div>
              <p className="text-xs text-muted-foreground">
                Reduza suas dívidas para melhorar sua saúde financeira
              </p>
            </CardContent>
          </Card>

          {/* Metas */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progresso de Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {summary.totalGoalAmount > 0
                  ? formatPercent((summary.totalGoalProgress / summary.totalGoalAmount) * 100)
                  : '0'}
                %
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Target className="h-4 w-4 mr-1 text-yellow-500" />
                {formatCurrency(summary.totalGoalProgress)} de{' '}
                {formatCurrency(summary.totalGoalAmount)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seções Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transações Recentes */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>
                  Suas últimas 5 transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.recentTransactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma transação registrada ainda
                  </p>
                ) : (
                  <div className="space-y-4">
                    {summary.recentTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {tx.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            tx.type === 'income'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/transactions">
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todas as Transações
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/transactions">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Adicionar Transação
                  </Button>
                </Link>
                <Link href="/investments">
                  <Button variant="outline" className="w-full">
                    Meus Investimentos
                  </Button>
                </Link>
                <Link href="/debts">
                  <Button variant="outline" className="w-full">
                    Minhas Dívidas
                  </Button>
                </Link>
                <Link href="/goals">
                  <Button variant="outline" className="w-full">
                    Minhas Metas
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button variant="outline" className="w-full">
                    Análises e Insights
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Dica do Dia */}
            <Card className="glass border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Mantenha uma reserva de emergência equivalente a{' '}
                  <strong>{summary.params.mesesReserva} meses</strong> de despesas.
                  Isso ajudará você a lidar com imprevistos sem comprometer suas metas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

