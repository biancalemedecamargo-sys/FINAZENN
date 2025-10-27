import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Transactions() {
  const { data: transactions = [], isLoading, refetch } = trpc.transactions.list.useQuery();
  const createMutation = trpc.transactions.create.useMutation();
  const deleteMutation = trpc.transactions.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        description: formData.description,
        amount: Math.round(parseFloat(formData.amount) * 100),
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date),
      });
      toast.success('Transação adicionada com sucesso!');
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao adicionar transação');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Transação removida com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao remover transação');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

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
              Transações
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas receitas e despesas
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Transação</DialogTitle>
                <DialogDescription>
                  Registre uma nova receita ou despesa
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Salário, Compras no supermercado"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valor (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    placeholder="Ex: Alimentação, Transporte"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Adicionar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ArrowDownLeft className="h-4 w-4 mr-2 text-red-500" />
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpense)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Transações */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              {transactions.length} transação(ões) registrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma transação registrada ainda. Comece adicionando uma!
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'income'
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}>
                          {tx.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {tx.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

