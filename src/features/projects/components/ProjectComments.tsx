import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

interface ProjectCommentsProps {
  projectId: string;
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      // Simulando carregamento de comentários
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Exemplo de comentário',
          authorId: '1',
          createdAt: new Date()
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        content: comment,
        authorId: '1', // Substituir pelo ID do usuário atual
        createdAt: new Date()
      };
      
      setComments(prev => [...prev, newComment]);
      setComment('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comentários</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border p-3 min-h-[100px]"
          placeholder="Adicione um comentário..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar Comentário
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 