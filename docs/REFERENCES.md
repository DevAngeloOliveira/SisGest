# Referências Oficiais

## React

### Documentação Principal
- [React Docs - Novo](https://react.dev/)
- [React TypeScript Guide](https://react.dev/learn/typescript)
- [React + TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)

### Hooks
- [useState](https://react.dev/reference/react/useState)
- [useEffect](https://react.dev/reference/react/useEffect) 
- [useContext](https://react.dev/reference/react/useContext)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useRef](https://react.dev/reference/react/useRef)

### Componentes
- [Components](https://react.dev/learn/your-first-component)
- [Props](https://react.dev/learn/passing-props-to-a-component)
- [Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

### Padrões
- [Code Splitting](https://react.dev/reference/react/lazy)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Portals](https://react.dev/reference/react-dom/createPortal)

## TypeScript

### Documentação Principal
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript + React](https://www.typescriptlang.org/docs/handbook/react.html)

### Tipos Básicos
- [Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Type Aliases](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases)
- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

### Tipos Avançados
- [Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types)

### Configuração
- [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### Padrões Comuns em React + TypeScript

#### Componentes
```typescript
// Functional Component com Props
interface Props {
  name: string;
  age?: number;
  onClick: (name: string) => void;
}

const MyComponent: React.FC<Props> = ({ name, age, onClick }) => {
  return (
    <div onClick={() => onClick(name)}>
      {name} {age}
    </div>
  );
};

// Com children
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
```

#### Hooks
```typescript
// useState com tipo explícito
const [value, setValue] = useState<string>('');

// useState com tipo inferido
const [user, setUser] = useState({ name: '', age: 0 });

// useReducer com tipos
interface State {
  count: number;
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
  }
};
```

#### Context
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar o context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Event Handlers
```typescript
// Eventos do DOM
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('clicked');
};
```

### Boas Práticas

1. **Sempre defina tipos para Props**
```typescript
// ❌ Evite
const Button = (props: any) => { ... }

// ✅ Faça
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => { ... }
```

2. **Use Type Assertions com moderação**
```typescript
// ❌ Evite uso excessivo de type assertions
const value = someValue as string;

// ✅ Faça validação de tipos
if (typeof someValue === 'string') {
  // someValue é string aqui
}
```

3. **Evite `any`**
```typescript
// ❌ Evite
const handleData = (data: any) => { ... }

// ✅ Faça
interface Data {
  id: string;
  value: number;
}

const handleData = (data: Data) => { ... }
```

4. **Use Discriminated Unions para estados**
```typescript
// ✅ Faça
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

### Ferramentas Recomendadas

1. **VS Code Extensions**
- ESLint
- TypeScript ESLint
- Prettier
- Error Lens
- TypeScript Hero

2. **Configuração do ESLint**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

3. **Configuração do tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

## Links Úteis

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React+TypeScript Starter Projects](https://github.com/typescript-cheatsheets/react#reacttypescript-starter-kits) 