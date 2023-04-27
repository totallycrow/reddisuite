export class FormObserver {
  private static instance: FormObserver;
  subscribers: IFormItem[] = [];

  private constructor() {
    // Empty constructor
  }

  public static getInstance(): FormObserver {
    if (!FormObserver.instance) {
      FormObserver.instance = new FormObserver();
    }
    return FormObserver.instance;
  }

  public subscribe(formItem: IFormItem) {
    this.subscribers.push(formItem);
  }

  public cleanSubscribers() {
    this.subscribers = [];
  }

  private delay(millisec: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, millisec);
    });
  }

  public publish() {
    for (let i = 0; i < this.subscribers.length; i++) {
      void this.subscribers[i]?.sendData();
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
    const listItem = this.getFormItemBySubreddit(item.subreddit);

    if (!listItem) return false;

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
    listItem.isSubmitted = true;

    return true;
  }

  public updateIdleStatus(subreddit: string, status: boolean) {
    const listItem = this.getFormItemBySubreddit(subreddit);

    if (!listItem) return false;

    listItem.isIdle = status;
    return true;
  }
  public setIsError(subreddit: string, status: boolean) {
    const listItem = this.getFormItemBySubreddit(subreddit);

    if (!listItem) return false;

    listItem.isError = status;
    return true;
  }

  public isFullyValidated() {
    if (this.subscribers.length === 0) return false;
    return this.subscribers.every((listItem) => listItem.validated === true);
  }

  public isAnyInputSubmitted() {
    if (this.subscribers.length === 0) return false;

    return this.subscribers.some(
      (listItem) => listItem.successfullySubmitted === true
    );
  }

  public setIsSubmitting(subreddit: string, status: boolean) {
    const listItem = this.getFormItemBySubreddit(subreddit);

    if (!listItem) return false;
    listItem.isSubmitting = status;
    return true;
  }

  public isAnyInputSubmitting() {
    if (this.subscribers.length === 0) return false;

    return this.subscribers.some((listItem) => listItem.isSubmitting === true);
  }
}

export interface IFormItem {
  sendData: () => Promise<void>;
  isSubmitted: boolean;
  isSubmitting: boolean;
  successfullySubmitted: boolean;
  validated: boolean;
  isIdle: boolean;
  isError: boolean;
  subreddit: string;
  title: string;
  link: string;
  flairID: string;
}
