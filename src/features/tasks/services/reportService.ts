import { Task } from '@/types/task.types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const generateTaskReport = async (tasks: Task[]): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(16);
  doc.text('Relatório de Tarefas', pageWidth / 2, 20, { align: 'center' });

  // Data do relatório
  doc.setFontSize(10);
  doc.text(
    `Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );

  // Conteúdo
  doc.setFontSize(12);
  let yPosition = 50;

  tasks.forEach((task, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${task.title}`, 20, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Status e Prioridade
    doc.text(`Status: ${task.status} | Prioridade: ${task.priority}`, 25, yPosition);
    yPosition += 7;

    // Descrição
    if (task.description) {
      const descriptionLines = doc.splitTextToSize(task.description, pageWidth - 40);
      doc.text(descriptionLines, 25, yPosition);
      yPosition += 7 * descriptionLines.length;
    }

    // Data de vencimento
    if (task.dueDate) {
      doc.text(
        `Vencimento: ${format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}`,
        25,
        yPosition
      );
      yPosition += 7;
    }

    // Espaço entre tarefas
    yPosition += 10;
  });

  return doc.output('blob');
};

export const exportTasksToCSV = async (tasks: Task[]): Promise<string> => {
  const headers = ['ID', 'Título', 'Descrição', 'Status', 'Prioridade', 'Data Vencimento'];
  const rows = tasks.map(task => [
    task.id,
    task.title,
    task.description,
    task.status,
    task.priority,
    task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy') : ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}; 