import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSMS(phoneNumber: string, message: string): Promise<NotificationResult> {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('TWILIO_PHONE_NUMBER não configurado');
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return {
      success: true,
      messageId: result.sid,
    };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

export async function sendWhatsApp(phoneNumber: string, message: string): Promise<NotificationResult> {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('TWILIO_PHONE_NUMBER não configurado');
    }

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
    });

    return {
      success: true,
      messageId: result.sid,
    };
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Enviar notificação de dívida vencendo
 */
export async function notifyDebtDue(phoneNumber: string, debtName: string, dueDate: Date, amount: number): Promise<NotificationResult> {
  const message = `
💰 Lembrete: Dívida Vencendo

Sua dívida "${debtName}" vence em ${new Date(dueDate).toLocaleDateString('pt-BR')}.
Valor: R$ ${(amount / 100).toFixed(2)}

Acesse seu FinanceZenn para mais detalhes.
  `.trim();

  return sendSMS(phoneNumber, message);
}

/**
 * Enviar notificação de meta atingida
 */
export async function notifyGoalReached(phoneNumber: string, goalName: string, amount: number): Promise<NotificationResult> {
  const message = `
🎉 Parabéns!

Você atingiu sua meta "${goalName}"!
Valor: R$ ${(amount / 100).toFixed(2)}

Continue assim! Seu futuro financeiro agradece.
  `.trim();

  return sendSMS(phoneNumber, message);
}

/**
 * Enviar notificação de insight diário
 */
export async function notifyDailyInsight(phoneNumber: string, insight: string): Promise<NotificationResult> {
  const message = `
💡 Insight do Dia

${insight}

Acesse seu FinanceZenn para mais análises.
  `.trim();

  return sendSMS(phoneNumber, message);
}

/**
 * Enviar notificação de reserva de emergência
 */
export async function notifyEmergencyReserve(phoneNumber: string, current: number, target: number): Promise<NotificationResult> {
  const percent = target > 0 ? ((current / target) * 100).toFixed(1) : '0';
  const message = `
🛡️ Reserva de Emergência

Progresso: ${percent}%
Atual: R$ ${(current / 100).toFixed(2)}
Meta: R$ ${(target / 100).toFixed(2)}

Continue economizando!
  `.trim();

  return sendSMS(phoneNumber, message);
}

/**
 * Enviar notificação de investimento
 */
export async function notifyInvestmentUpdate(phoneNumber: string, investmentName: string, gain: number, gainPercent: number): Promise<NotificationResult> {
  const emoji = gainPercent >= 0 ? '📈' : '📉';
  const message = `
${emoji} Atualização de Investimento

${investmentName}
Ganho: R$ ${(gain / 100).toFixed(2)} (${gainPercent.toFixed(2)}%)

Acompanhe seu portfólio no FinanceZenn.
  `.trim();

  return sendSMS(phoneNumber, message);
}

