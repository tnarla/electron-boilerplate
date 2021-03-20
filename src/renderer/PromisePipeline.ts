type PromiseCreator = () => Promise<any>;

export class PromisePipeline {
  #promises: PromiseCreator[] = [];

  add(creator: PromiseCreator) {
    this.#promises.push(creator);

    if (this.#promises.length === 1) {
      this.next();
    }

    return this;
  }

  start(creator: PromiseCreator) {
    this.add(creator);
    return (cleanup: () => Promise<void>) => {
      const creatorIndex = this.#promises.indexOf(creator);
      // It can be removed:
      if (creatorIndex >= 1) {
        this.#promises.splice(creatorIndex, 1);
      } else {
        this.add(cleanup);
      }
    };
  }

  private async next() {
    const [creator] = this.#promises;
    if (creator) {
      await creator();
      this.#promises.shift();
      this.next();
    }
  }
}
