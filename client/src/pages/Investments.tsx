import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Investments() {
  const { data: investments = [], isLoading, refetch } = trpc.investments.list.useQuery();
  const createMutation = trpc.investments.create.useMutation();
  const deleteMutation = trpc.investments.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: '',
    returnRate: '',
    currentValue: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        amount: Math.round(parseFloat(formData.amount) * 100),
        type: formData.type,
        returnRate: Math.round(parseFloat(formData.returnRate || '0') * 100),
        currentValue: Math.round(parseFloat(formData.currentValue) * 100),
      });
      toast.success('Investimento adicionado com sucesso!');
      setFormData({
        name: '',
        amount: '',
        type: '',
        returnRate: '',
        currentValue: '',
      });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao adicionar investimento');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Investimento removido com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao remover investimento');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const gainPercent = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : '0.00';

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Investimentos
            </h1>
            <p className="text-muted-foreground">
              Acompanhe seu portfólio de investimentos
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Investimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Investimento</DialogTitle>
                <DialogDescription>
                  Registre um novo investimento no seu portfólio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    placeholder="Ex: Ações PETR4, Tesouro Direto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Valor Investido (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valor Atual (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentValue}
                      onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <Input
                      placeholder="Ex: Ações, Renda Fixa"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Taxa de Retorno (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.returnRate}
                      onChange={(e) => setFormData({ ...formData, returnRate: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Adicionar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalInvested)}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {formatCurrency(totalCurrentValue)}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ganho/Perda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(totalGain)} ({gainPercent}%)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Investimentos */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Meus Investimentos</CardTitle>
            <CardDescription>
              {investments.length} investimento(s) registrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum investimento registrado ainda. Comece investindo!
              </p>
            ) : (
              <div className="space-y-2">
                {investments.map((inv) => {
                  const gain = inv.currentValue - inv.amount;
                  const gainPercent = inv.amount > 0 ? ((gain / inv.amount) * 100).toFixed(2) : '0.00';
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {inv.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.type} • Taxa: {(inv.returnRate / 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">
                          Investido: {formatCurrency(inv.amount)}
                        </p>
                        <p className={`text-sm font-semibold ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPercent}%)
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(inv.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

