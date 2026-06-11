@AGENTS.md

# Habitat

Aplicativo mobile em React Native com Expo para acompanhamento de hábitos e anotações pessoais.

## Visão geral

- **Objetivo:** permitir que o usuário crie, acompanhe e edite hábitos, notas e registros vinculados a dias específicos.
- **Navegação:** fluxo principal com autenticação, abas de conteúdo e rotas de edição/criação em um `RootStack`.
- **Persistência:** uso de `AsyncStorage` via stores do Zustand para salvar sessão, hábitos e notas localmente.

## Componentes principais

- **`App.tsx`**: ponto de entrada visual do app; renderiza o navegador principal.
- **`index.ts`**: registra o componente raiz no Expo.
- **`src/navigation/`**: definição dos fluxos de navegação.
	- `AuthStack.tsx`: telas de login, registro e recuperação de senha.
	- `MainTabs.tsx`: abas principais do app (`Home`, `Hábitos`, `Anotações`, `Perfil`, `Admin` quando aplicável).
	- `AppNavigator.tsx`: navegação raiz, controle de sessão carregada e rotas globais como criação/edição.
- **`src/screens/`**: telas da aplicação.
	- `HomeScreen.tsx`: painel inicial com métricas, calendário e modal de eventos por dia.
	- `HabitsListScreen.tsx`: lista de hábitos, progresso e acesso a criação/edição.
	- `NotesListScreen.tsx`: lista de anotações, busca e acesso a criação/edição.
	- `CreateHabitScreen.tsx` / `EditHabitScreen.tsx`: criação e edição de hábitos.
	- `CreateNoteScreen.tsx` / `EditNoteScreen.tsx`: criação e edição de notas.
	- `LoginScreen.tsx`, `RegisterScreen.tsx`, `ForgotPasswordScreen.tsx`: autenticação.
	- `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `SettingsScreen.tsx`, `AdminScreen.tsx`: perfil, ajustes e áreas auxiliares.
- **`src/components/`**: componentes reutilizáveis de interface.
	- `Button.tsx`: botão padrão do app.
	- `Input.tsx`: campo de entrada padronizado.
	- `HabitCard.tsx`: card de hábito com ações de concluir, editar e excluir.
	- `NoteCard.tsx`: card de anotação com edição/favorito.
- **`src/store/`**: estados globais com Zustand.
	- `useAuthStore.ts`: sessão, login, cadastro, logout e perfil.
	- `useHabitsStore.ts`: hábitos, recorrência, streak, progresso e exclusão.
	- `useNotesStore.ts`: notas, favoritos, atualização e exclusão.
- **`src/types/`**: tipos centrais do domínio.
	- `habit.ts`: estrutura de hábitos e labels de frequência.
	- `note.ts`: estrutura de notas, incluindo vínculo com data.
	- `user.ts`: estrutura do usuário.
- **`src/styles/`**: cores e tema visual.

## Regras importantes

- Hábitos podem ser `single`, `daily`, `weekly`, `monthly` ou `custom`.
- `single` representa hábito único, sem recorrência.
- Hábitos recorrentes são ancorados à data de criação.
- Notas podem ser vinculadas a um dia específico via `linkedDate`.
- O calendário da Home exibe hábitos e notas por dia, com modal para criação/edição.
