import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl, APP_LOGO, APP_TITLE } from "@/const";
import { ArrowRight, TrendingUp, Target, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Link href="/dashboard"><Dashboard /></Link>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="text-xl font-bold text-foreground">{APP_TITLE}</span>
          </div>
          <a href={getLoginUrl()}>
            <Button className="bg-primary hover:bg-primary/90">
              Entrar
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transforme Confusão em Mapa Claro
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie suas finanças com inteligência. Rastreie transações, reduza dívidas, invista no futuro e atinja suas metas.
          </p>
          <div className="flex gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Problema e Solução */}
      <section className="bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Você está endividado?
              </h2>
              <p className="text-muted-foreground mb-4">
                Muitas pessoas se veem presas em um ciclo de dívidas, sem saber por onde começar. Juros altos, falta de organização e sem um plano claro para sair dessa situação.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Sem controle sobre despesas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Dívidas acumuladas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Sem reserva de emergência
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Sem plano de ação
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                A solução FinanceZenn
              </h2>
              <p className="text-muted-foreground mb-4">
                Nós transformamos sua confusão financeira em um mapa claro e acionável. Com ferramentas inteligentes e insights personalizados, você recupera o controle.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Dashboard intuitivo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Rastreamento automático
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Análises em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Plano de ação personalizado
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Principais */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">
          Recursos Principais
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Rastreamento de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registre todas as suas receitas e despesas. Categorize e analise seus gastos em tempo real.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Gestão de Dívidas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe suas dívidas, calcule juros e receba recomendações para quitá-las rapidamente.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <Target className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle>Metas Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Defina metas de economia e acompanhe seu progresso. Celebre cada conquista no caminho.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <Zap className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Insights Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receba recomendações personalizadas baseadas em seus dados. Melhore sua saúde financeira.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Preço */}
      <section className="bg-card/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comece Sua Jornada Financeira
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Acesso completo ao FinanceZenn por um preço acessível
          </p>
          <div className="max-w-md mx-auto">
            <Card className="glass border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Plano Básico</CardTitle>
                <CardDescription>Tudo que você precisa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-primary">R$ 37</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 text-left text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Dashboard completo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Rastreamento ilimitado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Análises e insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Ebook "S.O.S Dívidas"
                  </li>
                </ul>
                <a href={getLoginUrl()}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Começar Agora
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Pronto para transformar sua vida financeira?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Junte-se a milhares de pessoas que já estão no caminho para a liberdade financeira.
        </p>
        <a href={getLoginUrl()}>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Começar Minha Jornada
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function Dashboard() {
  return null;
}

