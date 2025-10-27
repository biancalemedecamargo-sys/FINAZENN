import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Goals() {
  const { data: goals = [], isLoading, refetch } = trpc.goals.list.useQuery();
  const createMutation = trpc.goals.create.useMutation();
  const updateMutation = trpc.goals.update.useMutation();
  const deleteMutation = trpc.goals.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    category: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        targetAmount: Math.round(parseFloat(formData.targetAmount) * 100),
        currentAmount: Math.round(parseFloat(formData.currentAmount || '0') * 100),
        category: formData.category,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      });
      toast.success('Meta adicionada com sucesso!');
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        deadline: '',
      });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao adicionar meta');
    }
  };

  const handleUpdateProgress = async (id: number, newAmount: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        currentAmount: newAmount,
      });
      toast.success('Meta atualizada com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao atualizar meta');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Meta removida com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao remover meta');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const progressPercent = totalTarget > 0 ? ((totalProgress / totalTarget) * 100).toFixed(1) : '0';

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
              Metas Financeiras
            </h1>
            <p className="text-muted-foreground">
              Defina e acompanhe suas metas de economia
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Meta Financeira</DialogTitle>
                <DialogDescription>
                  Defina uma nova meta de economia
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome da Meta</label>
                  <Input
                    placeholder="Ex: Viagem, Carro, Casa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    placeholder="Ex: Lazer, Transporte, Moradia"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Valor Alvo (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valor Atual (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Data Limite</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Adicionar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo Geral */}
        <Card className="glass mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-yellow-500" />
              Progresso Geral de Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progresso Total</span>
                  <span className="text-sm font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-card/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(parseFloat(progressPercent), 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Acumulado</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(totalProgress)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meta Total</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(totalTarget)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Faltam</p>
                  <p className="text-lg font-bold text-yellow-500">
                    {formatCurrency(totalTarget - totalProgress)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Metas */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Minhas Metas</CardTitle>
            <CardDescription>
              {goals.length} meta(s) registrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma meta registrada ainda. Comece definindo suas metas!
              </p>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = goal.targetAmount > 0
                    ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
                    : '0';
                  const remaining = goal.targetAmount - goal.currentAmount;
                  const daysLeft = goal.deadline
                    ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-lg">
                            {goal.name}
                          </p>
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            {goal.category && <span>{goal.category}</span>}
                            {daysLeft !== null && (
                              <span className={daysLeft < 0 ? 'text-red-500' : ''}>
                                {daysLeft < 0 ? 'Vencida' : `${daysLeft} dias restantes`}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full bg-card/50 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                            style={{ width: `${Math.min(parseFloat(progress), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                          </span>
                          <span className="font-semibold text-foreground">
                            {progress}%
                          </span>
                        </div>
                      </div>

                      {remaining > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Faltam {formatCurrency(remaining)} para atingir a meta
                        </p>
                      )}
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

