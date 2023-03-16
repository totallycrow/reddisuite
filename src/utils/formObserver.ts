export interface IFormItem {
  sendData: () => void;
  successfullySubmitted: boolean;
  validated: boolean;
  subreddit: string;
  title: string;
  link: string;
  flairID: string;
}

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class FormObserver {
  private static instance: FormObserver;
  subscribers: IFormItem[] = [];

  // class Observer {
  //   subscribers = [];

  //   subscribe({ onSuccess, getData, onError, onLoading, mutate }) {
  //     this.subscribers.push({ onSuccess, getData, onError, onLoading });
  //   }

  //   publish() {
  //     const res = [];

  //     this.subscribers.forEach((cb) => res.push(cb.getData()));

  //     mutate(res);
  //   }
  // }

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    // Empty constructor
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): FormObserver {
    if (!FormObserver.instance) {
      FormObserver.instance = new FormObserver();
    }
    return FormObserver.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  public someBusinessLogic() {
    // ...
  }
  public subscribe(formItem: IFormItem) {
    this.subscribers.push(formItem);
  }

  private waitforme(millisec: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, millisec);
    });
  }

  private delay: (ms: number) => void = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  public async publish() {
    console.log("******()()()()() PUBLISH FIRED ^^^^^^^^^^^^^^^^^^");

    const calls = [];

    this.subscribers.forEach((formItem) => {
      console.log("******()()()()() FOREACH FIRED ^^^^^^^^^^^^^^^^^^");

      console.log(formItem.sendData);
      console.log(formItem.subreddit);
      calls.push(formItem.sendData);
    });

    for (let i = 0; i < this.subscribers.length; i++) {
      console.log("******()()()()() LOOP FIRED ^^^^^^^^^^^^^^^^^^");
      await this.waitforme(1000);
      this.subscribers[i]?.sendData();
    }
  }
  public getFormItems() {
    return this.subscribers;
  }

  public getFormItemBySubreddit(subreddit: string) {
    return this.subscribers.find((item) => item.subreddit === subreddit);
  }

  public areFormItemsIdentical(formItem: IFormItem) {
    if (!this.isSubredditInList(formItem.subreddit)) return false;

    const listItem = this.getFormItemBySubreddit(formItem.subreddit);

    if (!listItem) return false;

    if (listItem.title === formItem.title && listItem.link === formItem.link)
      return true;
  }

  public updateFormItem(item: IFormItem) {
    console.log("UPDATE FROM CLASS");
    const listItem = this.getFormItemBySubreddit(item.subreddit);

    if (!listItem) return false;

    console.log(listItem);
    console.log(item);
    listItem.title = item.title;
    (listItem.link = item.link), (listItem.subreddit = item.subreddit);
    listItem.sendData = item.sendData;
    (listItem.validated = item.validated), (listItem.flairID = item.flairID);
    return true;
  }

  public isSubredditInList(subreddit: string) {
    return this.subscribers.some(
      (listItem) =>
        listItem.subreddit.trim().toUpperCase() ===
        subreddit.trim().toUpperCase()
    );
  }

  public updateSubmissionStatus(subreddit: string, status: boolean) {
    const listItem = this.getFormItemBySubreddit(subreddit);

    if (!listItem) return false;
    listItem.successfullySubmitted = status;
    return true;
  }

  public isFullyValidated() {
    console.log("IS FULLY VALIDATED FIRED!!!!");
    if (this.subscribers.length === 0) return false;

    console.log("TESTING");
    return this.subscribers.every((listItem) => listItem.validated === true);
  }

  public isAnyInputSubmitted() {
    console.log("IS FULLY SUBMITTED FIRED!!!!");
    if (this.subscribers.length === 0) return false;

    console.log("TESTING");
    return this.subscribers.some(
      (listItem) => listItem.successfullySubmitted === true
    );
  }
}
