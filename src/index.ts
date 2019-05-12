interface IData {
  [props: string]: any;
}

interface ICallback {
  __cbs__: Array<() => any>;
  [props: string]: any;
}

export default class Event {
  [data: string]: any;
  public callback: ICallback = {
    __cbs__: [],
  };

  constructor(data: IData = {}) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  public emit(name: string = '') {
    const curr: ICallback | false = this.getCallback(name);
    const walk = (cbObj: ICallback) => {
      if (cbObj.__cbs__) {
        cbObj.__cbs__.forEach(cb => cb());
      }
      for (const k in cbObj) {
        if (cbObj.hasOwnProperty(k)) {
          walk(cbObj[k]);
        }
      }
    };

    if (curr) {
      walk(curr);
    }
  }

  public emitSelf(name: string = '') {
    const curr: ICallback | false = this.getCallback(name);
    if (curr && curr.__cbs__) {
      curr.__cbs__.forEach(cb => cb());
    }
  }

  public on(name: string | (() => any), func: () => any = () => undefined) {
    if (typeof name === 'function') {
      func = name;
      name = '';
    }
    const curr: ICallback = this.getCallback(name, true) as ICallback;
    curr.__cbs__.push(func);
  }

  public off(name: string = '') {
    const nameList = name.split('.');
    const currName = nameList.pop();
    const prev = this.getCallback(nameList.join('.')) || this.callback;

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

  public getCallback(name: string = '', create: boolean = false): ICallback | false {
    const nameList: string[] = name === '' ? [] : name.split('.');
    let curr = this.callback;

    for (const currName of nameList) {
      if (!curr[currName]) {
        if (create) {
          curr[currName] = {
            __cbs__: [],
          };
        } else {
          return false;
        }
      }
      curr = curr[currName];
    }
    return curr;
  }
}
