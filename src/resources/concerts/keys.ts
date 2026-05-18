export const concertKeys = {
  all: ['concerts'] as const,
  lists: () => [...concertKeys.all, 'list'] as const,
  public: (username: string) => [...concertKeys.all, 'public', username] as const,
}
