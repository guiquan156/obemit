interface IData {
  [props: string]: any;
}

interface ICallback {
  __cbs__: Array<() => any>;
  [props: string]: any;
}

export default class Event {
  [data: string]: any;
  callback: ICallback = {
    __cbs__: [],
  };

  constructor(data: IData) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  emit(name: string = '') {
    let curr: ICallback | false = this.getCallback(name);

    if (!curr) return;
    curr.__cbs__.forEach(cb => cb());
  }

  on(name: string = '', func: () => any) {
    let curr: ICallback = <ICallback>this.getCallback(name, true);
    curr.cbs.push(func);
  }

  off(name: string = '') {
    let nameList = name.split('.');
    let currName = nameList.pop();
    let prev = this.getCallback(nameList.join('.')) || this.callback;

    if (!currName) {
      this.callback = {
        __cbs__: [],
      };
      return;
    }
    prev[currName] = {
      __cbs__: [],
    };
  }

  getCallback(name: string, create: boolean = false): ICallback | false {
    let nameList: Array<string> = name.split('.');
    let curr = this.callback;

    for (let i = 0; i < nameList.length; i++) {
      let _curr = curr[nameList[i]];
      if (!_curr) {
        if (create) {
          _curr = {
            __cbs__: [],
          };
        } else {
          return false;
        }
      }
      curr = _curr;
    }

    return curr;
  }
}
