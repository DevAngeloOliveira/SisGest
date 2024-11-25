import { Task, ReportFormData } from '../types/tasks.types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: string[][];
  theme: string;
  styles: {
    fontSize: number;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number;
    };
  };
}

export async function generateTaskReport(task: Task, reportData: ReportFormData): Promise<void> {
  const doc = new jsPDF();
  
  // Configurações de fonte
  doc.setFont('helvetica');
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Relatório de Tarefa', 105, 20, { align: 'center' });
  
  // Informações da Tarefa
  doc.setFontSize(12);
  doc.setTextColor(100);
  
  const startY = 40;
  let currentY = startY;
  
  // Título da Tarefa
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text(task.title, 20, currentY);
  currentY += 10;
  
  // Detalhes básicos
  doc.setFontSize(12);
  doc.setTextColor(100);
  
  const details = [
    `Status: ${task.status}`,
    `Prioridade: ${task.priority}`,
    `Data de Início: ${task.startDate ? format(new Date(task.startDate), 'dd/MM/yyyy') : 'Não definida'}`,
    `Data de Término: ${task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy') : 'Não definida'}`,
    `Horas Estimadas: ${task.estimatedHours}h`,
    `Horas Trabalhadas: ${task.workedHours}h`,
  ];
  
  details.forEach(detail => {
    doc.text(detail, 20, currentY);
    currentY += 7;
  });
  
  currentY += 5;
  
  // Membros da Equipe
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Membros da Equipe', 20, currentY);
  currentY += 7;
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  task.members.forEach(member => {
    doc.text(`• ${member.name} (${member.role})`, 25, currentY);
    currentY += 7;
  });
  
  currentY += 5;
  
  // Seções do Relatório
  const sections = [
    { title: 'Conclusão', content: reportData.conclusion },
    { title: 'Desafios Encontrados', content: reportData.challenges },
    { title: 'Soluções Implementadas', content: reportData.solutions },
    { title: 'Próximos Passos', content: reportData.nextSteps },
    { title: 'Recomendações', content: reportData.recommendations }
  ];
  
  sections.forEach(section => {
    // Adiciona nova página se necessário
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(section.title, 20, currentY);
    currentY += 7;
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    const lines = doc.splitTextToSize(section.content, 170) as string[];
    lines.forEach((line: string) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(line, 20, currentY);
      currentY += 7;
    });
    
    currentY += 10;
  });
  
  // Histórico de Comentários
  if (task.comments && task.comments.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Histórico de Comentários', 20, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    const commentHeaders = [['Data', 'Autor', 'Comentário']];
    const commentData = task.comments.map(comment => [
      format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm'),
      comment.authorName,
      comment.content
    ]);
    
    const tableOptions: AutoTableOptions = {
      startY: currentY,
      head: commentHeaders,
      body: commentData,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 100 }
      }
    };
    
    (doc as unknown as { autoTable: (options: AutoTableOptions) => void }).autoTable(tableOptions);
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      `Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Salva o PDF
  doc.save(`relatorio-tarefa-${task.id}.pdf`);
} 