import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Debts() {
  const { data: debts = [], isLoading, refetch } = trpc.debts.list.useQuery();
  const createMutation = trpc.debts.create.useMutation();
  const deleteMutation = trpc.debts.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minPayment: '',
    dueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        amount: Math.round(parseFloat(formData.amount) * 100),
        interestRate: Math.round(parseFloat(formData.interestRate || '0') * 100),
        minPayment: Math.round(parseFloat(formData.minPayment || '0') * 100),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });
      toast.success('Dívida adicionada com sucesso!');
      setFormData({
        name: '',
        amount: '',
        interestRate: '',
        minPayment: '',
        dueDate: '',
      });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao adicionar dívida');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Dívida removida com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao remover dívida');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);

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
              Dívidas
            </h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe suas dívidas
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Dívida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Dívida</DialogTitle>
                <DialogDescription>
                  Adicione uma dívida para acompanhamento
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome da Dívida</label>
                  <Input
                    placeholder="Ex: Cartão de Crédito, Empréstimo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Valor Total (R$)</label>
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
                    <label className="text-sm font-medium">Taxa de Juros (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Pagamento Mínimo (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.minPayment}
                      onChange={(e) => setFormData({ ...formData, minPayment: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data de Vencimento</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Registrar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="glass border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Total de Dívidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(totalDebt)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Reduza suas dívidas para melhorar sua saúde financeira
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pagamento Mínimo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalMinPayment)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Valor mínimo recomendado para pagar este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Dívidas */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Minhas Dívidas</CardTitle>
            <CardDescription>
              {debts.length} dívida(s) registrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {debts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Parabéns! Você não tem dívidas registradas.
              </p>
            ) : (
              <div className="space-y-2">
                {debts.map((debt) => {
                  const jurosEstimados = (debt.amount * debt.interestRate) / 10000;
                  return (
                    <div
                      key={debt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {debt.name}
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Taxa: {(debt.interestRate / 100).toFixed(1)}%</span>
                          {debt.dueDate && (
                            <span>Vencimento: {new Date(debt.dueDate).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-sm text-red-500 font-semibold">
                          {formatCurrency(debt.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Juros est.: {formatCurrency(jurosEstimados)}
                        </p>
                        {debt.minPayment > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Mín.: {formatCurrency(debt.minPayment)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(debt.id)}
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

