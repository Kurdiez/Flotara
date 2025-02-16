export const QUEUES = [
  'NEW_CARDS_MATCH_ALERT',
  'TYPESENSE_POSTS_CLEANUP',
] as const;

export const QUEUE = Object.freeze(
  QUEUES.reduce(
    (acc, queueName) => ({
      ...acc,
      [queueName]: queueName,
    }),
    {} as { [K in (typeof QUEUES)[number]]: K },
  ),
);

export const JOBS = {
  [QUEUE.NEW_CARDS_MATCH_ALERT]: {
    DEFAULT_JOB: 'DEFAULT_JOB',
  },
  [QUEUE.TYPESENSE_POSTS_CLEANUP]: {
    DEFAULT_JOB: 'DEFAULT_JOB',
  },
};
