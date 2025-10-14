export const streamFromterator = (iterator: AsyncGenerator<string>) => {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
        return;
      }
      const chunk = new TextEncoder().encode(value);
      controller.enqueue(chunk);
    },
  });
};
