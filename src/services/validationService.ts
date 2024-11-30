import { z } from 'zod';

// Schemas de validação
export const loginSchema = z.object({
    email: z
        .string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório'),
    password: z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
        ),
});

export const projectSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    description: z
        .string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    startDate: z.date({
        required_error: 'Data de início é obrigatória',
        invalid_type_error: 'Data de início inválida',
    }),
    endDate: z.date({
        required_error: 'Data de término é obrigatória',
        invalid_type_error: 'Data de término inválida',
    }).optional(),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    managerId: z.string().uuid('ID do gerente inválido'),
    teamIds: z.array(z.string().uuid('ID de membro da equipe inválido')),
});

export const userSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z
        .string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório'),
    password: z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
        ),
    role: z.enum(['ADMIN', 'MANAGER', 'COLLABORATOR']),
});

// Tipos inferidos dos schemas
export type LoginData = z.infer<typeof loginSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type UserData = z.infer<typeof userSchema>;

// Função helper para validação
export async function validateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
    try {
        const validData = await schema.parseAsync(data);
        return { success: true, data: validData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: error };
        }
        throw error;
    }
}

// Hook para formulários
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
    return {
        validate: async (data: unknown) => validateData(schema, data),
        schema,
    };
} 