import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogOut, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Config() {
  const { user, logout } = useAuth();
  const { data: params, isLoading, refetch } = trpc.userParams.get.useQuery();
  const updateMutation = trpc.userParams.update.useMutation();

  const [formData, setFormData] = useState({
    caixa: params?.caixa ? (params.caixa / 100).toString() : '0',
    nomeUsuario: params?.nomeUsuario || '',
    mesesReserva: params?.mesesReserva?.toString() || '3',
    metaPatrimonio: params?.metaPatrimonio ? (params.metaPatrimonio / 100).toString() : '0',
    taxaRetorno: params?.taxaRetorno ? (params.taxaRetorno / 100).toString() : '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        caixa: Math.round(parseFloat(formData.caixa) * 100),
        nomeUsuario: formData.nomeUsuario,
        mesesReserva: parseInt(formData.mesesReserva),
        metaPatrimonio: Math.round(parseFloat(formData.metaPatrimonio) * 100),
        taxaRetorno: Math.round(parseFloat(formData.taxaRetorno) * 100),
      });
      toast.success('Configurações atualizadas com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao atualizar configurações');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Desconectado com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e dados financeiros
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil do Usuário */}
          <div className="lg:col-span-1">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="text-lg font-semibold text-foreground">
                    {user?.name || 'Usuário'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold text-foreground">
                    {user?.email || 'Não informado'}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="glass mt-6 border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-base">Dicas de Configuração</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Caixa:</strong> Seu saldo atual em dinheiro disponível.
                </p>
                <p>
                  <strong>Meses de Reserva:</strong> Quantos meses de despesas você quer manter em reserva de emergência.
                </p>
                <p>
                  <strong>Meta de Patrimônio:</strong> Seu objetivo de patrimônio líquido total.
                </p>
                <p>
                  <strong>Taxa de Retorno:</strong> Taxa média esperada de retorno nos seus investimentos (%).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Configurações Financeiras */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Parâmetros Financeiros</CardTitle>
                <CardDescription>
                  Atualize suas informações financeiras e preferências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome do Usuário */}
                  <div>
                    <label className="text-sm font-medium">Nome de Usuário</label>
                    <Input
                      placeholder="Seu nome"
                      value={formData.nomeUsuario}
                      onChange={(e) => setFormData({ ...formData, nomeUsuario: e.target.value })}
                    />
                  </div>

                  {/* Caixa */}
                  <div>
                    <label className="text-sm font-medium">Saldo em Caixa (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.caixa}
                      onChange={(e) => setFormData({ ...formData, caixa: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Seu saldo atual disponível
                    </p>
                  </div>

                  {/* Meses de Reserva */}
                  <div>
                    <label className="text-sm font-medium">Meses de Reserva de Emergência</label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      placeholder="3"
                      value={formData.mesesReserva}
                      onChange={(e) => setFormData({ ...formData, mesesReserva: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Quantos meses de despesas você quer manter como reserva
                    </p>
                  </div>

                  {/* Meta de Patrimônio */}
                  <div>
                    <label className="text-sm font-medium">Meta de Patrimônio (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.metaPatrimonio}
                      onChange={(e) => setFormData({ ...formData, metaPatrimonio: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Seu objetivo de patrimônio líquido total
                    </p>
                  </div>

                  {/* Taxa de Retorno */}
                  <div>
                    <label className="text-sm font-medium">Taxa de Retorno Esperada (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.taxaRetorno}
                      onChange={(e) => setFormData({ ...formData, taxaRetorno: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Taxa média esperada de retorno nos seus investimentos
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Salvar Configurações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Sobre o FinanceZenn</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                FinanceZenn é um aplicativo de gestão financeira pessoal focado em ajudar indivíduos endividados a recuperar o controle de suas finanças.
              </p>
              <p className="mt-2">
                Com ferramentas intuitivas e análises inteligentes, você terá clareza sobre sua situação financeira e um plano de ação para melhorar.
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Privacidade e Segurança</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Seus dados financeiros são criptografados e armazenados com segurança. Você tem controle total sobre suas informações.
              </p>
              <p className="mt-2">
                Nunca compartilhamos seus dados com terceiros sem sua permissão explícita.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

