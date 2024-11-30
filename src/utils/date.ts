export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const isOverdue = (date: Date | string): boolean => {
  return new Date(date) < new Date();
}; 