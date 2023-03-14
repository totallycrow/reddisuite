export interface IFormItem {
  sendData: () => void;
  subreddit: string;
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
  public publish() {
    this.subscribers.forEach((formItem) => {
      console.log(formItem.sendData);
      console.log(formItem.subreddit);
      formItem.sendData();
    });
  }
  public getFormItems() {
    return this.subscribers;
  }
  public updateFormItem(item: IFormItem) {
    this.subscribers.forEach((formItem) => {
      if (formItem.subreddit === item.subreddit) {
        formItem = item;
      }
    });
  }
}
